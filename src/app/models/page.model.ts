import BaseIndexCardModel from './base-index-card.model';

export default class PageModel {
    //Index cards on right side of the page
    private indexCardsLeftValue: BaseIndexCardModel[];
    get indexCardsLeft(): BaseIndexCardModel[] {
      return this.indexCardsLeftValue;
    }
    set indexCardsLeft(val: BaseIndexCardModel[]) {
      this.indexCardsLeftValue = val;
    }

    // Index cards on left side of the page
    private indexCardsRightValue: BaseIndexCardModel[];
    get indexCardsRight(): BaseIndexCardModel[] {
      return this.indexCardsRightValue;
    }
    set indexCardsRight(val: BaseIndexCardModel[]) {
      this.indexCardsRightValue = val;
    }

    constructor(
      theIndexCardsLeft: BaseIndexCardModel[],
      theIndexCardsRight: BaseIndexCardModel[]
    ) {
      this.indexCardsLeftValue = theIndexCardsLeft;
      this.indexCardsRightValue = theIndexCardsRight;
    }
}
