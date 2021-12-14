<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Track;
use Faker\Factory;

class TrackFixtures extends Fixture
{
    protected $faker;

    private static $paths = [
        'https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/BackgroundMusica2.ogg',
        'https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/Director.ogg',
        'https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/FaceBangSonic.ogg',
        'https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/FormulaFantasy.ogg',
        'https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/Hangout.ogg'
    ];

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
            $track->setPath($this->faker->randomElement(self::$paths));
            $track->setThumbnailPath("https://i.ytimg.com/vi/" . $track_uid . "/mqdefault.jpg");
            $track->setState($this->faker->randomElement(Track::$available_states));

            $manager->persist($track);
        }
        $manager->flush();
    }
}
