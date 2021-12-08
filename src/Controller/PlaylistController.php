<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;


class PlaylistController extends AbstractController
{
    /**
     * @Route("/playlist", name="playlist")
     */
    public function index(): Response
    {
        return $this->render('playlist/index.html.twig');
    }

    /**
     * @Route("/playlist/{party_uid}", name="playlist_uid")
     */
    public function playlist($party_uid): Response
    {
        return $this->render('playlist/index.html.twig');
    }
}
