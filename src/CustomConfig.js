let styles = null;

async function getCustomCSS() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(window.getComputedStyle(document.body));
        }, 250);
    })
}

export class Config {

    static async get(key) {
        if(!styles) {
            styles = await getCustomCSS();
        }
        return styles.getPropertyValue('--' + key);
    }

}
