import { Streamlabs } from '../src/Streamlabs.js';
import { QueuedOverlayElement } from '../src/QueuedOverlayElement.js';
import { Effects } from './../src/Effects.js';

export class AlertOverlay extends QueuedOverlayElement {

    static template(props, instance) {
        if(props.current) {
            const name = props.current.data.name;
            const raiders = props.current.data.raiders;

            const canvas = document.createElement('canvas');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const effect = Effects.particleText(`${name} is rading with ${raiders} viewers!`, 'hsla(0, 65%, 42%, 1)', ' ', canvas, 0, -120);

            if(effect) {
                setTimeout(() => {
                    effect.clear();
                    canvas.remove();
                }, 1000 * 12);

                instance.appendChild(canvas);
            }

            return `
                <style>
                    canvas {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                    }
                </style>
                <slot></slot>
                <span @load="${effect ? effect.run() : ''}"></span>
            `;
        }
    }

    loadedCallback() {
        Streamlabs.connect();
        Streamlabs.on('raid', message => {
            this.push({ type: "raid", data: message });
        })
    }

}

customElements.define('overlay-alerts', AlertOverlay);
