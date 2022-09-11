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
        valeur: valeur,
     }

        let rollResult = await new Roll(rollFormula, rollData).roll({async: true});
        console.log(rollResult);
    }