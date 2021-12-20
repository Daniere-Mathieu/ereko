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
        $party_date = new \DateTime($date);
        $party->setDate($party_date);
        if ($party->UnacceptableDate()) {
            return $this->render(
                'home/index.html.twig',
                [
                    'no_date' => 'Date is not correct. Party should take place in the next '
                        . Party::$max_months_before_party_takes_place
                        . ' months.'
                ]);
        }

        // /!\ A SUPPRIMER PLUS TARD QUAND DEFINIE DANS l'ENTITY
        $party->setEndDate($this->computePartyEndDate($party_date, Party::$wait_days_before_delete_party));
 
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

    private function computePartyEndDate(\Datetime $party_date, int $days_delay): \Datetime
    {
        $string_interval = "P" . $days_delay . "DT0H0M0S";
        $interval = new \DateInterval($string_interval);
        $end_date = clone $party_date;
        return $end_date->add($interval);
    }
}