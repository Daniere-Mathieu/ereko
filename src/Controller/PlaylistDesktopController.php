<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class PlaylistDesktopController extends AbstractController
{
    /**
     * @Route("/playlist/desktop", name="playlist_desktop")
     */
    public function index(): Response
    {
        return $this->render('playlist_desktop/index.html.twig', [
            'controller_name' => 'PlaylistDesktopController',
        ]);
    }
}
