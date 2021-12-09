<?php

namespace App\Entity;

use App\Repository\PartyRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * @ORM\Entity(repositoryClass=PartyRepository::class)
 */
class Party
{
    protected $party_id_length = 10;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string")
     */
    private $uid;

    /**
     * @ORM\Column(type="string")
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

    private $tracks;

    /**
     * @ORM\Column(type="datetime")
     */
    private $end_date;

    public function __construct()
    {
        $this->trackInParties = new ArrayCollection();
        $this->setUid(self::$party_id_length);
        $this->current_track = 0;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUid(): ?string
    {
        return $this->uid;
    }

    private function setUid(int $length): self
    {
        $uuid = '';
        for ($i = 0; $i < $length; $i++) {
            $uuid .= chr(rand(ord('a'), ord('z')));
        }

        $this->uid = $uuid;
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

    public function getEndDate(): ?\DateTimeInterface
    {
        return $this->end_date;
    }

    public function setEndDate(\DateTimeInterface $end_date): self
    {
        $this->end_date = $end_date;

        return $this;
    }

    public function getTrackRelationByUid(string $track_uid): ?TrackInParty
    {
        foreach ($this->getTrackInParties() as $track_in_party) {
            if ($track_in_party->getTrackId()->getTrackId() === $track_uid) {
                return $track_in_party;
            }
        }
        return NULL;
    }

    public function getAllTracks(): Array
    {
        $this->tracks = [];
        foreach ($this->getTrackInParties() as $track_in_party) {
            $this->tracks[] = $track_in_party->getTrackId();
        }
        return $this->tracks;
    }

    public function getTrackByUid(string $track_uid): ?Track
    {
        $this->getAllTracks();
        foreach ($this->tracks as $track) {
            if ( $track->getTrackId() === $track_uid ) {
                return $track;
            }
        }
        return NULL;
    }

    // TODO
    /*
    public function getAllTracks() {}
    public function getCurrentTrack() {}
    public function getTrackByUid() {}

    */

    public static function verifyMatchUid($uid) {
        if ( self::matchUid($uid) !== 1 ) {
            throw new HttpException(400, 'Wrong party uid.');
        }
    }

    public static function matchUid($uid): Bool
    {
        return preg_match(self::partyIdRegex(), $uid);
    }

    protected function partyIdRegex() {
        return "#^[a-z]{" . self::$party_id_length . "}$#";
    }
}
