import BaseIndexCard from './base-index-card.model';

export default class Sheet {
    public defaultFileType: string;
    public dateCreated: Date;
    public dateUpdated: Date;

    // Index cards on right side of the page
    private leftIndexCardsValue: BaseIndexCard[];
    get leftIndexCards(): BaseIndexCard[] {
        return this.leftIndexCardsValue;
    }
    set leftIndexCards(val: BaseIndexCard[]) {
        this.leftIndexCardsValue = val;
    }

    // Index cards on left side of the page
    private rightIndexCardsValue: BaseIndexCard[];
    get rightIndexCards(): BaseIndexCard[] {
        return this.rightIndexCardsValue;
    }
    set rightIndexCards(val: BaseIndexCard[]) {
        this.rightIndexCardsValue = val;
    }

    constructor() {
    }

}
