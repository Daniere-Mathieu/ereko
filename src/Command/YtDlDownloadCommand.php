<?php

namespace App\Command;

use Wrep\Daemonizable\Command\EndlessCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Lock\LockFactory;
use Symfony\Component\Lock\Store\FlockStore;
use Symfony\Component\Lock\Exception\LockConflictedException;
use Doctrine\ORM\EntityManagerInterface;
use App\Service\YoutubeDownloader;

use App\Entity\Track;

class YtDlDownloadCommand extends EndlessCommand
{
    protected static $defaultName = 'yt-dl:download';
    protected static $defaultDescription = 'Download all tracks to be downloaded. Daemonizable command.';
    private $lock;

    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->setTimeout(1.5); // execute command each 1.5 seconds
    }

    protected function initialize(InputInterface $input, OutputInterface $output)
	{
		// Should remove each *.part files
        $output->writeln("Downloading videos...");
	}

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $store = new FlockStore();
        $lock_factory = new LockFactory($store);
        // use static method to avoid locks being different thanks to the scope.
        $this->lock = $lock_factory->createLock('yt-downloader');

        if ($this->lock->acquire() === false) {
            // exit of the loop
            throw new LockConflictedException('Downloader already active');
        }

        $track = $this->getPriorityTrackToDownload();
        if (empty($track)) {
            return 0;
        }
        echo 'coucou ' . $track->getTrackId();
        
        // pass its state to DOWNLOADING
        $track->setState(Track::$available_states[1]);
        $this->entityManager->persist($track);
        $this->entityManager->flush();

        $downloader = new YoutubeDownloader($track->getTrackId());

        if ( ! $this->checkTrackLength($track, $downloader, $output)) {
            return 1;
        }

        try {
            $downloader->download();
            // set status to READY
            $track->setState(Track::$available_states[2]);
        }
        catch (\RuntimeException $e) {
            // update errors counter
            $track->meetDownloadError();
            $message = "Download failed for video " . $track->getTrackId();
            $this->persistTrackAndDisplayError($track, $output, $message);
            return 1;		
        }
        
        // call throwExceptionOnShutdown before writing infos into the DB in case the server is stopping.
        $this->throwExceptionOnShutdown();

        $this->entityManager->persist($track);
        $this->entityManager->flush();
        // finished fine
        return 0;
    }

    private function getPriorityTrackToDownload(): ?Track
    {
        $track_repo = $this->entityManager->getRepository(Track::class);

        $states_to_download = [1, 0, 3]; // DOWNLOADING, TO_DOWNLOAD, ON_ERROR

        foreach ($states_to_download as $state) {
            $tracks = $track_repo->findBy(['state' => Track::$available_states[$state]]);
            foreach ($tracks as $track) {
                if ($track->shouldBeDownloaded()) {
                    return $track;
                }
            }
        }
        return NULL;
    }

    private function checkTrackLength($track, $downloader, $output)
    {
        try {
            $track_too_long = $downloader->isTrackTooLong();
        }
        catch ( \RuntimeException $e ) {
            // update errors counter
            $track = $track->meetDownloadError();
            $message = "Could not get duration for video " . $track->getTrackId();
            $this->persistTrackAndDisplayError($track, $output, $message);
            return false;
        }

        if ($track_too_long) {
            // set status to TOO_LONG
            $track->setState(Track::$available_states[4]);
            $message = "Video " . $track->getTrackId() . " is too long.";
            $this->persistTrackAndDisplayError($track, $output, $message);
            return false;
        }
        return true;
    }

    private function persistTrackAndDisplayError($track, $output, String $message)
    {
        $this->entityManager->persist($track);
        $this->entityManager->flush();
        $output->writeln($message);
    }

    /**
	 * Called after each iteration
	 * @param InputInterface  $input
	 * @param OutputInterface $output
	 */
	protected function finishIteration(InputInterface $input, OutputInterface $output): void
	{
		// Do some cleanup/memory management here, don't forget to call the parent implementation!
        // TODO release lock
        $this->lock->release();

		parent::finishIteration($input, $output);
	}

    // Called once on shutdown after the last iteration finished
	protected function finalize(InputInterface $input, OutputInterface $output): void
	{
		// Do some cleanup here, don't forget to call the parent implementation!
        // TODO release lock
        $this->lock->release();

		parent::finalize($input, $output);

		// Keep it short! We may need to exit because the OS wants to shutdown
		// and we can get killed if it takes to long!
	}
}
