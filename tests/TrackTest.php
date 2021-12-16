<?php

namespace App\Tests;

use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpKernel\Exception\HttpException;
use App\Entity\Track;

class TrackTest extends TestCase
{
    private $forbidden_state_error_message = 'Track state forbidden';
    private $wrong_uid_error_message = 'Wrong track uid.';

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
}
