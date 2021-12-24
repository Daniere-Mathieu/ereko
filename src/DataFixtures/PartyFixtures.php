<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Party;
use Faker\Factory;

class PartyFixtures extends Fixture
{
    protected $faker;

    public function load(ObjectManager $manager): void
    {
        $this->faker = Factory::create();

        for( $i = 0 ; $i < 10 ; $i++) {
            $party = new Party();
            $party->setCurrentTrack($this->faker->numberBetween(0, 5));

            $date = $this->faker->dateTimeBetween('-10 days', '+50 days');
            $party->setDate($date);
            
            $end_date = clone $date;
            $end_date->add(new \DateInterval("P10DT0H0M0S"));
            $party->setEndDate($end_date);

            $manager->persist($party);
        }
        $manager->flush();

    }
}
