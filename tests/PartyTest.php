<?php

namespace App\Tests;

use PHPUnit\Framework\TestCase;
use App\Entity\Party;
use App\Entity\TrackInParty;

class PartyTest extends TestCase
{
    public function testLimitNumberOfTracksUntilLimit(): void
    {
        
        $test_numbers = [1, 10, 199, 200, 201, 250];
        $limit = 200;

        foreach ($test_numbers as $tracks_number) {
            echo 'case: ' . $tracks_number . "\n";

            $party = new Party();
            for($i = 0 ; $i < $tracks_number ; $i++) {
                $track_in_party = new TrackInParty();
                $party->addTrackInParty($track_in_party);
            }
            echo "track number: " . count($party->getTrackInParties()) . "\n";

            if ($tracks_number >= $limit) {
                $this->assertTrue($party->trackNumberLimitIsReached());
            }
            else {
                $this->assertFalse($party->trackNumberLimitIsReached());
            }
        }
    }
}
