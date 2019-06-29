import { OAuthClient } from "./OAuthClient.js";

export class Spotify extends OAuthClient {

    static get client_name() { return "spotify" }
    static get api_url() { return "https://api.spotify.com/v1"; }
    static get client_id() { return "cbc6f8fab7064000ba3fae1fd9e43996"; }

    static get auth_url() {
        return `https://accounts.spotify.com/authorize?client_id=${this.client_id}&response_type=token&redirect_uri=${this.redirect_uri}&scope=user-read-currently-playing`;
    }

    static async getPlayingSong() {
        return await this.query('/me/player/currently-playing', { market: "de" }).catch(err => null);
    }

}
