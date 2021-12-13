<?php

namespace App\Entity;

use App\Repository\TrackRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use App\Validator as CustomAssert;



/**
 * @ORM\Entity(repositoryClass=TrackRepository::class)
 * @UniqueEntity("track_id")
 * 
 */
class Track
{
    public static $track_id_regex = "[a-zA-Z0-9_-]{11}";
    // TODO use a key => value array
    public static $available_states = [
        'TO_DOWNLOAD',
        'DOWNLOADING',
        'READY',
        'ON_ERROR',
        'TOO_LONG'
    ];
    public static $download_dir = "data/music/";
    public static $audio_format = ".ogg";

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * 
     * @Assert\NotBlank
     * @Assert\Type("string")
     * @CustomAssert\TrackIdRegex
     * 
     */
    private $track_id;

    /**
     * @ORM\Column(type="string", length=255)
     * 
     * @Assert\NotBlank
     * @Assert\Type("string")
     * 
     */
    private $title;

    /**
     * @ORM\Column(type="string", length=255)
     * 
     * @Assert\NotBlank
     * @Assert\Type("string")
     * @CustomAssert\VideoUrl
     * 
     */
    private $path;

    /**
     * @ORM\Column(type="string", length=255)
     * 
     * @Assert\NotBlank
     * @Assert\Type("string")
     * 
     */
    private $state;

    /**
     * @ORM\OneToMany(targetEntity=TrackInParty::class, mappedBy="track_id", orphanRemoval=true)
     * 
     */
    private $trackInParties;

    /**
     * @ORM\Column(type="string", length=255)
     * 
     * @Assert\NotBlank
     * @Assert\Type("string")
     * @CustomAssert\ThumbnailPath
     * 
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


    public function getPathToFile(): ?string
    {
        return self::$download_dir . $this->getFileName();
    }

    public function getFileName(): ?string
    {
        return $this->track_id . self::$audio_format;
    }


    public function getState(): ?string
    {
        return $this->state;
    }

    public function setState(string $state): self
    {
        if ( in_array($state, self::$available_states, true)) {
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
        if ( self::matchUid($track_id) ) {
            return true; 
        }
        throw new HttpException(400, 'Wrong track uid.');
        
    }

    public static function matchUid($id): Bool
    {
        return preg_match(self::singleTrackIdRegex(), $id);
    }

    public static function singleTrackIdRegex() {
        return "#^" . self::$track_id_regex . "$#";
    }
}
