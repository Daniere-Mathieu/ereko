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

    private static $states = [
        'TO_LOAD',
        'DOWLOADING',
        'READY',
        'ON_ERROR'
    ];

    public function load(ObjectManager $manager): void
    {
        $this->faker = Factory::create();

        for( $i = 0 ; $i <= 50 ; $i++) {
            $track = new Track();

            // random strings. They would be YouTube identifiers.
            $uuid = '';
            for ($j = 0; $j <= 10; $j++) {
                $uuid .= chr(rand(ord('a'), ord('z')));
            }
            $track->setTrackId($uuid);

            $track->setTitle($this->faker->name);
            $track->setPath($this->faker->randomElement(self::$paths));
            $track->setThumbnailPath($this->faker->randomElement(self::$thumbnails));
            $track->setState($this->faker->randomElement(self::$states));

            $manager->persist($track);
        }
        $manager->flush();
    }
}
