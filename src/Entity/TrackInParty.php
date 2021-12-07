<?php

namespace App\Entity;

use App\Repository\TrackInPartyRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=TrackInPartyRepository::class)
 */
class TrackInParty
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $order_in_list;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $state;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getOrderInList(): ?int
    {
        return $this->order_in_list;
    }

    public function setOrderInList(int $order_in_list): self
    {
        $this->order_in_list = $order_in_list;

        return $this;
    }

    public function getState(): ?string
    {
        return $this->state;
    }

    public function setState(string $state): self
    {
        $this->state = $state;

        return $this;
    }
}
