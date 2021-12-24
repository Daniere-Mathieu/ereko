<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\TrackInParty;
use App\Entity\Party;
use App\Entity\Track;
use Faker\Factory;

class TrackInPartyFixture extends Fixture
{
    protected $faker;

    public function load(ObjectManager $manager): void
    {
        $this->faker = Factory::create();

        for( $i = 0 ; $i <= 50 ; $i++) {

            $track_repo = $manager->getRepository(Track::class);
            $party_repo = $manager->getRepository(Party::class);
            $tracks = $track_repo->findAll();
            $parties = $party_repo->findAll();

            $track_in_party = new TrackInParty();

            //random party
            $track_in_party->setParty($this->faker->randomElement($parties));

            //random track
            $track_in_party->setTrack($this->faker->randomElement($tracks));

            //order
            $track_in_party->setOrderInList($i);

            // random state. More chances to be IN_PLAYLIST than CURRENT than REMOVED.
            $states = TrackInParty::$available_states;
            $choice_index = $this->faker->biasedNumberBetween(0, count($states)-1, $function = 'sqrt');
            $track_in_party->setState($states[$choice_index]);

            $manager->persist($track_in_party);
        }

        $manager->flush();
    }


    public function getDependencies(): array
    {
        return [
            App\DataFixtures\PartyFixtures::class,
            App\DataFixtures\TrackFixtures::class,
        ];
    }
}
