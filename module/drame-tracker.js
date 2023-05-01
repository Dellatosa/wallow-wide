export class DrameTracker extends Application {

	constructor(options = {}) {
		super(options)
	}

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["wallow-wide", "tracker"]
        });
    }

	get template() {
		return `systems/wallow-wide/templates/drame-tracker.hbs`;
	}
	
	getData(options) {
		const data = super.getData(options);
		data.isGM = game.user.isGM;

		let actors = game.actors.filter(function (actor) { return actor.type == "pj"});

		let pointsDramePJ = 0;
		actors.forEach(actor => {
			if(actor.system.pointsDrame) {
				pointsDramePJ += actor.system.pointsDrame;
			}
		});

		let DefTailleReserve = game.settings.get("wallow-wide", "tailleReservePointsDrame");
		data.reservePointsDrame = Math.max(DefTailleReserve - pointsDramePJ, 0);

		return data;
	}
	
	activateListeners(html) {
		super.activateListeners(html);
		
		new ContextMenu(html, ".lst-persos-in", this.getPersosInContextMenu());
		new ContextMenu(html, ".lst-persos-out", this.getPersosOutContextMenu());
		html.find(".tracker-reinit").click(this._onTrackerReinit.bind(this));	
		html.find("#drame-tracker-drag").contextmenu(this._onRightClick.bind(this));

		// Set position
		let tracker = document.getElementById("drame-tracker");
		const trackerPos = game.user.getFlag("wallow-wide", "drameTrackerPos");
		tracker.style.left = trackerPos.xPos;
		tracker.style.bottom = trackerPos.yPos;

		// Make the DIV element draggable:
		this._dragElement(tracker);
	}
	
	refresh() {
		this.render(true);
	}

	getNbPointsReserve() {
		let element = document.getElementById("tracker-val");
		return element.dataset.valeur;
	}

	_onTrackerReinit(event) {
		event.preventDefault();		

		let actors = game.actors.filter(function (actor) { return actor.type == "pj"});

		actors.forEach(actor => {
			actor.reinitPointDrame();
		});
	}

	_onRightClick(event) {
		const tracker = event.currentTarget.closest("#drame-tracker");
		const original = CONFIG.WallowWide.drameTrackerPos;
		tracker.style.left = original.xPos;
		tracker.style.bottom = original.yPos;
		game.user.setFlag("wallow-wide", "drameTrackerPos", original);
	}

	getPersosInContextMenu() {
		let persosContextMenu = [];

		let actors = game.actors.filter(function (actor) { return actor.type == "pj"});
		actors.forEach(actor => {
			if(actor.system.pointsDrame >= 1) {
				let actorEntry = {
					name: actor.name,
					icon: '<i class="fa-solid fa-hat-cowboy"></i>',
					callback: e => {
						actor.restituerPointDrame();
					}
				}
				persosContextMenu.push(actorEntry);
			}
		});

		return persosContextMenu;
	}
	
	getPersosOutContextMenu() {
		let persosContextMenu = [];

		let actors = game.actors.filter(function (actor) { return actor.type == "pj"});

		let pointsDramePJ = 0;
		actors.forEach(actor => {
			if(actor.system.pointsDrame) {
				pointsDramePJ += actor.system.pointsDrame;
			}
		});

		let DefTailleReserve = game.settings.get("wallow-wide", "tailleReservePointsDrame");
		let reservePointsDrame = Math.max(DefTailleReserve - pointsDramePJ, 0);

		actors.forEach(actor => {
			if(actor.system.pointsDrame <= 1 && reservePointsDrame > 0) {
				let actorEntry = {
					name: actor.name,
					icon: '<i class="fa-solid fa-hat-cowboy"></i>',
					callback: e => {
						actor.utiliserPointDrame();
					}
				}
				persosContextMenu.push(actorEntry);
			}
		});

		return persosContextMenu;
	}

	_dragElement(elmnt) {
		var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
		if (document.getElementById("drame-tracker-drag")) {
		  // if present, the header is where you move the DIV from:
		  document.getElementById("drame-tracker-drag").onmousedown = dragMouseDown;
		} else {
		  // otherwise, move the DIV from anywhere inside the DIV:
		  elmnt.onmousedown = dragMouseDown;
		}
	  
		function dragMouseDown(e) {
		  e = e || window.event;
		  e.preventDefault();
		  // get the mouse cursor position at startup:
		  pos3 = e.clientX;
		  pos4 = e.clientY;
		  document.onmouseup = closeDragElement;
		  // call a function whenever the cursor moves:
		  document.onmousemove = elementDrag;
		}
	  
		function elementDrag(e) {
		  e = e || window.event;
		  e.preventDefault();
		  // calculate the new cursor position:
		  pos1 = pos3 - e.clientX;
		  pos2 = pos4 - e.clientY;
		  pos3 = e.clientX;
		  pos4 = e.clientY;
		  // set the element's new position:
		  elmnt.style.bottom = (elmnt.offsetParent.clientHeight - elmnt.offsetTop - elmnt.clientHeight + pos2) + "px";
		  elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
		}
	  
		function closeDragElement() {
		  	// stop moving when mouse button is released:
		  	document.onmouseup = null;
		  	document.onmousemove = null;
		  	// Save position on appropriate User Flag
			const trackerPos = {};
			trackerPos.xPos = elmnt.style.left;
			trackerPos.yPos = elmnt.style.bottom;
			game.user.setFlag("wallow-wide", "drameTrackerPos", trackerPos);
		}
	}
}