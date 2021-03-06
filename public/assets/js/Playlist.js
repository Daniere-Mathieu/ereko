class Playlist {
    list_of_tracks;
    party;

    constructor() {
        this.list_of_tracks = [];
        this.party = window.location.href.split('/').pop();
    }

    addTrack(track) {
        this.list_of_tracks.push(track);
        let last = allTrackList.length - 1 ;
        if (last  < 0) {
          last = 0;
        }
        let intervalID = setInterval(() => {
            callTrackList(this.party);
            if (track.isReady()) {
              if (last < 5) {
                  addTrackInfFive(last,last);
              }
              else {
                addTrackMultAdd(last,last);
              }
                clearInterval(intervalID);
            }
        }, 2500);
    }

    removeTrack(track_id) {

    }

    load() {
        let party = window.location.href.split('/').pop();
        let url =  window.location.origin + '/api/playlist/' + party;

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
            }
        );

        results.then((server_playlist) => {
            for (let i = 0; i < server_playlist.length; i++) {
                let t = server_playlist[i];
                let track = new Track(
                    t.party_id,
                    t.track_id,
                    t.state_for_party,
                    t.order,
                    t.state_track,
                    t.download_path,
                    t.track_title
                );
                this.list_of_tracks.push(track)
                track.displayTrack();
            }
        });
    }

    update() {
        let party = window.location.href.split('/').pop();
        let url =  window.location.origin + '/api/playlist/' + party;

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
                if (this.list_of_tracks[i].hasStateChanged(server_playlist[i].state_track)) {
                    this.list_of_tracks[i].setState(server_playlist[i].state_track);
                }
            }
        });

    }

    displayTracks() {
        this.list_of_tracks.forEach(track => {
            track.displayTrack();
        });
    }
}
