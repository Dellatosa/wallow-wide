import * as Dice from "./dice.js";

export function addChatListeners(html) {
    html.on('click', 'button.spec', onRelanceSpecialisation);
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
    let resultat = dataset.resultat;
    let rollFormula = `1d${dataset.faces}`;

    Dice.jetRelanceSpecialisation({
        actor: actor,
        specialisation: specialisation,
        rollFormula : rollFormula,
        resultat: resultat
    });

    element.classList.add("used");
    element.innerHTML = `${specialisation} (utilisée)`;
}