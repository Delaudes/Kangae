import { Degats, Portee, Sort, TypeSort } from "./sort";

export class Joueur {
    private pointsMouvement = 6;
    private pointsAction = 24;
    private pointsVie = 100
    private positionX: number | undefined = undefined;
    private positionY: number | undefined = undefined;
    private sorts: Sort[] = []
    private locationSvg: string
    private element: Element

    constructor(element: Element) {
        this.element = element
        const nomSort1 = 'Percée'
        const nomSort2 = 'Offensive'
        const locationSvgSort1 = "assets/percee.svg"
        const locationSvgSort2 = "assets/offensive.svg"
        let nomSort3 = 'Inondation'
        let nomSort4 = 'Tsunami'
        let locationSvgSort3 = "assets/inondation.svg"
        let locationSvgSort4 = "assets/tsunami.svg"
        this.locationSvg = "assets/eau.svg"
        if (element === Element.AIR) {
            nomSort3 = "Tornade"
            nomSort4 = 'Typhon'
            locationSvgSort3 = "assets/tornade.svg"
            locationSvgSort4 = "assets/typhon.svg"
            this.locationSvg = "assets/air.svg"
        }
        if (element === Element.TERRE) {
            nomSort3 = 'Tir-de-boue'
            nomSort4 = 'Seisme'
            locationSvgSort3 = "assets/tir-de-boue.svg"
            locationSvgSort4 = "assets/seisme.svg"
            this.locationSvg = "assets/terre.svg"
        }
        if (element === Element.FEU) {
            nomSort3 = 'Lance-flammes'
            nomSort4 = 'Incendie'
            locationSvgSort3 = "assets/lance-flammes.svg"
            locationSvgSort4 = "assets/incendie.svg"
            this.locationSvg = "assets/feu.svg"
        }
        this.sorts.push(new Sort(nomSort1, TypeSort.DEPLACEMENT, Portee.DEUX, Degats.ZERO, locationSvgSort1))
        this.sorts.push(new Sort(nomSort2, TypeSort.DEPLACEMENT, Portee.QUATRE, Degats.ZERO, locationSvgSort2))
        this.sorts.push(new Sort(nomSort3, TypeSort.DOMMAGE, Portee.CINQ, Degats.QUATRE, locationSvgSort3))
        this.sorts.push(new Sort(nomSort4, TypeSort.DOMMAGE, Portee.DEUX, Degats.DIX, locationSvgSort4))
    }

    getLocationSvg(): string {
        return this.locationSvg
    }

    getElement(): string {
        return this.element
    }

    getSorts(): Sort[] {
        return this.sorts
    }

    getPA(): number {
        return this.pointsAction
    }

    getPV(): number {
        return this.pointsVie
    }

    jouePremier(): void {
        this.reinitialisePA()
        this.reinitialisePM()
        this.pointsVie = 100
        this.positionX = 0
        this.positionY = 0
    }

    encaisseDommage(degatsSort: number) {
        this.pointsVie = this.pointsVie - degatsSort
    }

    aPasAssezDePA(coutSort: number): boolean {
        return this.pointsAction - coutSort < 0
    }

    getPositionX(): number | undefined {
        return this.positionX
    }

    getPositionY(): number | undefined {
        return this.positionY
    }

    aPMNecessaire(distance: number) {
        return this.pointsMouvement >= distance
    }

    aPlusDePM() {
        return this.pointsMouvement === 0
    }

    aPlusDePA() {
        return this.pointsAction === 0
    }

    seDeplace(positionX: number, positionY: number, pmNecessaires: number) {
        this.positionX = positionX
        this.positionY = positionY
        this.pointsMouvement = this.pointsMouvement - pmNecessaires
    }

    seDeplaceAvecSort(positionX: number, positionY: number, coutSort: number) {
        this.positionX = positionX
        this.positionY = positionY
        this.pointsAction = this.pointsAction - coutSort
    }

    joueSecond(tailleGrille: number): void {
        this.reinitialise();
        this.positionX = tailleGrille - 1
        this.positionY = tailleGrille - 1
    }

    private reinitialise() {
        this.reinitialisePA();
        this.reinitialisePM();
        this.pointsVie = 100;
    }

    utilisePA(coutSort: number): void {
        this.pointsAction = this.pointsAction - coutSort
    }

    estMort(): boolean {
        return this.pointsVie <= 0
    }

    getPM(): number {
        return this.pointsMouvement
    }

    reinitialisePM(): void {
        this.pointsMouvement = 6
    }

    reinitialisePA(): void {
        this.pointsAction = 24
    }

    nePeutPlusRienFaire() {
        return this.pointsMouvement === 0
            && (this.pointsAction === 0
                || this.sorts.filter((sort) => sort.getPA() <= this.pointsAction).length === 0)
    }

    estLa(positionX: number, positionY: number) {
        return this.positionX === positionX && this.positionY === positionY
    }

    estPasLa(positionX: number, positionY: number) {
        return !this.estLa(positionX, positionY)
    }

    est(joueur: Joueur): boolean {
        return this.estLa(joueur.getPositionX()!, joueur.getPositionY()!)
    }

}

export enum Element {
    EAU = 'Eau', FEU = 'Feu', TERRE = 'Terre', AIR = 'Air'
}