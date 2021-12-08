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

    /**
     * @ORM\ManyToOne(targetEntity=Party::class, inversedBy="trackInParties")
     * @ORM\JoinColumn(nullable=false)
     */
    private $party_id;

    /**
     * @ORM\ManyToOne(targetEntity=Track::class, inversedBy="trackInParties")
     * @ORM\JoinColumn(nullable=false)
     */
    private $track_id;

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

    public function getParty(): ?Party
    {
        return $this->party_id;
    }

    public function setParty(?Party $party_id): self
    {
        $this->party_id = $party_id;

        return $this;
    }

    public function getTrack(): ?Track
    {
        return $this->track_id;
    }

    public function setTrack(?Track $track_id): self
    {
        $this->track_id = $track_id;

        return $this;
    }
}
