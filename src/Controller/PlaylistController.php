<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;

use App\Entity\Party;

class PlaylistController extends AbstractController
{

    /**
     * @Route("/playlist", name="playlist")
     */
    public function playlistHomePage(): Response
    {
        return $this->redirect('/');
    }

    /**
     * @Route("/playlist/{party_uid}", name="playlist_uid")
     */
    public function playlist(String $party_uid, ManagerRegistry $doctrine): Response
    {
        // check the playlist exists
        $party_repo = $doctrine->getManager()->getRepository(Party::class);
        $match_parties = $party_repo->findBy(['uid' => $party_uid]);
        if (empty($match_parties)) {
            return $this->render('home/index.html.twig', ['no_date' => 'This playlist does not exist']);
        }

        return $this->render('playlist/index.html.twig');
    }
}
