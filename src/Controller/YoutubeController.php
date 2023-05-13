<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\DependencyInjection\EnvVarLoader;


class YoutubeController extends AbstractController
{



    /**
     * @Route("/api/search/{search}", name="search", methods={"GET"})
     */
    public function search(String $search, ManagerRegistry $doctrine): JsonResponse
    {
        $httpClient = HttpClient::create();
        $envLoader = new EnvVarLoader();
        $envVars = $envLoader->loadValues($_ENV);
        $key = $envVars['YOUTUBE_KEY'];

        $url = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=$search&maxResults=5&type=video&videoDuration=medium&key=$key";

        $response = $httpClient->request('GET', $url, [
            'headers' => [
                'Accept' => 'application/json',
            ],
        ]);

        $content = $response->getContent();
        return new JsonResponse($content);
    }
}
