import { WallowWide } from "./config.js";
import { registerSystemSettings } from "./settings.js";
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

    return foundry.applications.handlebars.loadTemplates(templatePaths);
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

    foundry.documents.collections.Actors.unregisterSheet("core", foundry.appv1.sheets.ActorSheet);
    foundry.documents.collections.Actors.registerSheet("wallow-wide", WallowWideActorSheet, {makeDefault: true});

    foundry.documents.collections.Items.unregisterSheet("core", foundry.appv1.sheets.ItemSheet);
    foundry.documents.collections.Items.registerSheet("wallow-wide", WallowWideItemSheet, {makeDefault: true});

    registerSystemSettings();
    
    preloadHandlebarsTemplates();

    Handlebars.registerHelper("configVal", function(liste, val) {
        return WallowWide[liste][val];
    });
})

//Hooks.on("renderChatLog", (app, html, data) => Chat.addChatListeners(html));

Hooks.on("renderChatMessageHTML", (message, html, context) => Chat.addChatMessageListeners(html));

Hooks.once("ready", async function() {
    // Tracker Handling
    // Identify if User already has ageTrackerPos flag set
    const userTrackerFlag = await game.user.getFlag("wallow-wide", "drameTrackerPos");
    const useTracker = true;
    if (!userTrackerFlag) await game.user.setFlag("wallow-wide", "drameTrackerPos", WallowWide.drameTrackerPos);
    if (useTracker) game.WallowWide.drameTracker.refresh();
});