<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Track;
use Faker\Factory;

class TrackFixturesTestDownload extends Fixture
{
    protected $faker;
    private $groups = ['test'];

    private static $paths = [
        'https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/BackgroundMusica2.ogg',
        'https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/Director.ogg',
        'https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/FaceBangSonic.ogg',
        'https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/FormulaFantasy.ogg',
        'https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/Hangout.ogg'
    ];

    private static $thumbnails = [
        'https://i.ytimg.com/vi/zOvsyamoEDg/mqdefault.jpg',
        'https://i.ytimg.com/vi/zjHCpGbaYBs/mqdefault.jpg',
        'https://i.ytimg.com/vi/nLgM1QJ3S_I/mqdefault.jpg',
        'https://i.ytimg.com/vi/zr8d9sXioj4/mqdefault.jpg'
    ];

    private static $youtube_ids = [
        'zOvsyamoEDg',
        'zjHCpGbaYBs',
        'nLgM1QJ3S_I',
        'zr8d9sXioj4',
    ];

    public function load(ObjectManager $manager): void
    {
        $this->faker = Factory::create();

        for( $i = 0 ; $i < 4 ; $i++) {
            $track = new Track();

            $track->setTrackId(self::$youtube_ids[$i]);
            $track->setTitle($this->faker->name);
            $track->setPath($this->faker->randomElement(self::$paths));
            $track->setThumbnailPath(self::$thumbnails[$i]);
            $track->setState("TO_DOWNLOAD");

            $manager->persist($track);
        }
        $manager->flush();
    }

    public static function getGroups(): array
    {
        return $this->groups;
    }
}
