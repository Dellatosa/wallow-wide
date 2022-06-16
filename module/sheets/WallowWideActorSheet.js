export default class WallowWideActorSheet extends ActorSheet {
     
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 744,
            height: 958,
            classes: ["wallow-wide", "sheet", "actor"],
            /*tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "competences" },
                    { navSelector: ".magie-tabs", contentSelector: ".magie-content", initial: "emprise" },
                    { navSelector: ".historique-tabs", contentSelector: ".historique-content", initial: "pouvoirs" }]*/
        });
    }

    get template() {
        if(this.actor.data.type == "pj" || this.actor.data.type == "pnj") {
            console.log(`Wallow Wide | type : ${this.actor.data.type} | chargement du template systems/wallow-wide/templates/sheets/actors/personnage-sheet.html`);
            return `systems/wallow-wide/templates/sheets/actors/personnage-sheet.html`
        } 
        else {
            console.log(`Wallow Wide | chargement du template systems/wallow-wide/templates/sheets/actors/${this.actor.data.type}-sheet.html`);
            return `systems/agone/templates/sheets/actors/${this.actor.data.type}-sheet.html`
        }
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.WallowWide;
        const actorData = data.data.data;

        return data;
    }
}