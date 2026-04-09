export default class WallowWideItemSheet extends foundry.appv1.sheets.ItemSheet {
     
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 650,
            height: 390,
            classes: ["wallow-wide", "sheet", "item"],
            //tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
        });
    }

    get template() {

        console.log(`Wallow Wide | Chargement du template systems/wallow-wide/templates/sheets/items/${this.item.type.toLowerCase()}-sheet.html`);
        return `systems/wallow-wide/templates/sheets/items/${this.item.type.toLowerCase()}-sheet.html`
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.WallowWide;

        return data;
    }
}