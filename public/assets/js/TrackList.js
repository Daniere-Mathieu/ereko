export class TrackList {
  url = "";
  list = [];
  constructor(uid) {
    this.url = window.location.origin + "/api/playlist/" + uid;
  }

  async callTrackList() {
    let url = this.url;
    const response = await fetch(url);
    if (response.ok) {
      const json = await response.json();
      await this.jsonTransfer(json);
    } else {
      console.log("il y a eu une erreur");
    }
  }

  async jsonTransfer(json) {
    for (let i = 0; i < json.length; i++) {
      console.log(json[i]);
      this.list[i] = json[i];
    }
  }

  callTrack(id) {
    return window.location.origin + "/info/" + id;
  }
}
