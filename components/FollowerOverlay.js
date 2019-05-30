import { Streamlabs } from '../src/Streamlabs.js';
import { QueuedOverlayElement } from '../src/QueuedOverlayElement.js';

export class FollowerOverlay extends QueuedOverlayElement {

    static template(props) {
        if(props.current) {
            const name = props.current.data.name;
            return `
                <a class="prefix">last follower</a>
                <a class="name">${name}</a>
            `;
        }
    }

    connectedCallback() {
        window.addEventListener('load', () => {
            Streamlabs.connect();
            Streamlabs.on('follow', message => {
                this.push({ type: "follow", data: message });
            })
        })
    }

}

customElements.define('overlay-follower', FollowerOverlay);
