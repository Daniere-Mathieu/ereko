<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Track;
use Faker\Factory;

class TrackFixtures extends Fixture
{
    protected $faker;

    private static $thumbnails = [
        'https://i.ytimg.com/vi/jiwuQ6UHMQg/mqdefault.jpg',
        'https://i.ytimg.com/vi/BiqlZZddZEo/mqdefault.jpg',
        'https://i.ytimg.com/vi/Ps638erKAn4/mqdefault.jpg',
        'https://i.ytimg.com/vi/uT3SBzmDxGk/mqdefault.jpg'
    ];

    private static $youtube_ids = [
        'a60noPLQlTs',
        '_Yhyp-_hX2s',
        'btPJPFnesV4',
        'v2AC41dglnM',
    ];

    public function load(ObjectManager $manager): void
    {
        $this->faker = Factory::create();

        foreach( self::$youtube_ids as $track_uid) {
            $track = new Track();

            $track->setTrackId($track_uid);
            $track->setTitle($this->faker->name);
            $track->setThumbnailPath("https://i.ytimg.com/vi/" . $track_uid . "/mqdefault.jpg");
            $track->setState($this->faker->randomElement(Track::$available_states));

            $manager->persist($track);
        }
        $manager->flush();
    }
}
