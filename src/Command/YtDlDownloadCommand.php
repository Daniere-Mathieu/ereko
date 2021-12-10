<?php

namespace App\Command;

use Wrep\Daemonizable\Command\EndlessCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Doctrine\ORM\EntityManagerInterface;
use App\Service\YoutubeDownloader;

use App\Entity\Track;

class YtDlDownloadCommand extends EndlessCommand
{
    protected static $defaultName = 'yt-dl:download';
    protected static $defaultDescription = 'Download all tracks to be downloaded. Daemonizable command.';

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
	}

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $track_repo = $this->entityManager->getRepository(Track::class);
        
        // ??? get first DOWNLOADING track in DB (should not exist, I guess)

        // If not, get first TO_DOWNLOAD track in DB
        $track = $track_repo->findBy(['state' => Track::$available_states[0]])[0];
        // pass its state to DOWNLOADING
        $track->setState(Track::$available_states[1]);

        // download it.
        $downloader = new YoutubeDownloader();
        try {
            $downloader->download($track->getTrackId());
            // set status to READY
            $track->setState(Track::$available_states[2]);
        }
        catch (\RuntimeError $e) {
            // TODO set status to ON_ERROR
            $track->setState(Track::$available_states[3]);

            $output->writeln("Download failed for video " . $track->getTrackId());
            return 1;		
        }
        
        // call throwExceptionOnShutdown before writing infos into the DB in case the server is stopping.
        $this->throwExceptionOnShutdown();

        $this->entityManager->persist($track);
        $this->entityManager->flush();
        // finished fine
        return 0;
    }

    /**
	 * Called after each iteration
	 * @param InputInterface  $input
	 * @param OutputInterface $output
	 */
	protected function finishIteration(InputInterface $input, OutputInterface $output): void
	{
		// Do some cleanup/memory management here, don't forget to call the parent implementation!
		parent::finishIteration($input, $output);
	}

    // Called once on shutdown after the last iteration finished
	protected function finalize(InputInterface $input, OutputInterface $output): void
	{
		// Do some cleanup here, don't forget to call the parent implementation!
		parent::finalize($input, $output);

		// Keep it short! We may need to exit because the OS wants to shutdown
		// and we can get killed if it takes to long!
	}
}
