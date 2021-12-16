class Playlist {
    list_of_tracks;
    testaa;

    constructor() {
        this.list_of_tracks = [];
        this.testaa = "bonjour";
    }

    addTrack(track) {
        this.list_of_tracks.push(track);
    }

    removeTrack(track_id) {
        
    }

    clearDisplayTracks() {
        let playlist = document.getElementById('playlist');
        playlist.removeChild(document.getElementById('scroll'));
    
        let scroll = document.createElement('div');
        scroll.classList = "scroll";
        scroll.id = "scroll";
        playlist.appendChild(scroll);
      }

    load() {
        let party = window.location.href.split('/').pop();
        let url =  'http://0.0.0.0:8000/api/playlist/' + party;

        const results = fetch(url, {
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
                return data;
            })
            .catch(function (e) {
                console.log(e);
            }
        );

        results.then((server_playlist) => { 
            for (let i = 0; i < server_playlist.length; i++) {
                let t = server_playlist[i];
                let track = new Track(t.party_id, t.track_id, t.state_for_party, t.order, t.state_track, t.download_path);
                
                this.list_of_tracks.push(track)
                track.displayTrack(t.track_title, t.order);
            }
        });
    }

    update() {
        console.log("UPDATE")
        let party = window.location.href.split('/').pop();
        let url =  'http://0.0.0.0:8000/api/playlist/' + party;

        const results = fetch(url, {
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
                return data;
            })
            .catch(function (e) {
                console.log(e);
            }
        );

        results.then((server_playlist) => { 
            this.clearDisplayTracks();
            for (let i = 0; i < server_playlist.length; i++) {
                if (this.list_of_tracks[i].getState)
                // this.list_of_tracks[i].state_track == server_playlist[i].state_track;
                // console.log(this.list_of_tracks.state_track, server_playlist[i].state_track)
                this.list_of_tracks[i].setState(server_playlist[i]);
            }
        });
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