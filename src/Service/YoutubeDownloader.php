<?php

namespace App\Service;

use App\Entity\Track;

class YoutubeDownloader
{
    private static $youtube_dl_command = "youtube-dl --no-playlist \
        -x --audio-format vorbis --recode-video ogg";
    private static $output_video_file_format = "%(id)s.%(ext)s";

    private $cli_output = [];

    public function download(string $video_id) {

        $result_code = null;
        echo "\nDownloading " . $video_id;
        exec($this->createFullCommand($video_id), $this->cli_output, $result_code);

        if ($result_code === 0) {
            return true;
        }
        $this->display_cli_output();
        throw new \RuntimeException("Unable to download video " . $video_id);
    }

    private function createFullCommand(string $video_id) {
        return self::$youtube_dl_command . " -o '" . Track::$download_dir . self::$output_video_file_format . "' " . $video_id;
    }

    private function display_cli_output() {
        foreach ($this->cli_output as $line) {
            echo $line;
        }
    }




}