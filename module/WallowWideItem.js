export default class  WallowWideItem extends Item {

    prepareData() {
        super.prepareData();
        this.system.config = CONFIG.WallowWide;
        let data = this.system;

        if(this.type == "trait" || this.type == "hobby" || this.type == "metier") {
            if(this.img == "icons/svg/item-bag.svg")
                this.img = `/systems/wallow-wide/images/items/${this.type.toLowerCase()}.svg`;
        }
    }
}