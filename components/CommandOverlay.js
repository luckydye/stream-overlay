import { OverlayElement } from "../src/OverlayElement.js";
import { Nightbot } from "../src/Nightbot.js";

export class CommandOverlay extends OverlayElement {

    static template(props) {
        return `
            <div class="details">
                <a>${props.text}</a>
            </div>
        `;
    }

    connectedCallback() {
        setInterval(() => this.update(), 4000);
    }
    
    async update() {

        if(!Nightbot.authorized && !Nightbot.authorizing) {
            await Nightbot.authorize();
        }

        if(!Nightbot.authorizing && Nightbot.authorized) {

            const result = await Nightbot.getCommand(this.getAttribute('command'));

            if(!result) return;
            
            let text = result.message;

            if(result) {
                this.setState({ text });
            }
        }
    }

}

customElements.define('overlay-command', CommandOverlay);