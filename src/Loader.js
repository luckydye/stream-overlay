let loaded = false;

export class Loader {

    static loadStyles(path, root) {
        root = root || document.head;

        const style = document.createElement('link');
        style.rel = "stylesheet";
        style.href = path + ".css";
        root.appendChild(style);
    }

    static loadComponents(promiseArray) {
        document.body.setAttribute('loading', '');
        return Promise.all(promiseArray).then(() => {
            console.log("components loaded");
            document.body.removeAttribute('loading');
            window.dispatchEvent(new Event('loader.loaded'));
        })
    }

    static async load() {
        if(loaded) return;

        return new Promise((resolve) => {
            window.addEventListener('loader.loaded', () => {
                loaded = true;
                resolve();
            });
        })
    }

}
