import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Element, Joueur } from '../../../domain/models/joueur';
import { Sort, TypeSort } from '../../../domain/models/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { ModaleFinComponent } from '../modales/fin/modale-fin.component';

const RATIO_CELLULES_MORTES = 1 / 10;
@Component({
  selector: 'app-grille',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './grille.component.html',
  styleUrl: './grille.component.scss'
})
export class GrilleComponent {


  constructor(public modaleFin: MatDialog) {
  }

  tailleGrille: number = 12;
  cellulesIndisponibles: [number, number][] = []
  joueurUn = new Joueur(Element.AIR)
  joueurDeux = new Joueur(Element.FEU)
  joueurEnCours?: Joueur = undefined
  joueurAdverse?: Joueur = undefined
  affichageCellulesPossibles = false
  sortEnCours?: Sort = undefined

  get lignes() {
    return Array(this.tailleGrille);
  }

  get colonnes() {
    return Array(this.tailleGrille);
  }

  demarrerJeu() {
    this.cellulesIndisponibles = []
    for (let x = 0; x < this.tailleGrille / 2; x++) {
      for (let y = 0; y < this.tailleGrille / 2; y++) {
        if (Math.random() < RATIO_CELLULES_MORTES) {
          this.cellulesIndisponibles.push([x, y]);
        }
      }
    }
    this.supprimerCelluleIndisponible(0, 0);
    this.cellulesIndisponibles.forEach(([x, y]) => {
      this.cellulesIndisponibles.push([this.tailleGrille - 1 - x, y]);
    })
    this.cellulesIndisponibles.forEach(([x, y]) => {
      this.cellulesIndisponibles.push([x, this.tailleGrille - 1 - y]);
    })
    this.joueurUn.jouePremier()
    this.joueurEnCours = this.joueurUn
    this.joueurDeux.joueSecond(this.tailleGrille)
    this.joueurAdverse = this.joueurDeux
    this.affichageCellulesPossibles = false
  }

  supprimerCelluleIndisponible(positionX: number, positionY: number) {
    this.cellulesIndisponibles = this.cellulesIndisponibles.filter(
      ([x, y]) => !(x === positionX && y === positionY)
    );
  }

  estCelluleMorte(posX: number, posY: number): boolean {
    return this.cellulesIndisponibles.some(([x, y]) => x === posX && y === posY)
  }

  estCelluleDisponible(posX: number, posY: number): boolean {
    return !this.estCelluleMorte(posX, posY)
      && this.joueurEnCours!.estPasLa(posX, posY)
      && this.joueurAdverse!.estPasLa(posX, posY)
      && posX >= 0 && posY >= 0
      && posX <= this.tailleGrille - 1 && posY <= this.tailleGrille - 1
  }

  terminerTour() {
    this.joueurEnCours!.reinitialisePM()
    this.joueurEnCours!.reinitialisePA()
    this.affichageCellulesPossibles = false

    const ancienJoueurAdverse = this.joueurAdverse
    this.joueurAdverse = this.joueurEnCours
    this.joueurEnCours = ancienJoueurAdverse
  }

  estCellulePossible(positionX: number, positionY: number): boolean {
    const differenceX = Math.abs(positionX - this.joueurEnCours!.getPositionX()!)
    const differenceY = Math.abs(positionY - this.joueurEnCours!.getPositionY()!)
    const distance = differenceX + differenceY
    if (this.sortEnCours) {
      if (this.sortEnCours.aPorteeNecessaire(distance) && this.joueurEnCours!.estPasLa(positionX, positionY)!) {
        if (this.sortEnCours.getType() === TypeSort.DEPLACEMENT) {
          if (this.joueurAdverse!.estPasLa(positionX, positionY)) {
            return true
          }
        } else if (this.sortEnCours.getType() === TypeSort.DOMMAGE) {
          return true
        }
      }
    } else if (this.getCellulesPossibles().some(([x, y]) => x === positionX && y === positionY)
    ) {
      return true
    }
    return false
  }

