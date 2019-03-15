import {Vehicle} from '../effects/Particle.js';

let font;
window.setup = () => {
	font = loadFont('./fonts/Roboto-LightItalic.ttf');
}

export class Effects {

	static particleText({
		str, 
		color, 
		sufix, 
		canvas, 
		x, 
		y, 
		fontSize = 35
	}) {

		const points = font.textToPoints(str +" "+ sufix, 0, 0, fontSize, {
			sampleFactor: 0.75,
			simplifyThreshold: 0
		});
		
		const bounds = font.textBounds(str, 0, 0, fontSize);
		const sufixbounds = font.textBounds(sufix, 0, 0, fontSize);
		const width = sufixbounds.w + bounds.w;

		const ctxt = canvas.getContext("2d");

		const vehicles = [];
		for(let p of points) {
			const v = new Vehicle(
				p.x + x + (canvas.width/2) - (width / 2),
				p.y + y + (canvas.height/2)
			);
			if(p.x > bounds.w + 5) {
				// v.hsl = { h: 200, s: 80, l: 50 };
				v.color = "white";
			} else {
				v.color = color;
			}
			vehicles.push(v);
		}

		function draw() {
			ctxt.clearRect(0, 0, canvas.width, canvas.height);
			for(let v of vehicles) {
				ctxt.beginPath();
				v.draw(ctxt);
			}
		}
		
		let running = true;

		function update() {
			for(let v of vehicles) {
				v.update();
			}
		}

		let tickrate = 14;
		let accumulator = 0;
		let lasttick = 0;

		function tick(ms = 0) {
			accumulator += ms - lasttick;

			if(accumulator >= tickrate) {
				draw();
				update();
				accumulator = 0;
			}

			if(running) {
				requestAnimationFrame(tick);
				lasttick = ms;
			} else {
				ctxt.clearRect(0, 0, canvas.width, canvas.height);
			}
		}

		return {
			width: width,
			run() {
				tick();
			},
			clear() {
				running = false;
			}
		}
	}

	static firework(canvas, x, y) {
		const context = canvas.getContext("2d");

		const randomColor = () => {
			return `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
		}

		function particle(x, y, color) {
			color = color || randomColor();

			// id fn know
			let u = 2 * Math.random() - 1;
			let v = 2 * Math.random() - 1;
			let s = u * u + v * v;
			let l = Math.sqrt(s);
			let dirX = u / l;
			let dirY = v / l;
			let speed = Math.random() * 2 + 1;

			let lifespan = Math.random() * 40 + 20;
			let updates = 0;

			return {
				dead: false,
				size: 2,
				x, 
				y, 
				update() {
					x += dirX * speed;
					y -= dirY * speed - 1;
					speed *= 0.96;
				},
				draw() {
					updates++;
					context.fillStyle = color;
					const dx = canvas.width/2 + x + 10;
					const dy = y;
					context.fillRect(dx, dy, this.size, this.size);
					if(updates > lifespan) {
						this.dead = true;
					}
				}
			}
		}

		return {
			sparkles(amount) {
				let particles = new Set();
				for(let i = 0; i < amount; i++) {
					particles.add(particle(x, y));
				}
				
				function tick(ms) {
					context.clearRect(0, 0, canvas.width, canvas.height);

					for(let p of particles) {
						p.update();
						p.draw();

						if(p.dead) {
							particles.delete(p);
						}
					}
					if(particles.size > 0) {
						requestAnimationFrame(tick);
					} else {
						context.clearRect(0, 0, canvas.width, canvas.height);
					}
				}
				tick();
			}
		}
	}

}