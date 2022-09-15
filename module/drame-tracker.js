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

		/*const compType = game.settings.get("age-system", "complication");
		data.hasComplication = (compType === "none") ? false : true;
		if (data.hasComplication) {
			const compData = game.settings.get("age-system", "complicationValue");
			compData.type = compType;
			compData.tracker = new Array(compData.max);
			for (let b = 0; b < compData.tracker.length; b++) {
				compData.tracker[b] = {};
				compData.tracker[b].check = (compData.actual-1 >= b) ? true : false;
				compData.tracker[b].milestone = ((b+1) % 10 === 0) ? true : false;
			};
			data.compData = compData;
		};*/

		return data;
	}
	
	activateListeners(html) {
		super.activateListeners(html);
		html.find(".tracker-reinit").click(this._onTrackerReinit.bind(this));
		html.find(".milestone").click(this._onRollComp.bind(this));		
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

	_onTrackerReinit(event) {
		event.preventDefault();		

		let actors = game.actors.filter(function (actor) { return actor.type == "pj"});
		console.log(actors);

		actors.forEach(actor => {
			actor.update({"system.pointsDrame": 0});
		});

		//TO DO - Pb aevc le refresh alors que l'update est OK
		this.refresh();
	}

	_onRightClick(event) {
		const tracker = event.currentTarget.closest("#drame-tracker");
		const original = CONFIG.ageSystem.ageTrackerPos;
		tracker.style.left = original.xPos;
		tracker.style.bottom = original.yPos;
		game.user.setFlag("wallow-wide", "drameTrackerPos", original);
	}

	_onClickComp(event) {
		event.preventDefault();
		/*const compData = game.settings.get("age-system", "complicationValue");
		if (event.currentTarget.classList.contains('refresh')) return game.settings.set("age-system", "complicationValue", {max: compData.max, actual: 0});
		let value;
		if (event.shiftKey) value = 10;
		if (!value && event.ctrlKey) value = 5;
		if (!value) value = 1;
		if (event.currentTarget.classList.contains('minus')) value = -value;
		compData.actual += value;
		if (compData.actual > compData.max) compData.actual = compData.max;
		if (compData.actual < 0) compData.actual = 0;
		game.settings.set("age-system", "complicationValue", compData);*/
	}

	async _onRollComp() {
		/*const compType = game.i18n.localize(`SETTINGS.comp${game.settings.get("age-system", "complication")}`);
		const flavor = game.i18n.format("age-system.chatCard.compRoll", {compType});
		let compRoll = new Roll("1d6");
		return await compRoll.toMessage({flavor, rollMode: "selfroll", whisper: [game.user.id]});*/
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