import Service from "./Service.mjs";

export default class BTTV extends Service {

    static channelEmoteApiUrl = "https://api.betterttv.net/3/cached/users/twitch/";
    static globalEmoteApiUrl = "https://api.betterttv.net/3/cached/emotes/global";

    static getEmoteImageUrl(emoteid) {
        return `https://cdn.betterttv.net/emote/${emoteid}/3x`; 
    }

    static parseEmoteSet(set) {
        const emoteSet = {};
        for(let emote of set) {
            emoteSet[emote.code] = this.getEmoteImageUrl(emote.id);
        }
        return emoteSet;
    }

    static async getEmotesGlobal() {
        const json = await this.apiFetch(BTTV.globalEmoteApiUrl);
        return this.parseEmoteSet(json);
    }

    static async getEmotesByChannel(channel) {
        const json = await this.apiFetch(`${BTTV.channelEmoteApiUrl}/${channel.id}`);
        const emotes = [...json.channelEmotes, ...json.sharedEmotes];
        return this.parseEmoteSet(emotes);
    }
}
