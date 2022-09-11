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
        if(this.actor.type == "pj" || this.actor.type == "pnj") {
            console.log(`Wallow Wide | type : ${this.actor.type} | chargement du template systems/wallow-wide/templates/sheets/actors/personnage-sheet-v2.html`);
            return `systems/wallow-wide/templates/sheets/actors/personnage-sheet-v2.html`
        } 
        else {
            console.log(`Wallow Wide | chargement du template systems/wallow-wide/templates/sheets/actors/${this.actor.type}-sheet.html`);
            return `systems/wallow-wide/templates/sheets/actors/${this.actor.type}-sheet.html`
        }
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.WallowWide;
        const actorData = data.system;

        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);

        //console.log("----- Passage dans ActivateListeners -----");
        const actorData = this.object.data;

        const SanteClass = ".sante-" + actorData.data.sante.value;
        html.find(SanteClass).addClass("sante-cur");

        const StressClass = ".stress-" + actorData.data.stressMental.value;
        html.find(StressClass).addClass("stress-cur");

        //<i class="fa-solid fa-thumbtack"></i>
    }
}