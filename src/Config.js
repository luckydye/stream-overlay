let stylesConfig = null;
let config = new Map();

window.exports = {};

async function getCustomCSS(nodeElement) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(window.getComputedStyle(nodeElement || document.body));
        }, 500);
    })
}

export class Config {

    static async load() {
        stylesConfig = await getCustomCSS();
    }

    static get(key) {
        if(config.has(key)) {
            return config.get(key);
        } else if(localStorage.getItem(key)) {
            return localStorage.getItem(key);
        } else if(stylesConfig) {
            return stylesConfig.getPropertyValue('--' + key);
        }
    }

    static set(key, value) {
        config.set(key, value);
        localStorage.setItem(key, value);
    }

}
