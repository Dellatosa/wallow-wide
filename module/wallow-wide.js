import { WallowWide } from "./config.js";
import WallowWideActorSheet from "./sheets/WallowWideActorSheet.js";
import WallowWideActor from "./WallowWideActor.js";
import WallowWideItemSheet from "./sheets/WallowWideItemSheet.js";
import WallowWideItem from "./WallowWideItem.js";
import * as Chat from "./chat.js";
import { DrameTracker } from "./drame-tracker.js";

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
        WallowWideActor,
        WallowWideItem,
        DrameTracker
    };

    game.WallowWide.drameTracker = new DrameTracker({
        popOut: false,
        minimizable: false,
        resizable: false
    });

    //CONFIG.debug.hooks = true;

    CONFIG.WallowWide = WallowWide;
    CONFIG.Actor.documentClass = WallowWideActor;
    CONFIG.Item.documentClass = WallowWideItem;

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("wallow-wide", WallowWideActorSheet, {makeDefault: true});

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("wallow-wide", WallowWideItemSheet, {makeDefault: true});

    preloadHandlebarsTemplates();

    Handlebars.registerHelper("configVal", function(liste, val) {
        return WallowWide[liste][val];
    });
})

Hooks.on("renderChatLog", (app, html, data) => Chat.addChatListeners(html));

Hooks.once("ready", async function() {
    // Tracker Handling
    // Identify if User already has ageTrackerPos flag set
    const userTrackerFlag = await game.user.getFlag("wallow-wide", "drameTrackerPos");
    const useTracker = true;
    if (!userTrackerFlag) await game.user.setFlag("wallow-wide", "drameTrackerPos", WallowWide.drameTrackerPos);
    if (useTracker) game.WallowWide.drameTracker.refresh();

    console.log(game.WallowWide.drameTracker);
});