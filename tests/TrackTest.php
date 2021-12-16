<?php

namespace App\Tests;

use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpKernel\Exception\HttpException;
use App\Entity\Track;

class TrackTest extends TestCase
{
    private $forbidden_state_error_message = 'Track state forbidden';
    private $wrong_uid_error_message = 'Wrong track uid.';
    private $reflection_track;

    public function testSettersAndGetters(): void
    {
        $track = new Track();
        
        $title = "test title";
        $track->setTitle($title);
        $this->assertSame($track->getTitle(), $title);

        $track_id = "test_track_id";
        $filename = $track_id . Track::$audio_format;
        $path_to_file = Track::$download_dir . $filename;
        $track->setTrackId($track_id);
        $this->assertSame($track->getTrackId(), $track_id);
        $this->assertSame($track->getFileName(), $filename);
        $this->assertSame($track->getPathToFile(), $path_to_file);

        $state = "TO_DOWNLOAD";
        $track->setState($state);
        $this->assertSame($track->getState(), $state);

        $thumbnail_path = "any/path";
        $track->setThumbnailPath($thumbnail_path);
        $this->assertSame($track->getThumbnailPath(), $thumbnail_path);
    }

    public function testSetStateException(): void
    {
        $track = new Track();
        $this->tryWrongState($track, 1);
        $this->tryWrongState($track, "WRONG_STATE");
    }
    private function tryWrongState($track, $state): void
    {
        $this->expectException( "InvalidArgumentException" );
        $this->expectExceptionMessage($this->forbidden_state_error_message);
        $track->setState($state);
    }

    public function testVerifyMatchUid(): void
    {
        $valid_uids = [
            'btPJPFnesV4',
            'btPJPFnesV_',
            '_tPJPFnesV4',
            '_tPJPFnesV_',
            'btPJPFnesV-',
            '-tPJPFnesV4',
            '-tPJPFnesV-',
            'btPJP_nesV4',
            'btPJPFn-sV4'
        ];

        foreach($valid_uids as $uid) {
            $this->assertTrue(Track::verifyMatchUid($uid));
        }
    }

    public function testVerifyMatchUidExceptions(): void
    {
        $invalid_uids = [
            'btPJPFnesV',
            'btPJPFnesV44',
            '/tPJPFnesV4',
            ':tPJPFnesV4',
            '!tPJPFnesV4',
            'btPJPFnesV/',
            'btPJPFnesV:',
            'btPJPFnesV!',
            '',
            'a'
        ];

        foreach($invalid_uids as $uid) {
            $this->expectException( HttpException::class );
            // see https://github.com/laravel/framework/issues/3979
            //$this->expectExceptionCode(400);
            $this->expectExceptionMessage($this->wrong_uid_error_message);
            Track::verifyMatchUid($uid);
        }
    }

    public function testShouldBeDownloadedWithoutTimeConcern() {
        $track = new Track();
        $states_false = ['READY', 'TOO_LONG'];
        $states_true = ['TO_DOWNLOAD', 'DOWNLOADING', 'ON_ERROR'];

        foreach ($states_false as $state) {
            $track->setState($state);
            $this->assertFalse($track->ShouldBeDownloaded());
        }

        foreach ($states_true as $state) {
            $track->setState($state);
            $this->assertTrue($track->ShouldBeDownloaded());
        }
    }

    public function testShouldBeDownloadedWithTimeConcernReturnTrue() {

        $error_retries_values = [ 0, 1, 4, 5, 6, 19, 20, 21, 39, 40, 41, 99, 100, 101, 102];

        // make private properties accessible.
        // see https://www.php.net/manual/en/reflectionproperty.setvalue.php
        // see also https://www.webtipblog.com/unit-testing-private-methods-and-properties-with-phpunit/
        $this->reflection_track = new \ReflectionClass(Track::class);
        $track_updated = $this->reflection_track->getProperty('updated');
        $track_updated->setAccessible(true);
        $track_retries = $this->reflection_track->getProperty('error_retries');
        $track_retries->setAccessible(true);

        foreach ($error_retries_values as $retries) {

            $track = new Track();
            $track->setState('ON_ERROR');
            $track_retries->setValue($track, $retries);

            switch(true) {
                case ($retries <= 5):
                    $delays = [
                        "P0DT0H0M40S" => true, // -31 seconds
                        "P0DT0H0M31S" => true, // -31 seconds
                        "P0DT0H0M30S" => true, // 30 seconds
                        "P0DT0H0M29S" => false, // 31
                        "P0DT0H0M10S" => false,
                    ];
                    break;
                case ($retries <= 20):
                    $delays = [
                        "P0DT0H0M59S" => false, // 59 sec
                        "P0DT0H1M0S" => true, // 1 min
                        "P0DT0H1M1S" => true // 1 min 1 sec
                    ];
                    break;
                case ($retries <= 40):
                    $delays = [
                        "P0DT0H4M59S" => false, // 4:59 min
                        "P0DT0H5M0S" => true, // 5 min
                        "P0DT0H5M1S" => true // 5 min 1 sec
                    ];
                    break;
                case ($retries <= 100):
                    $delays = [
                        "P0DT0H59M59S" => false, // 59 min 59
                        "P0DT1H0M0S" => true, // 1 hour
                        "P0DT1H0M1S" => true // 1 hour 1 sec
                    ];
                    break;
                default:
                    // when more than 100 retries, always abort
                    $delays = [
                        "P0DT0H0M0S" => false,
                    ];
                    break;
            }

            foreach($delays as $delay => $expected_answer) {
                    $this->assertSame(
                    $expected_answer,
                    $this->setMockUpdatedAndCompare($track, $track_updated, $retries, $delay)
                );
            }
        }
    }

    private function setMockUpdatedAndCompare(Track $track, $track_updated, $retries, String $delay) {

        $now = new \Datetime();
        $delay = new \DateInterval($delay);
        $mock_updated = $now->sub($delay);
        $track_updated->setValue($track, $mock_updated);

        return $track->shouldBeDownloaded();
    }
}
