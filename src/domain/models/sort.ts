export class Sort {

    private nom: string = 'sort'
    private description: string = 'description du sort'
    private type: TypeSort
    private portee: Portee = Portee.ZERO
    private degats: Degats = Degats.ZERO
    private pointsAction: number = 0
    private locationSvg: string

    constructor(nom: string, type: TypeSort, portee: Portee, degats: Degats, locationSvg: string) {
        this.locationSvg = locationSvg
        this.nom = nom
        this.type = type
        this.portee = portee
        this.degats = degats
        this.pointsAction = this.calculatePointsAction()
        this.description = this.creerDescription()
    }

    getLocationSvg(): string {
        return this.locationSvg
    }

    getNom(): string {
        return this.nom;
    }

    aPorteeNecessaire(distance: number) {
        return this.portee >= distance
    }

    getDegats(): number {
        return this.degats;
    }

    getType(): TypeSort {
        return this.type
    }

    getPortee(): number {
        return this.portee;
    }

    getPA(): number {
        return this.pointsAction;
    }

    getDescription(): string {
        return this.description;
    }

    calculatePointsAction(): number {
        let pointsAction = 1
        if (this.type === TypeSort.DEPLACEMENT) {
            pointsAction = pointsAction + (this.portee * 2)
        } else if (this.type === TypeSort.DOMMAGE) {
            pointsAction = pointsAction + this.portee + (this.degats / 2)
        }
        return pointsAction
    }

    creerDescription() {
        let description = this.description
        if (this.type === TypeSort.DOMMAGE) {
            description = `Inflige ${this.degats} dégâts à ${this.portee} cases maximum`
        } else if (this.type === TypeSort.DEPLACEMENT) {
            description = `Se déplace à ${this.portee} cases maximum`
        }
        return description
    }
}

export enum TypeSort {
    DOMMAGE, DEPLACEMENT
}


export enum Portee {
    ZERO = 0, UN = 1, DEUX = 2, TROIS = 3, QUATRE = 4, CINQ = 5, SIX = 6, SEPT = 7, HUIT = 8, NEUF = 9, DIX = 10
}

export enum Degats {
    ZERO = 0, DEUX = 2, QUATRE = 4, SIX = 6, HUIT = 8, DIX = 10, DOUZE = 12, QUATORZE = 14, SEIZE = 16, DIX_HUIT = 18, VINGT = 20,
}




