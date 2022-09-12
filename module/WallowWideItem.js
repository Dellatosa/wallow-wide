export default class  WallowWideItem extends Item {

    prepareData() {
        super.prepareData();
        this.system.config = CONFIG.WallowWide;
        let data = this.system;
    }
}