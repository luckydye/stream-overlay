export default class Service {

    static async apiFetch(url, options = {}) {
        return fetch(url, options).then(res => res.json()).then(json => {
            return json;
        }).catch(err => {
            throw new Error(`Failed fetching emotes for service ${this.name}.`);
        });
    }

    static async getEmotesGlobal() {
        
    }

    static async getEmotesByChannel(channel) {
        
    }

}
