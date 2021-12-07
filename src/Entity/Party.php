<?php

namespace App\Entity;

use App\Repository\PartyRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=PartyRepository::class)
 */
class Party
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $uid;

    /**
     * @ORM\Column(type="integer")
     */
    private $current_track;

    /**
     * @ORM\Column(type="datetime")
     */
    private $date;

    /**
     * @ORM\OneToMany(targetEntity=TrackInParty::class, mappedBy="party_id", orphanRemoval=true)
     */
    private $trackInParties;

    public function __construct()
    {
        $this->trackInParties = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUid(): ?string
    {
        return $this->uid;
    }

    public function setUid(string $uid): self
    {
        $this->uid = $uid;

        return $this;
    }

    public function getCurrentTrack(): ?int
    {
        return $this->current_track;
    }

    public function setCurrentTrack(int $current_track): self
    {
        $this->current_track = $current_track;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    /**
     * @return Collection|TrackInParty[]
     */
    public function getTrackInParties(): Collection
    {
        return $this->trackInParties;
    }

    public function addTrackInParty(TrackInParty $trackInParty): self
    {
        if (!$this->trackInParties->contains($trackInParty)) {
            $this->trackInParties[] = $trackInParty;
            $trackInParty->setPartyId($this);
        }

        return $this;
    }

    public function removeTrackInParty(TrackInParty $trackInParty): self
    {
        if ($this->trackInParties->removeElement($trackInParty)) {
            // set the owning side to null (unless already changed)
            if ($trackInParty->getPartyId() === $this) {
                $trackInParty->setPartyId(null);
            }
        }

        return $this;
    }
}
