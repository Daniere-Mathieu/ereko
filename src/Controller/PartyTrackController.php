<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Validator\Validator\ValidatorInterface;
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
            "thumbnail_path" => $track->getThumbnailPath(),
        ];
    }

    /**
     * @Route("/api/add/{party_uid}/{track_uid}", name="party_track_add", methods="POST")
     */
    public function add(
        string $party_uid,
        string $track_uid,
        Request $request,
        ManagerRegistry $doctrine,
        ValidatorInterface $validator ): JsonResponse
    {
        Party::verifyMatchUid($party_uid);

        $track = new Track();
        $track->setTrackId($track_uid);
        $track->setThumbnailPath("https://i.ytimg.com/vi/" . $track_uid . "/mqdefault.jpg");
        $track->setPath('https://youtu.be/' . $track_uid);
        $track->setTitle($request->request->get('title'));
        $track->setState('TO_DOWNLOAD');

        $errors = $validator->validate($track);
        if (count($errors) > 0) {
            $data = [
                'type' => 'validation_error',
                'title' => 'There was a validation error',
                'errors' => $errors
            ];
            return new JsonResponse($data, 400);
        }

        $track_in_party = new TrackInParty();
        $track_in_party->setTrackId($track);
        $track_in_party->setState('IN_PLAYLIST');

        $entityManager = $doctrine->getManager();
        $party = $this->fetchParty($party_uid, $entityManager);
        $party->addTrackInParty($track_in_party);

        $entityManager->persist($track);
        $entityManager->persist($party);
        $entityManager->persist($track_in_party);
        $entityManager->flush();

        $response_array = $this->createJsonArray($party, $track_in_party, $track);
        return new JsonResponse($response_array);
    }

    /**
     * @Route("/api/{party_uid}", name="party_playlist")
     */
    public function partyPlaylist(string $party_uid, ManagerRegistry $doctrine) : JsonResponse
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
