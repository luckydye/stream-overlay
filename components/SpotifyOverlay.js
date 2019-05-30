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
        setInterval(() => this.updateSpotify(), 1000 * 5);
    }

    get prograss() {
        if(this.state.item && this.state.progress_ms) {
            return (this.state.item.duration_ms - this.state.progress_ms);
        }
        return 0;
    } 
    
    async updateSpotify() {
        if(!Spotify.authorized && !Spotify.authorizing) {
            await Spotify.authorize();
        }
        if(!Spotify.authorizing) {
            const songData = await Spotify.getPlayingSong();
            if(songData.timestamp != this.state.timestamp) {
                this.setState(songData);

                if(this.prograss) {
                    clearTimeout(this.nextSong);
                    this.nextSong = setTimeout(() => {
                        this.updateSpotify();
                        console.log('next song');
                    }, this.prograss + 100);
                }
            }
        }
    }

}

customElements.define('overlay-spotify', SpotifyOverlay);