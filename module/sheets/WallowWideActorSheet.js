import * as Dice from "../dice.js";

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

        data.traits = data.items.filter(function (item) { return item.type == "trait"});
        data.metiers = data.items.filter(function (item) { return item.type == "metier"});
        data.hobbies = data.items.filter(function (item) { return item.type == "hobby"});
        

        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);

        //console.log("----- Passage dans ActivateListeners -----");
        const actorData = this.object.system;

        const SanteClass = ".sante-" + actorData.sante.value;
        html.find(SanteClass).addClass("sante-cur");

        const StressClass = ".stress-" + actorData.stress.value;
        html.find(StressClass).addClass("stress-cur");

        //<i class="fa-solid fa-thumbtack"></i>

        if (this.actor.isOwner) {
            new ContextMenu(html, ".item-options", this.traitContextMenu);

             // Jet de caractéristique
            html.find('.roll-carac').click(this._onJetCaracteristique.bind(this));

            html.find('.roll-trait').click(this._onJetCaracAvecTrait.bind(this));

            html.find('.roll-metier').click(this._onJetCaracAvecMetier.bind(this));

            html.find('.roll-hobby').click(this._onJetCaracAvecHobby.bind(this));
        }
    }

    traitContextMenu = [
        /*{
            name: game.i18n.localize("age-system.showOnChat"),
            icon: '<i class="far fa-eye"></i>',
            callback: e => {
                const data = e[0].dataset;
                const item = this.actor.items.get(data.itemId);
                item.showItem(e.shiftKey)
            }
        },
        {
            name: game.i18n.localize("age-system.ageRollOptions"),
            icon: '<i class="fas fa-dice"></i>',
            callback: e => {
                const focus = this.actor.items.get(e.data("item-id"));
                const ev = new MouseEvent('click', {altKey: true});
                focus.roll(ev);
            }
        },*/
        {
            name: "Editer",
            icon: '<i class="fas fa-edit"></i>',
            callback: e => {
                const data = e[0].dataset;
                const item = this.actor.items.get(data.itemId);
                item.sheet.render(true);
            }
        },
        {
            name: "Supprimer",
            icon: '<i class="fas fa-trash"></i>',
            callback: e => {
                const data = e[0].dataset;
                const item = this.actor.items.get(data.itemId);

                let content = `<p>${item.type} : ${item.name}<br>Etes-vous certain de vouloir supprimer cet objet ?<p>`
                let dlg = Dialog.confirm({
                title: "Confirmation de suppression",
                content: content,
                yes: () => item.delete(),
                //no: () =>, On ne fait rien sur le 'Non'
                defaultYes: false
                });
            }
        }
    ];

    _onJetCaracteristique(event) {
        event.preventDefault();
        const dataset = event.currentTarget.dataset;

        Dice.jetCaracteristique({
            actor: this.actor,
            caracteristique: dataset.carac
        });
    }

    _onJetCaracAvecTrait(event) {
        event.preventDefault();
        const dataset = event.currentTarget.closest(".trait-item").dataset;

        let traitId = dataset.itemId;
        const trait = this.actor.items.get(traitId);

        Dice.jetCaracteristique({
            actor: this.actor,
            caracteristique: dataset.carac,
            trait : trait
        });
    }

    _onJetCaracAvecMetier(event) {
        event.preventDefault();
        const dataset = event.currentTarget.dataset;

        let metierId = dataset.itemId;
        const metier = this.actor.items.get(metierId);

        Dice.jetCaracteristique({
            actor: this.actor,
            caracteristique: dataset.carac,
            metier : metier,
            afficherDialog: true
        });
    }

    _onJetCaracAvecHobby(event) {
        event.preventDefault();
        const dataset = event.currentTarget.dataset;

        let hobbyId = dataset.itemId;
        const hobby = this.actor.items.get(hobbyId);

        Dice.jetCaracteristique({
            actor: this.actor,
            caracteristique: dataset.carac,
            hobby : hobby,
            afficherDialog: true
        });
    }
}