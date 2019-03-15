import { Actor } from '../ActorManager.js';
import { Effects } from '../libs/Effects.js';
import { Sounds } from '../libs/Sounds.js';

export class Alerts extends Actor {

	static get Types() {
		return {
			'follow': {
				sufix: "is now following!",
				time: 8000,
			},
			'subscription': {
				sufix: "subscribed!",
				time: 8000,
			},
			'donation': {
				sufix: "donated",
				time: 8000,
			}
		}
	}

	constructor() {
		super("alerts");

		this.element = document.createElement("div");
		this.element.className = "alerts";
		this.element.innerHTML = `
			<style>
				.alerts canvas {
					position: fixed;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					animation: show 1s ease;
				}
			</style>
		`;
		document.body.appendChild(this.element);

		this.queue = this.state.state.queue || [];
		this.current = null;
	}

	trigger() {
		if(this.queue.length > 0 && !this.current) {
			const item = this.queue[0];
			this.display(item).then(() => {
				this.current = null;
				if(this.queue.length > 0) {
					this.trigger();
				}
			})
			this.current = item;
			this.queue.shift();
		}
		this.state.save({
			queue: this.queue
		});
	}

	push(alert) {
		this.queue.push(alert);
		this.trigger();
	}

	display(item) {
		const type = Alerts.Types[item.type];

		return new Promise((resolve, reject) => {
			const canvas = document.createElement("canvas");
			canvas.height = window.innerHeight;
			canvas.width = window.innerWidth;

			const fx = Effects.particleText({
				str: item.name, 
				color: "#d62424",
				sufix: type.sufix, 
				canvas, 
				x: 0, 
				y: -300
			});

			const bg = document.createElement("div");
			bg.className = "alert_background";
			bg.style.position = "absolute";
			bg.style.top = `calc(50% - ${310}px)`;
			bg.style.left = `calc(50% + ${5}px)`;
			bg.style.width = `${fx.width + 50}px`;

			fx.run();
			this.element.appendChild(bg);
			this.element.appendChild(canvas);

			setTimeout(() => {
				Sounds.play(item.type);
			}, 500);
			setTimeout(() => {
				canvas.addEventListener("animationend", () => {
					fx.clear();
					canvas.remove();
					bg.remove();
				})
				canvas.style.animation = "hide .5s";
				bg.style.animation = "hide .5s";
				resolve();
			}, type.time);
		})
	}

}
