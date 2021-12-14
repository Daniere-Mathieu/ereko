<?php



namespace App\Entity;

use App\Repository\TrackInPartyRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=TrackInPartyRepository::class)
 */
class TrackInParty
{
    public static $available_states = [
        'REMOVED',
        'CURRENT',
        'IN_PLAYLIST'
    ];

    private $download_base_path = "/api/download/";

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
    private $party;

    /**
     * @ORM\ManyToOne(targetEntity=Track::class, inversedBy="trackInParties")
     * @ORM\JoinColumn(nullable=false)
     */
    private $track;

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
        if ( in_array($state, self::$available_states, true)) {
            $this->state = $state;
            return $this;
        }
        throw new \ValueError('Track in Party state forbidden');
    }

    public function getParty(): ?Party
    {
        return $this->party;
    }

    public function setParty(?Party $party): self
    {
        $this->party = $party;

        return $this;
    }

    public function getTrack(): ?Track
    {
        return $this->track;
    }

    public function setTrack(?Track $track): self
    {
        $this->track = $track;

        return $this;
    }

    public function getTrackDownloadPath() {
        return $this->download_base_path
            . $this->party->getUid() . '/'
            . $this->track->getTrackId(). '/'
            . $this->order_in_list
            ;
    }

    public function matchTrackIdAndOrder($track_id, int $order) {
        return (
            $this->getTrack()->getTrackId() === $track_id
            &&
            $this->getOrderInList() === $order
        );
    }
}
