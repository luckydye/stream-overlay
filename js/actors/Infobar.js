import { Actor } from '../ActorManager.js';
import { Effects } from '../libs/Effects.js';

export class InfoBar extends Actor {

	constructor() {
		super("infobar");

		this.items = [
			this.createItem("lastfollower", "Last Follower", ""),
		];

		this.render(this.items);
		this.updateItems(this.state.state);
	}

	effects(item) {
		const canvas = item.querySelector("#effects");
		return Effects.firework(canvas, 50, 0);
	}

	createItem(id, title, initital) {
		if(!title || !id) return;

		let value = "";

		const _item = document.createElement("div");
		_item.className = "details-item";
		_item.innerHTML = `
			<label id="title">${title}</label>
			<div id="value" class="value">
				${initital || ""}
			</div>
			<canvas id="effects"></canvas>
		`;

		const _title = _item.querySelector("#title");
		const _value = _item.querySelector("#value");

		const animateUpdate = (newValue) => {
			if(value) {
				_value.innerHTML = `
					<a class="animating">${newValue}</a>
					<a class="animating">${value}</a>
				`;
				setTimeout(() => {
					_value.innerHTML = `
						<a>${newValue}</a>
					`;
				}, 300);
			} else {
				_value.innerHTML = `<a>${newValue}</a>`;
			}
			value = newValue;
		}

		return {
			id: id,
			element: _item,
			set title(str) {
				_title.innerText = str;
			},
			get title() {
				return _title.innerText;
			},
			set value(str) {
				animateUpdate(str);
			},
			get value() {
				return value;
			},
		}
	}

	render(items) {
		const _list = document.querySelector(".details-list");
		_list.innerHTML = "";
		for(let item of items) {
			_list.appendChild(item.element);
		}
	}

	updateItems(obj) {
		this.items.forEach(item => {
			const value = obj[item.id];
			if(value) {
				item.value = value;
			}
		})
		this.state.save(obj);
	}
}
