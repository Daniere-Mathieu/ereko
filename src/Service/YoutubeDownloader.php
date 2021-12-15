<?php

namespace App\Service;

use App\Entity\Track;

class YoutubeDownloader
{
    /* This is temporary. Should be removed when youtube-dl will be fixed. */
    private static $youtube_dl_command = "cd /opt/youtube-dl ; python -m youtube_dl";
    /* This is the normal command */
    // private $youtube_dl_command = "youtube-dl"
    private static $output_video_file_format = "%(id)s.%(ext)s";

    private static function downloadCommand() {
        return self::$youtube_dl_command . " --no-playlist \
            -x --audio-format vorbis --recode-video ogg";
    }
    private static function durationCommand() {
        return self::$youtube_dl_command . " --get-duration";
    }
    
    private $download_dir;
    private $video_id;
    private $max_time_minutes = 20;
    private $cli_output = [];

    public function __construct(String $video_id, String $download_dir) {
        $this->video_id = $video_id;
        $this->download_dir = $download_dir;
    }

    public function download() {
        $result_code = null;
        echo "\nDownloading " . $this->video_id;
        exec($this->createFullCommand(), $this->cli_output, $result_code);

        if ($result_code === 0) {
            return true;
        }
        $this->display_cli_output();
        throw new \RuntimeException("Unable to download video " . $this->video_id);
    }

    private function createFullCommand() {
        return self::downloadCommand()
            . " -o '" . $this->download_dir . self::$output_video_file_format. "' "
            . $this->video_id
            ;
    }

    private function display_cli_output() {
        foreach ($this->cli_output as $line) {
            echo $line;
        }
    }

    public function isTrackTooLong()
    {
        $full_duration_command = self::durationCommand() . " " . $this->video_id;
        $result_code = null;
        $cli_output = [];
        exec ($full_duration_command, $cli_output, $result_code);
        if ($result_code !== 0) {
            throw new \RuntimeException("Unable to get video duration " . $this->video_id);
        }

        $time = end($cli_output);
        return $this->isTimeTooLong(explode(":", $time));
    }

    private function isTimeTooLong(Array $time)
    {
        if ($this->timeHasHours($time)) {
            return true;
        }
        else if (count($time) >= 1) {
            // video is seconds long
            return false;
        }
        return $time[0] > 20;
    }

    private function timeHasHours(Array $time)
    {
        return count($time) > 2;
    }




}