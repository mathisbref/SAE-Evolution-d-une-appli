<?php

namespace App\Entity;

use App\Repository\SportifRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SportifRepository::class)]
class Sportif extends Utilisateur
{

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $date_inscription = null;

    #[ORM\Column(type: "string", length: 255)]
    #[Assert\Choice(
        choices: ["débutant","intermédiaire","avancé"],
        message: "Le niveau '{{ value }}' n'est pas valide. Choisissez parmi 'débutant', 'intermédiaire' ou 'avancé'."
    )]
    private ?string $niveau_sportif = null;

    /**
     * @var Collection<int, Seance>
     */
    #[ORM\ManyToMany(targetEntity: Seance::class, mappedBy: 'sportifs')]
    private Collection $seances;

    public function __construct()
    {
        $this->seances = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDateInscription(): ?\DateTimeInterface
    {
        return $this->date_inscription;
    }

    public function setDateInscription(\DateTimeInterface $date_inscription): static
    {
        $this->date_inscription = $date_inscription;

        return $this;
    }

    public function getNiveauSportif(): ?string
    {
        return $this->niveau_sportif;
    }

    public function setNiveauSportif(string $niveau_sportif): static
    {
        $this->niveau_sportif = $niveau_sportif;

        return $this;
    }

    /**
     * @return Collection<int, Seance>
     */
    public function getSeances(): Collection
    {
        return $this->seances;
    }

    public function addSeance(Seance $seance): static
    {
        if (!$this->seances->contains($seance)) {
            $this->seances->add($seance);
            $seance->addSportif($this);
        }

        return $this;
    }

    public function removeSeance(Seance $seance): static
    {
        if ($this->seances->removeElement($seance)) {
            $seance->removeSportif($this);
        }

        return $this;
    }
}
