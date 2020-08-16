import Service from './Service.mjs';

export default class FFZ extends Service {

    static channelEmoteApiUrl = "https://api.frankerfacez.com/v1/room";
    static globalEmoteApiUrl = "https://api.frankerfacez.com/v1/set/global";

    static async getEmotesByChannel(channel) {
        const url = `${this.channelEmoteApiUrl}/${channel.login}`;

        const json = await this.apiFetch(url);
        const emoteSet = json.sets[Object.keys(json.sets)[0]];

        return this.parseEmoteSet(emoteSet);
    }

    static async getEmotesGlobal() {
        const url = this.globalEmoteApiUrl;

        const json = await this.apiFetch(url);

        for(let set of json.default_sets) {
            return this.parseEmoteSet(json.sets[set]);
        }
    }

    static parseEmoteSet(set) {
        const emoteSet = {};
        for(let emote of set.emoticons) {
            emoteSet[emote.name] = emote.urls[1];
        }
        return emoteSet;
    }
}
