<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Party;

class PartyFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // $product = new Product();
        // $manager->persist($product);

        for( $i = 0 ; $i < 25 ; $i++) {
            $party = new Party();
            $party->setCurrentTrack($i);

            $date = new \DateTime();
            $party->setDate($date);
            
            $end_date = clone $date;
            $end_date->add(new \DateInterval("P10DT0H0M0S"));
            $party->setEndDate($end_date);
            
            $manager->persist($party);
        }
        $manager->flush();

    }
}
