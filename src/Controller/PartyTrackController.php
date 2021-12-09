<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
//use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Doctrine\Persistence\ManagerRegistry;

use App\Entity\Party;
use App\Entity\Track;
use App\Entity\TrackInParty;

class PartyTrackController extends AbstractController
{
    /**
     * @Route("/api/{party_uid}/{track_uid}", name="party_track")
     */
    public function index(string $party_uid, string $track_uid, ManagerRegistry $doctrine): JsonResponse
    {
        Party::verifyMatchUid($party_uid);
        Track::verifyMatchUid($track_uid);

        $infos = $this->fetchPartyAndTrackInformation($party_uid, $track_uid, $doctrine);
        $party = $infos[0];
        $track_in_party = $infos[1];
        $track = $infos[2];

        $response_array = $this->createJsonArray($party, $track_in_party, $track);

        return new JsonResponse($response_array);
    }

    private function fetchPartyAndTrackInformation(string $party_uid, string $track_uid, ManagerRegistry $doctrine) {
        $entityManager = $doctrine->getManager();

        $party = $this->fetchParty($party_uid, $entityManager);
        $track_in_party = $party->getTrackRelationByUid($track_uid);
        if (empty($track_in_party)) {
            throw new HttpException(404, 'Track not found.');
        }
        $track = $track_in_party->getTrackId();

        return [
            $party,
            $track_in_party,
            $track
        ];
    }

    private function fetchParty($party_uid, $entityManager) {
        $parties = $entityManager->getRepository(Party::class)->findBy(['uid' => $party_uid]);
        if (empty($parties)) {
            throw new HttpException(404, 'Party not found.');
        }
        else if (count($parties) > 1) {
            // Should not happen: conflicting party uids.
            throw new HttpException(500);
        }

        return $parties[0];
    }

    private function createJsonArray($party, $track_in_party, $track) {
        return [
            "party_id" => $party->getUid(),
            "track_id" => $track->getTrackId(),
            "track_title" => $track->getTitle(),
            "state_for_party" => $track_in_party->getState(),
            "order" => $track_in_party->getOrderInList(),
            "state_track" => $track->getState(),
            "download_path" => $track->getPath(),
        ];
    }

    /**
     * @Route("/api/{party_uid}", name="party_playlist")
     */
    public function partyPlaylist(string $party_uid, ManagerRegistry $doctrine) : JsonResponse
    {
        {
            Party::verifyMatchUid($party_uid);

            $entityManager = $doctrine->getManager();

            $party = $this->fetchParty($party_uid, $entityManager);
            $tracks_in_party = $party->getTrackInParties();
            if (empty($tracks_in_party)) {
                throw new HttpException(404, 'Tracks not found.');
            }

            $response_array = [];
            foreach($tracks_in_party as $track_in_party) {
                $track = $track_in_party->getTrackId();
                $response_array[] = $this->createJsonArray($party, $track_in_party, $track);
            }
    
            return new JsonResponse($response_array);
        }
    }

}
