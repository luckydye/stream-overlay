import { Loader } from './Loader.js';

export class OverlayElement extends HTMLElement {

    static template(props) {
        return ``;
    }

    loadStyles() {
        Loader.loadStyles('../components/' + this.constructor.name, this.shadowRoot);
    }

    get attributes() {
        return [];
    }

    constructor() {
        super();

        this.state = {};
        
        this.attachShadow({ mode: "open" });
        this.loadStyles();
        
        this.root = document.createElement('component');
        this.shadowRoot.appendChild(this.root);

        this.setAttribute('type', this.constructor.name);

        this.applyAttributes();
        this.load();

        Loader.load().then(() => {
            this.loadedCallback();
        });
    }

    loadedCallback() {
        
    }

    applyAttributes() {
        for(let key of this.attributes) {
            if(this.hasAttribute(key)) {
                const value = this.getAttribute(key);
                if(Number.isNaN(+value)) {
                    this[key] = value;
                } else {
                    this[key] = +value;
                }
            }
        }
    }

    render() {
        const template = this.constructor.template(this.state, this);

        if(!template) {
            this.root.style.visibility = "hidden";
        } else {
            this.root.removeAttribute("style");
            const test = document.createElement('div');
            test.innerHTML = template;
            
            const changed = !(test.innerHTML == this.root.innerHTML);
            if(changed) {
                this.root.innerHTML = template;
            }
        }
    }

    setState(data) {
        this.state = data;
        this.render();
        this.save();
    }

    load() {
        let data = localStorage.getItem(this.constructor.name);
        data = JSON.parse(data);
        if(data) {
            this.setState(data);
        }
    }

    save() {
        const data = JSON.stringify(this.state);
        localStorage.setItem(this.constructor.name, data);
    }
}
