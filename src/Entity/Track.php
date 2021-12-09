<?php

namespace App\Entity;

use App\Repository\TrackRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * @ORM\Entity(repositoryClass=TrackRepository::class)
 */
class Track
{
    protected $track_id_regex = "#^[a-zA-Z0-9_-]{11}$#";
    protected $available_states = [
        'TO_DOWNLOAD',
        'DOWNLOADING',
        'READY',
        'ON_ERROR'
    ];

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $track_id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $title;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $path;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $state;

    /**
     * @ORM\OneToMany(targetEntity=TrackInParty::class, mappedBy="track_id", orphanRemoval=true)
     */
    private $trackInParties;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $thumbnail_path;

    public function __construct()
    {
        $this->trackInParties = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTrackId(): ?string
    {
        return $this->track_id;
    }

    public function setTrackId(string $track_id): self
    {
        $this->track_id = $track_id;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getPath(): ?string
    {
        return $this->path;
    }

    public function setPath(string $path): self
    {
        $this->path = $path;

        return $this;
    }

    public function getState(): ?string
    {
        return $this->state;
    }

    public function setState(string $state): self
    {
        if ( in_array($state, $available_states, true)) {
            $this->state = $state;
            return $this;
        }
        throw new \ValueError('Track state forbidden');
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
            $trackInParty->setTrackId($this);
        }

        return $this;
    }

    public function removeTrackInParty(TrackInParty $trackInParty): self
    {
        if ($this->trackInParties->removeElement($trackInParty)) {
            // set the owning side to null (unless already changed)
            if ($trackInParty->getTrackId() === $this) {
                $trackInParty->setTrackId(null);
            }
        }

        return $this;
    }

    public function getThumbnailPath(): ?string
    {
        return $this->thumbnail_path;
    }

    public function setThumbnailPath(string $thumbnail_path): self
    {
        $this->thumbnail_path = $thumbnail_path;

        return $this;
    }

    public static function verifyMatchUid($track_id) {
        if ( self::matchUid($track_id) !== 1 ) {
            throw new HttpException(400, 'Wrong track uid.');
        }
    }

    public static function matchUid($id): Bool
    {
        return preg_match(self::$track_id_regex, $id);
    }
}
