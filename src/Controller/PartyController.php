<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Party;

class PartyController extends AbstractController
{
    /**
     * @Route("/create", name="create_party")
     */
    public function createParty(Request $request, ValidatorInterface $validator)
    {   
        $entityManager = $this->getDoctrine()->getManager();
        $date = $request->request->get('party_date');
        
        // Création de la soirée
        $party = new Party();
        $party->setDate(new \DateTime($date));

        // /|\ A SUPPRIMER PLUS TARD QUAND DEFINIE DANS l'ENTITY
        $party->setEndDate(new \DateTime($date));
 
        // Vérification de la date
        $errors = $validator->validate($party);
        if (empty($date) || count($errors) > 0) { 
            return $this->render('home/index.html.twig', ['no_date' => 'Date required']);
        }
 
        // Ecriture dans la bdd
        $entityManager->persist($party); 
        $entityManager->flush();

        $uid = $party->getUid();

        return $this->redirectToRoute('playlist_uid', ['party_uid' => $uid]);
    }
}