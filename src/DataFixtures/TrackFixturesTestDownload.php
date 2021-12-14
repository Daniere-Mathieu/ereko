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
