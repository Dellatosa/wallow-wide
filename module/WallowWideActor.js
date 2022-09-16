export default class WallowWideActor extends Actor {

    prepareData() {
        super.prepareData();
        let data = this.system;

        /*-----------------------------------------------
        ---- Calcul des caracteristiques secondaires ----
        -----------------------------------------------*/

        /* Santé */
        data.sante.max = 12 + (data.mental.valeur + data.physique.valeur) * 2;
        if(data.sante.value < 0) {data.sante.value = 0; }
        if(data.sante.max < 0) {data.sante.max = 0; }
        if(data.sante.value > data.sante.max) {data.sante.value = data.sante.max; }

        /* Stress */
        data.stress.max = 12 + (data.mental.valeur + data.conscience.valeur) * 2;
        if(data.stress.value < 0) {data.stress.value = 0; }
        if(data.stress.max < 0) {data.stress.max = 0; }
        if(data.stress.value > data.stress.max) {data.stress.value = data.stress.max; }

        /* Défense */
        data.defense = 6 +  data.physique.valeur + data.conscience.valeur;
        //if(data.defense < 0) {data.defense = 0; }
        if(data.pointsPerso < 0) {data.pointsPerso = 0; }
    }

    reinitPointDrame() {
        this.update({"system.pointsDrame": 0});
    }

    utiliserPointDrame() {
        this.update({"system.pointsDrame": this.system.pointsDrame + 1});
    }

    restituerPointDrame() {
        this.update({"system.pointsDrame": this.system.pointsDrame - 1});
    }
}

Hooks.on("updateActor", (actor, data, diff, id) => onUpdateActor());

function onUpdateActor() {
    game.WallowWide.drameTracker.refresh();
}