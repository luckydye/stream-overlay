import { Spotify } from "../src/Spotify.js";
import { OverlayElement } from "../src/OverlayElement.js";

export class SpotifyOverlay extends OverlayElement {

    static template(props) {
        const playing = props.is_playing;
        const song = props.item;

        if(song) {
            const coverUrl = song.album.images[1].url;
            const artists = song.artists.map(artist => {
                return artist.name;
            }).join(', ');
    
            return `
                <div class="cover">
                    <div class="playing-icon" playing="${playing}">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <img src="${coverUrl}" />
                </div>
                <div class="details">
                    <div class="title">${song.name}</div>
                    <div class="artists">${artists}</div>
                </div>
            `;
        }
    }

    connectedCallback() {
        this.updateSpotify();
        setInterval(() => this.updateSpotify(), 1000 * 8);
    }
    
    async updateSpotify() {
        if(!Spotify.authorized && !Spotify.authorizing) {
            await Spotify.authorize();
        }
        if(!Spotify.authorizing) {
            const songData = await Spotify.getPlayingSong();
            if(songData) {
                this.setState(songData);
            }
        }
    }

}

customElements.define('overlay-spotify', SpotifyOverlay);