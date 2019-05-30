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
        Streamlabs.connect();
        Streamlabs.on('raid', message => {
            message.name += Math.floor(Math.random() * 100);
            this.push({ type: "raid", data: message });
        })
    }

}

customElements.define('overlay-raid', RaidedOverlay);
