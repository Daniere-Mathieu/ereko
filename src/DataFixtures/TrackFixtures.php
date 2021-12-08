<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Track;
use Faker\Factory;

class TrackFixtures extends Fixture
{
    protected $faker;

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
            $track->setPath($this->faker->url);
            $track->setThumbnailPath($this->faker->url);
            $track->setState('fake_state');

            $manager->persist($track);
        }
        $manager->flush();
    }
}
