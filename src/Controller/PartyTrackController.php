<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
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
     * @Route("/api/info/{party_uid}/{track_uid}/{order}", name="party_track")
     */
    public function index(
        string $party_uid,
        string $track_uid,
        int $order,
        ManagerRegistry $doctrine): JsonResponse
    {
        Party::verifyMatchUid($party_uid);
        Track::verifyMatchUid($track_uid);

        $entityManager = $doctrine->getManager();
        $infos = $this->fetchPartyAndTrackInformation($party_uid, $track_uid, $entityManager, $order);
        $party = $infos[0];
        $track_in_party = $infos[1];
        $track = $infos[2];

        $response_array = $this->createJsonArray($party, $track_in_party, $track);

        return new JsonResponse($response_array);
    }

    private function fetchPartyAndTrackInformation(
        string $party_uid,
        string $track_uid,
        $entityManager,
        int $order)
    {
        $party = $this->fetchParty($party_uid, $entityManager);
        $track_in_party = $party->getTrackRelationByUid($track_uid, $order);
        if (empty($track_in_party)) {
            throw new HttpException(404, 'Track not found.');
        }
        $track = $track_in_party->getTrack();

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
            "download_path" => $track_in_party->getTrackDownloadPath(),
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
        Track::verifyMatchUid($track_uid);

        $entityManager = $doctrine->getManager();

        if ( empty($track = $this->fetchTrack($track_uid, $entityManager))) {
            $track = $this->createNewTrack($track_uid, $request);

            $errors = $validator->validate($track);
            if (count($errors) > 0) {
                return $this->formatValidationErrors($errors);
            }
        }

        $track_in_party = new TrackInParty();
        $track_in_party->setTrack($track);
        $track_in_party->setState('IN_PLAYLIST');

        $party = $this->fetchParty($party_uid, $entityManager);
        $party->addTrackInParty($track_in_party);

        $entityManager->persist($track);
        $entityManager->persist($party);
        $entityManager->persist($track_in_party);
        $entityManager->flush();

        $response_array = $this->createJsonArray($party, $track_in_party, $track);
        return new JsonResponse($response_array);
    }

    private function createNewTrack($track_uid, $request) {
        $track = new Track();
        $track->setTrackId($track_uid);
        $track->setThumbnailPath("https://i.ytimg.com/vi/" . $track_uid . "/mqdefault.jpg");
        $track->setTitle($request->request->get('title'));
        $track->setState('TO_DOWNLOAD');

        return $track;
    }

    private function fetchTrack($track_uid, $entityManager) {
        $tracks = $entityManager->getRepository(Track::class)->findBy(['track_id' => $track_uid]);

        if (empty($tracks)) {
            return NULL;
        }
        else if (count($tracks) > 1) {
            // Should not happen: conflicting tracks uids.
            throw new HttpException(500, "Many tracks match this UID: " . $track_uid);
        }

        $track = $tracks[0];
        if ($track->shouldBeDownloaded()) {
            $track->setState('TO_DOWNLOAD');
        }

        return $track;
    }

    private function formatValidationErrors($errors) {
        $return_errors = [];
        foreach ($errors as $error) {
            $return_errors[] = $error->getMessage();
        }

        $data = [
            'type' => 'validation_error',
            'title' => 'There was a validation error',
            'errors' => $return_errors
        ];

        return new JsonResponse($data, 400);
    }

    /**
     * @Route("/api/remove/{party_uid}/{track_uid}/{order}", name="party_track_remove", methods="POST")
     */
    public function remove(
        string $party_uid,
        string $track_uid,
        int $order,
        ManagerRegistry $doctrine ): JsonResponse
    {
        Party::verifyMatchUid($party_uid);
        Track::verifyMatchUid($track_uid);

        $entityManager = $doctrine->getManager();
        $infos = $this->fetchPartyAndTrackInformation($party_uid, $track_uid, $entityManager, $order);
        $party = $infos[0];
        $track_in_party = $infos[1];
        $track = $infos[2];

        $track_in_party->setState('REMOVED');
        $entityManager->persist($track_in_party);
        $entityManager->flush();

        $response_array = $this->createJsonArray($party, $track_in_party, $track);
        return new JsonResponse($response_array);
    }

    /**
     * @Route("/api/download/{party_uid}/{track_uid}/{order}", name="party_track_download", methods="GET")
     */
    public function download(
        string $party_uid,
        string $track_uid,
        int $order,
        ManagerRegistry $doctrine ): BinaryFileResponse
    {
        Party::verifyMatchUid($party_uid);
        Track::verifyMatchUid($track_uid);

        $entityManager = $doctrine->getManager();
        $infos = $this->fetchPartyAndTrackInformation($party_uid, $track_uid, $entityManager, $order);
        $track = $infos[2];

        return new BinaryFileResponse('../' . $track->getPathToFile());
    }

    /**
     * @Route("/api/playlist/{party_uid}", name="party_playlist")
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
            $track = $track_in_party->getTrack();
            $response_array[] = $this->createJsonArray($party, $track_in_party, $track);
        }

        return new JsonResponse($response_array);
    }

}
