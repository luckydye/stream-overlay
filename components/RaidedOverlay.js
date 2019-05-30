import { Streamlabs } from '../src/Streamlabs.js';
import { QueuedOverlayElement } from '../src/QueuedOverlayElement.js';

export class RaidedOverlay extends QueuedOverlayElement {

    static template(props) {
        if(props.current) {
            const name = props.current.data.name;
            return `
                <a class="prefix">last raid</a>
                <a class="name">${name}</a>
            `;
        }
    }

    connectedCallback() {
        window.addEventListener('components.loaded', () => {
            Streamlabs.connect();
            Streamlabs.on('raid', message => {
                this.push({ type: "raid", data: message });
            })
        })
    }

}

customElements.define('overlay-raid', RaidedOverlay);
