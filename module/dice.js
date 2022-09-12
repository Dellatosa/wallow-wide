export async function jetCaracteristique ({actor = null,
    caracteristique = null,
    difficulte = null,
    afficherDialog = true,
    envoiMessage = true} = {}) {

    // Récupération des données de l'acteur
    let actorData = actor.system;

    let valeur = actorData[caracteristique].valeur;
    let nomCarac = actorData[caracteristique].label;

    // Définition de la formule de base du jet
    let rollFormula;
    switch(valeur) {
        case -3:
            rollFormula = "{1d8,1d8,1d8}"
            break;
        case -2:
            rollFormula = "{1d10,1d8,1d8}"
            break;
        case -1:
            rollFormula = "{1d10,1d10,1d8}"
            break;
        case 0:
            rollFormula = "{1d10,1d10,1d10}"
            break;
        case 1:
            rollFormula = "{1d12,1d10,1d10}"
            break;
        case 2:
            baseForollFormularmula = "{1d12,1d12,1d10}"
            break;
        case 3:
            rollFormula = "{1d12,1d12,1d12}"
            break;
    }

    let rollData = {
        nomPersonnage : actor.name,
        caracteristique: nomCarac,
        valeur: valeur
    }
        
    let rollResult = await new Roll(rollFormula, rollData).roll({async: true});
        
    const sortDesc = (a, b) => a[1] - b[1];

    var diceResults = [];
    diceResults.push([rollResult.dice[0].faces, rollResult.dice[0].total]);
    diceResults.push([rollResult.dice[1].faces, rollResult.dice[1].total]);
    diceResults.push([rollResult.dice[2].faces, rollResult.dice[2].total]);
    diceResults.sort(sortDesc);

    let dice0 = {
        faces: diceResults[0][0],
        total: diceResults[0][1]
    };

    let dice1 = {
        faces: diceResults[1][0],
        total: diceResults[1][1]
    };

    let dice2 = {
        faces: diceResults[2][0],
        total: diceResults[2][1]
    };

    let dices = {
        dice0 : dice0,
        dice1 : dice1,
        dice2 : dice2
    }

    rollData.dices = dices;

    if(envoiMessage) {
        let messageTemplate;
        // Recupération du template
        messageTemplate = "systems/wallow-wide/templates/partials/dice/jet-carac.hbs"; 
        
        let renderedRoll = await rollResult.render();

        // Assignation des données au template
        let templateContext = {
            actorId : actor.id,
            stats : rollData,
            roll: renderedRoll
        }

        console.log(templateContext);

        // Construction du message
        let chatData = {
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({ actor: actor }),
            roll: rollResult,
            content: await renderTemplate(messageTemplate, templateContext),
            sound: CONFIG.sounds.dice,
            type: CONST.CHAT_MESSAGE_TYPES.ROLL
        }

        // Affichage du message
        await ChatMessage.create(chatData);
    }
}