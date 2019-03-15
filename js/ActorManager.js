window.actorStore = new Map();

export class ActorManager {

	static get Store() {
		return window.actorStore;
	}

	static hookup(actorKey, actor) {
		if(actor instanceof Actor) {
			ActorManager.Store.set(actorKey, actor);
		}
	}

	static lookup(actorKey) {
		if(ActorManager.Store.has(actorKey)) {
			return ActorManager.Store.get(actorKey);
		}
	}

}

export class Actor {
	constructor(actorId) {
		this.state = new State(actorId);
	}
}

// State saveable to local storage
class State {
	constructor(id) {
		this.key = id;
		this.state = this.load();
	}

	load() {
		return JSON.parse(localStorage.getItem(this.key)) || {};
	}

	save(obj) {
		const state = this.load();
		for(let key in obj) {
			state[key] = obj[key];
		}
		localStorage.setItem(this.key, JSON.stringify(state));
	}
}