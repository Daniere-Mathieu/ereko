class Playlist {
    list_of_tracks = [];

    constructor() {

    }

    addTrack(track) {
        this.list_of_tracks.push(track);
    }

    removeTrack(track_id) {
        
    }

    async getPlaylistFromServer() {
        let party = window.location.href.split('/').pop();
        let url =  'http://0.0.0.0:8000/api/playlist/' + party;

        await fetch(url, {
                headers: {'Content-Type': 'application/json'},
                method: 'GET',
            })
            .then(function (response) {
                if (response.status == 200) {
                    return response.json();
                } else {
                    throw new TypeError('Request failed ! Status code : ' + response.status);
                }
            })
            .then(function (data) {
                console.log(data);
                return 
            })
            .catch(function (e) {
                console.log(e);
            }
        );
    }

    update() {
        // Fetch sur api
        this.getPlaylistFromServer()
        // Changer états track
    }

    displayTracks() {
        this.list_of_tracks.forEach(track => {
            track.displayTrack(track.track_title, track.order);
        });
    }

    debugPlaylist() {
        console.log("DEBUG PLAYLIST");
        console.log(this.list_of_tracks);
    }
}