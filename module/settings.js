export const registerSystemSettings = function() {
    
    game.settings.register("wallow-wide","tailleReservePointsDrame", {
        config: true,
        scope: "world",
        name: "Réserve de points de Drame",
        hint: "Cette option permet de définir le nombre maximum de points de Drame de la réserve.",
        type: Number,
        default: 2,
        onChange: value => { game.WallowWide.drameTracker.refresh(); }
    });
}