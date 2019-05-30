import { Streamlabs } from '../src/Streamlabs.js';
import { QueuedOverlayElement } from '../src/QueuedOverlayElement.js';

export class RaidedOverlay extends QueuedOverlayElement {

    static template(props) {
        return `
            <div class="overlay-component">
                ${JSON.stringify(props.current, null, '  ')}
                ${JSON.stringify(props.queue.length, null, '  ')}
            </div>
        `;
    }

    connectedCallback() {
        Streamlabs.connect();
        Streamlabs.on('raid', message => {
            this.push({ type: "raid", data: message });
        })
    }

}

customElements.define('overlay-raided', RaidedOverlay);
