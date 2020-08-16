import { Emotes } from './emote.mjs';

const particles = [];
const PARTICLE_IMAGE_SIZE = 64;

let stoped = false;
let done = true;

export async function rain(time = 8) {
    if(!done) return;

    stoped = false;
    done = false;

    const emoteCahce = await Emotes.getOrUpdateCache('cihansenpai');
    const emotes = Object.keys(emoteCahce);

    const canvas = document.querySelector('canvas');

    canvas.style.position = "fixed";
    canvas.style.top = 0;
    canvas.style.left = 0;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', e => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    const ctx = canvas.getContext("2d");

    for(let i = 0; i < 500; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * 100,
            velocity: Math.random() * 5 + 5
        });
    }

    setInterval(() => {
        if(Math.random() > 0.5 && !stoped) {
            const img = new Image();

            const emote = emotes[Math.floor(Math.random() * emotes.length)];
        
            img.onload = () => {
                particles.push({
                    x: Math.random() * window.innerWidth,
                    y: -100,
                    velocity: Math.random() * 3 + 3,
                    image: img,
                    killable: true,
                });
            }

            img.src = emoteCahce[emote];
        }
    }, 10);

    const tickrate = 1000 / 144;

    let accumulator = 0;
    let lastTick = performance.now();
    
    const tick = () => {

        const currentTick = performance.now();
        const delta = currentTick - lastTick;

        accumulator += delta;

        while(accumulator >= tickrate) {
            accumulator -= tickrate;

            draw(ctx);
            update(ctx);
        }

        lastTick = currentTick;

        if(!done) {
            requestAnimationFrame(tick);
        }
    }

    tick();

    setTimeout(() => {
        stoped = true;
    }, 1000 * time);
}

function draw(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for(let particle of particles) {
        ctx.fillStyle = "rgba(137, 195, 243, 0.726)";
        
        if(particle.image) {
            const ar = particle.image.width / particle.image.height;
            ctx.drawImage(particle.image, particle.x, particle.y, PARTICLE_IMAGE_SIZE * ar, PARTICLE_IMAGE_SIZE);
        } else {
            ctx.fillRect(particle.x, particle.y, 1, 1 + (particle.velocity * 2));
        }
    }
}

function update(ctx) {
    let killList = [];

    for(let particle of particles) {
        particle.y += particle.velocity;

        if(particle.image) {
            particle.velocity += 0.05;
        }

        if(particle.y > ctx.canvas.height && !particle.killable) {
            if(stoped) {
                killList.push(particle);
            } else {
                particle.y = Math.random() * 100;
            }
        }
    }

    for(let particle of particles) {
        if(particle.y > ctx.canvas.height && particle.killable) {
            killList.push(particle);
        }
    }

    for(let p of killList) {
        particles.splice(particles.indexOf(p), 1);
    }

    if(particles.length == 0) {
        done = true;
    }
}
