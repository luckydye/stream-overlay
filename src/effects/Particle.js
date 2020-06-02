export class Vehicle {

	place() {
		const a = Math.random() * 180;
		this.pos[0] += Math.sin(a) * (Math.random() * 2500);
		this.pos[1] += Math.cos(a) * (Math.random() * 2500);

		this.pos[1] += 500;

		this.pos[0] *= 2;
		this.pos[1] *= 2;
	}
	
	constructor(x, y, color) {
		this.pos = [x, y];
		this.target = [x, y];

		this.place();

		this.acc = [0, 0];
		this.vel = [0, 0];
		this.arrived = false;
		this.lifespan = 0;
		
		this.hsl = null;
		this.color = color || "white";
		this.size = 1 + (Math.random() * 0.5);

		this.maxspeed = Math.random() * 0.18 + 0.01;
		this.forcefield = {
			size: 150,
			minspeed: 0.05,
			maxspeed: this.maxspeed
		}
	}

	update() {
		if(this.arrived) return;

		const distance = Math.sqrt(
			Math.pow(this.pos[0] - this.target[0], 2) + Math.pow(this.pos[1] - this.target[1], 2)
		);

		let speed = this.maxspeed;
		if(distance < this.forcefield.size) {
			speed = map(distance, 
				0, 
				this.forcefield.size, 
				this.forcefield.minspeed, 
				this.forcefield.maxspeed
			);
		} 
		if(distance < 0.1) {
			this.arrived = true;
		}

		this.pos[0] += this.vel[0] + (this.target[0] - this.pos[0]) * speed;
		this.pos[1] += this.vel[1] + (this.target[1] - this.pos[1]) * speed;

		this.vel[0] *= 0.98;
		this.vel[1] *= 0.98;

		if(this.hsl) {
			this.color = `hsla(${this.hsl.h}, ${this.hsl.s}%, ${this.hsl.l / (distance/(window.innerHeight/2))}%, 1)`;
		}

		this.lifespan++;
	}

	draw(context) {
		context.fillStyle = this.color;
		if(!this.arrived) {
			context.globalAlpha = this.lifespan / 33;
		} else {
			context.globalAlpha = 1;
		}
		context.arc(this.pos[0], this.pos[1], this.size, 0, 2 * Math.PI, true);
		context.fill();
	}
}