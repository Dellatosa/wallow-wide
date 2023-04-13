export async function jetCaracteristique ({actor = null,
    caracteristique = null,
    trait = null,
    metier = null,
    hobby = null,
    difficulte = null,
    depDramePossible = null,
    afficherDialog = true,
    envoiMessage = true} = {}) {

    // Récupération des données de l'acteur
    let actorData = actor.system;

    let speUtilisee = null;
    if(afficherDialog && metier) {
        let dialogOptions = await getJetMetierOptions({cfgData: CONFIG.WallowWide, metier: metier});
        
        // On annule le jet sur les boutons 'Annuler' ou 'Fermeture'    
        if(dialogOptions.annule) {
            return null;
        }

        // Récupération des données de la fenêtre de dialogue pour ce jet 
        caracteristique = dialogOptions.caracteristique;
        speUtilisee = dialogOptions.speUtilisee;
    }

    if(afficherDialog && hobby) {
        let dialogOptions = await getJetHobbyOptions({cfgData: CONFIG.WallowWide, hobby: hobby});
        
        // On annule le jet sur les boutons 'Annuler' ou 'Fermeture'    
        if(dialogOptions.annule) {
            return null;
        }

        // Récupération des données de la fenêtre de dialogue pour ce jet 
        caracteristique = dialogOptions.caracteristique;
        //speUtilisee = dialogOptions.speUtilisee;
    }

    if(!caracteristique) {
        ui.notifications.warn(`Veuillez sélectionner une caractéristique pour effectuer ce jet.`);
        return null;
    }

    let valeur = actorData[caracteristique].valeur;
    let nomCarac = actorData[caracteristique].label;

    // Définition de la formule de base du jet
    let rollFormula;
    if(actorData.etat.blesse) {
        rollFormula = "{1d8,1d8,1d8}";
    }
    else {
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
                rollFormula = "{1d12,1d12,1d10}"
                break;
            case 3:
                rollFormula = "{1d12,1d12,1d12}"
                break;
        }
    }

    let rollData = {
        nomPersonnage : actor.name,
        caracteristique: nomCarac,
        valeur: valeur
    }
     
    if(actorData.etat.blesse) {
        rollData.blesse = actorData.etat.blesse;
    }

    if(trait) {
        rollData.trait = trait.name;
    }

    if(metier) {
        rollData.metier = metier.name;
        if(speUtilisee) {
            rollData.specialisation = metier.system.specialisation
        }
    }

    if(hobby) {
        rollData.hobby = hobby.name;
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

    if(trait || hobby) {
        rollData.resultat = dices.dice2.total;
        actor.utiliserPointDrame();
    }
    else if(metier) {
        /*if(metier.system.niveau == "maitre") {
            rollData.resultat = dices.dice2.total;    
        }
        else if(metier.system.niveau == "expert") {*/
            rollData.resultat = dices.dice1.total;            
            // TODO Gérer le bouton de reroll
            
            //rollData.depenseDrame = true;
            rollData.depenseDrame = depDramePossible;
    /*}
        else {
            rollData.resultat = dices.dice2.total;
            actor.utiliserPointDrame();    
        }*/
    }
    /*else if(hobby) {
        if(hobby.system.niveau == "maitre") {
            rollData.resultat = dices.dice2.total;    
        }
        else if(hobby.system.niveau == "expert") {
            rollData.resultat = dices.dice1.total;            
            // TODO Gérer le bouton de reroll
            rollData.depenseDrame = true;
        }
        else {
            rollData.resultat = dices.dice2.total;
            actor.utiliserPointDrame();    
        }
    }*/
    else {
        rollData.resultat = dices.dice1.total;
    }

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

// Fonction de construction de la boite de dialogue de jet de caracteristique Métier
async function getJetMetierOptions({cfgData = null, metier = null}) {
    // Recupération du template
    const template = "systems/wallow-wide/templates/partials/dice/dialog-jet-metier.hbs";
    const html = await renderTemplate(template, {cfgData: cfgData, metier: metier});

    return new Promise( resolve => {
        const data = {
            title: "Jet de caractéristique avec bonus Métier",
            content: html,
            buttons: {
                jet: { // Bouton qui lance le jet de dé
                    icon: '<i class="fas fa-dice"></i>',
                    label: "Jeter les dés",
                    callback: html => resolve(_processJetMetierOptions(html[0].querySelector("form")))
                },
                annuler: { // Bouton d'annulation
                    label: "Annuler",
                    callback: html => resolve({annule: true})
                }
            },
            default: "jet",
            close: () => resolve({annule: true}) // Annulation sur fermeture de la boite de dialogue
        }

        // Affichage de la boite de dialogue
        new Dialog(data, null).render(true);
    });        
}

// Gestion des données renseignées dans la boite de dialogue de jet de caracteristique Métier
function _processJetMetierOptions(form) {
    let speUtilisee = false;
        if(form.speUtilisee) {
            speUtilisee = form.speUtilisee.checked;
        }

    return {
        caracteristique: form.carac.value != "aucun" ? form.carac.value : null,
        speUtilisee: speUtilisee
    }
}

export async function jetRelanceSpecialisation ({actor = null,
    specialisation = null,
    rollFormula = null,
    resultat = null} = {}) {

    let rollData = {
        nomPersonnage : actor.name,
        specialisation : specialisation
    }

    let rollResult = await new Roll(rollFormula, rollData).roll({async: true});

    rollData.faces = rollResult.dice[0].faces;
    rollData.total = rollResult.dice[0].total;
    rollData.resultat = Math.max(resultat, rollResult.dice[0].total);

    let messageTemplate;
    // Recupération du template
    messageTemplate = "systems/wallow-wide/templates/partials/dice/jet-reroll-spec.hbs"; 
        
    let renderedRoll = await rollResult.render();

    // Assignation des données au template
    let templateContext = {
        actorId : actor.id,
        stats : rollData,
        roll: renderedRoll
    }

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

// Fonction de construction de la boite de dialogue de jet de caracteristique Hobby
async function getJetHobbyOptions({cfgData = null, hobby = null}) {
    // Recupération du template
    const template = "systems/wallow-wide/templates/partials/dice/dialog-jet-hobby.hbs";
    const html = await renderTemplate(template, {cfgData: cfgData, hobby: hobby});

    return new Promise( resolve => {
        const data = {
            title: "Jet de caractéristique avec bonus Hobby",
            content: html,
            buttons: {
                jet: { // Bouton qui lance le jet de dé
                    icon: '<i class="fas fa-dice"></i>',
                    label: "Jeter les dés",
                    callback: html => resolve(_processJetHobbyOptions(html[0].querySelector("form")))
                },
                annuler: { // Bouton d'annulation
                    label: "Annuler",
                    callback: html => resolve({annule: true})
                }
            },
            default: "jet",
            close: () => resolve({annule: true}) // Annulation sur fermeture de la boite de dialogue
        }

        // Affichage de la boite de dialogue
        new Dialog(data, null).render(true);
    });        
}

// Gestion des données renseignées dans la boite de dialogue de jet de caracteristique Hobby
function _processJetHobbyOptions(form) {
    /*let speUtilisee = false;
        if(form.speUtilisee) {
            speUtilisee = form.speUtilisee.checked;
        }
    */

    return {
        caracteristique: form.carac.value != "aucun" ? form.carac.value : null
        //speUtilisee: speUtilisee
    }
}