  getCellulesPossibles(): [number, number][] {
    const positionDepartX = this.joueurEnCours!.getPositionX()!;
    const positionDepartY = this.joueurEnCours!.getPositionY()!;

    const cellulesPossibles: [number, number][] = [[positionDepartX, positionDepartY]];
    const cellulesPossiblesSet: Set<string> = new Set([`${positionDepartX},${positionDepartY}`]);
    const positionsATraiter: [number, number, number][] = [[positionDepartX, positionDepartY, 0]];

    const directions: [number, number][] = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1]
    ];

    while (positionsATraiter.length > 0) {
      const [posX, posY, pmNecessaires] = positionsATraiter.shift()!;

      if (pmNecessaires < this.joueurEnCours!.getPM()) {
        for (const [dx, dy] of directions) {
          const nouveauX = posX + dx;
          const nouveauY = posY + dy;
          const nouvellePosition = `${nouveauX},${nouveauY}`;

          if (this.estCelluleDisponible(nouveauX, nouveauY) && !cellulesPossiblesSet.has(nouvellePosition)) {
            cellulesPossibles.push([nouveauX, nouveauY]);
            cellulesPossiblesSet.add(nouvellePosition);
            positionsATraiter.push([nouveauX, nouveauY, pmNecessaires + 1]);
          }
        }
      }
    }
    return cellulesPossibles;
  }


  seDeplacer(positionX: number, positionY: number) {
    const pmNecessaires = this.calculerPMNecessaires(positionX, positionY)
    this.joueurEnCours!.seDeplace(positionX, positionY, pmNecessaires)
    this.affichageCellulesPossibles = false
    if (this.joueurEnCours!.nePeutPlusRienFaire()) {
      this.terminerTour()
    }
  }
  calculerPMNecessaires(positionArriveeX: number, positionArriveeY: number): number {
    const positionDepartX = this.joueurEnCours!.getPositionX()!;
    const positionDepartY = this.joueurEnCours!.getPositionY()!;
    const maxPm = this.joueurEnCours!.getPM()

    const positionsATraiter: [number, number, number][] = [[positionDepartX, positionDepartY, 0]];
    const directions: [number, number][] = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1]
    ];
    const cellulesEcartees: Set<string> = new Set([`${positionDepartX},${positionDepartY}`]);

    while (positionsATraiter.length > 0) {
      const [posX, posY, pmNecessaires] = positionsATraiter.shift()!;

      if (posX === positionArriveeX && posY === positionArriveeY) {
        return pmNecessaires;
      }

      if (pmNecessaires < maxPm) {
        for (const [dx, dy] of directions) {
          const nouveauX = posX + dx;
          const nouveauY = posY + dy;
          const nouvellePosition = `${nouveauX},${nouveauY}`;

          if (this.estCelluleDisponible(nouveauX, nouveauY) && !cellulesEcartees.has(nouvellePosition)) {
            cellulesEcartees.add(nouvellePosition);
            positionsATraiter.push([nouveauX, nouveauY, pmNecessaires + 1]);
          }
        }
      }
    }

    return maxPm
  }

  effectuerAction(positionX: number, positionY: number) {
    if (this.joueurEnCours?.estPasLa(positionX, positionY)
      && this.affichageCellulesPossibles
      && this.estCellulePossible(positionX, positionY)) {
      if (this.sortEnCours) {
        this.effectuerSort(positionX, positionY)
      } else {
        this.seDeplacer(positionX, positionY)
      }
    }
  }

  effectuerSort(positionX: number, positionY: number) {
    if (this.sortEnCours?.getType() === TypeSort.DEPLACEMENT) {
      this.seDeplacerAvecSort(positionX, positionY)
    } else if (this.sortEnCours?.getType() === TypeSort.DOMMAGE) {
      if (this.joueurAdverse!.estLa(positionX, positionY)) {
        this.joueurAdverse!.encaisseDommage(this.sortEnCours.getDegats())
        if (this.joueurAdverse!.estMort()) {
          this.terminerTour()
          this.demarrerJeu()
          this.ouvrirModaleFin()
        }
      }
      this.joueurEnCours?.utilisePA(this.sortEnCours.getPA())
      this.affichageCellulesPossibles = false
      if (this.joueurEnCours!.nePeutPlusRienFaire()) {
        this.terminerTour()
      }
    }
  }

  ouvrirModaleFin() {
    this.modaleFin.open(ModaleFinComponent, {
      data: { gagnant: this.joueurEnCours?.est(this.joueurUn) ? 'Joueur 1' : 'Joueur 2' }
    })
  }

  seDeplacerAvecSort(positionX: number, positionY: number) {
    this.joueurEnCours?.seDeplaceAvecSort(positionX, positionY, this.sortEnCours?.getPA()!)
    this.affichageCellulesPossibles = false
    if (this.joueurEnCours!.nePeutPlusRienFaire()) {
      this.terminerTour()
    }
  }

  afficherCellulesPossiblesSort(sort: Sort) {
    this.affichageCellulesPossibles = true
    if (this.sortEnCours !== sort) {
      this.sortEnCours = sort
    }
  }

  afficherCellulesPossibles() {
    this.affichageCellulesPossibles = true
    this.sortEnCours = undefined
  }
}
