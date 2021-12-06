<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MediaQueryController extends AbstractController
{
    /**
     * @Route("/media/query", name="media_query")
     */
    public function index(): Response
    {
        return $this->render('media_query/index.html.twig', [
            'controller_name' => 'MediaQueryController',
        ]);
    }
}
