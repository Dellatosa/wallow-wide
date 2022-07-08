import { WallowWide } from "./config.js";
import WallowWideActorSheet from "./sheets/WallowWideActorSheet.js";
import WallowWideActor from "./WallowWideActor.js";

async function preloadHandlebarsTemplates() {
    const templatePaths = [
        "systems/wallow-wide/templates/partials/actors/bloc-infos-personnage.hbs",
        "systems/wallow-wide/templates/partials/actors/bloc-caracteristiques-personnage.hbs",
        "systems/wallow-wide/templates/partials/actors/bloc-caracSecondaires-personnage.hbs"
    ];

    return loadTemplates(templatePaths);
}

Hooks.once("init", function(){
    console.log("Wallow Wide | Initialisation du système Wallow Wide le JDR");

    game.WallowWide = {
        WallowWideActor
        //WallowWideItem
    };

    //CONFIG.debug.hooks = true;

    CONFIG.WallowWide = WallowWide;
    CONFIG.Actor.documentClass = WallowWideActor;

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("wallow-wide", WallowWideActorSheet, {makeDefault: true});

    preloadHandlebarsTemplates();
})