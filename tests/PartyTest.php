<?php

namespace App\Tests;

use PHPUnit\Framework\TestCase;
use App\Entity\Party;

class PartyTest extends TestCase
{
    public function testLimitNumberOfTracksUntilLimit(): void
    {
        $party = new Party();
        $test_numbers = [1, 10, 199, 200, 201, 250];
        $limit = 200;

        foreach ($test_numbers as $tracks_number) {
            if ($tracks_number > $limit) {
                $this->expectException( "InvalidArgumentException" );
                $this->expectExceptionMessage($this->forbidden_state_error_message);
            }
            $this->addTracksToParty()
        }


        $this->assertTrue(true);
    }
}
