<?php

namespace App\Entity;

use App\Repository\CoachRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CoachRepository::class)]
class Coach extends Utilisateur
{

    

    #[ORM\Column(type:"array")]
    private ?array $specialites = [];

    #[ORM\Column]
    private ?float $tarif_horaire = null;

    /**
     * @var Collection<int, FicheDePaie>
     */
    #[ORM\OneToMany(targetEntity: FicheDePaie::class, mappedBy: 'coach')]
    private Collection $ficheDePaies;

    /**
     * @var Collection<int, Seance>
     */
    #[ORM\OneToMany(targetEntity: Seance::class, mappedBy: 'coach')]
    private Collection $seances;

    public function __construct()
    {
        $this->ficheDePaies = new ArrayCollection();
        $this->seances = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSpecialites(): array
    {
        return $this->specialites; 
    }
    
    public function setSpecialites(array $specialites): static
    {
        $this->specialites = $specialites;
        return $this;
    }

    public function addSpecialite(string $specialite): static
    {
        if (!in_array($specialite, $this->specialites, true)) {
            $this->specialites[] = $specialite;
        }
        return $this;
    }

    public function removeSpecialite(string $specialite): static
    {
        $this->specialites = array_filter($this->specialites, fn ($item) => $item !== $specialite);
        return $this;
    }

    public function getTarifHoraire(): ?float
    {
        return $this->tarif_horaire;
    }

    public function setTarifHoraire(float $tarif_horaire): static
    {
        $this->tarif_horaire = $tarif_horaire;

        return $this;
    }

    /**
     * @return Collection<int, FicheDePaie>
     */
    public function getFicheDePaies(): Collection
    {
        return $this->ficheDePaies;
    }

    public function addFicheDePaie(FicheDePaie $ficheDePaie): static
    {
        if (!$this->ficheDePaies->contains($ficheDePaie)) {
            $this->ficheDePaies->add($ficheDePaie);
            $ficheDePaie->setCoach($this);
        }

        return $this;
    }

    public function removeFicheDePaie(FicheDePaie $ficheDePaie): static
    {
        if ($this->ficheDePaies->removeElement($ficheDePaie)) {
            // set the owning side to null (unless already changed)
            if ($ficheDePaie->getCoach() === $this) {
                $ficheDePaie->setCoach(null);
            }
        }

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
            $seance->setCoach($this);
        }

        return $this;
    }

    public function removeSeance(Seance $seance): static
    {
        if ($this->seances->removeElement($seance)) {
            // set the owning side to null (unless already changed)
            if ($seance->getCoach() === $this) {
                $seance->setCoach(null);
            }
        }

        return $this;
    }
}
