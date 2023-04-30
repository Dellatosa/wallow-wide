import * as Dice from "./dice.js";

export function addChatListeners(html) {
    html.on('click', 'button.spec', onRelanceSpecialisation);
    html.on('click', 'button.drame', onUtiliserDrame);
}

function onRelanceSpecialisation(event) {
    event.preventDefault();
    let element = event.currentTarget;

    if (element.classList.contains("used"))
    {
        ui.notifications.warn('Vous avez relancé le dé grace à cette spécialisation !');    
        return;
    }

    const dataset = event.currentTarget.dataset;

    let actor = game.actors.get(dataset.actorId);
    let specialisation = dataset.spec;
    let depDrame = dataset.depDrame;
    let rollFormula = `1d${dataset.faces0}`;

    var diceResults = [];
    diceResults.push([parseInt(dataset.faces1), parseInt(dataset.total1), false]);
    diceResults.push([parseInt(dataset.faces2), parseInt(dataset.total2), false]);

    Dice.jetRelanceSpecialisation({
        actor: actor,
        specialisation: specialisation,
        rollFormula : rollFormula,
        diceResults: diceResults,
        depDrame: (depDrame  === "true")
    });

    element.classList.add("used");
    element.innerHTML = `${specialisation} (utilisée)`;
}

async function onUtiliserDrame(event) {
    event.preventDefault();
    let element = event.currentTarget;

    if (element.classList.contains("used"))
    {
        ui.notifications.warn('Vous avez utilisé le point de Drame !');    
        return;
    }

    const dataset = event.currentTarget.dataset;

    let actor = game.actors.get(dataset.actorId);
    let resultat = dataset.resultat;

    // Construction des données de l'item
    let cardData = {
        resultat: resultat,
        actorId: actor.id
    }

    // Recupération du template
    const messageTemplate = "systems/wallow-wide/templates/partials/dice/carte-point-drame.hbs"; 

    // Construction du message
    let chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        content: await renderTemplate(messageTemplate, cardData)
    }

    // Affichage du message
    await ChatMessage.create(chatData);

    actor.utiliserPointDrame();
    
    element.classList.add("used");
    element.innerHTML = `Point de Drame utilisé`;
}