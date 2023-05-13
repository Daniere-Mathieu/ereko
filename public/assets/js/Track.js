import { Svg } from "./Svg.js";

export class Track {
  party_id;
  track_id;
  state_for_party;
  order;
  state_track;
  download_path;
  title;

  constructor(
    party_id,
    track_id,
    state_for_party,
    order,
    state_track,
    download_path,
    title
  ) {
    this.party_id = party_id;
    this.track_id = track_id;
    this.state_for_party = state_for_party;
    this.order = order;
    this.state_track = state_track;
    this.download_path = download_path;
    this.title = title;
  }

  displayTrack() {
    let scrollParent = document.getElementById("scroll");
    let track = document.createElement("div");
    let title = document.createElement("p");
    scrollParent.appendChild(track);
    track.setAttribute("class", "track");
    track.appendChild(title);
    title.setAttribute("class", "title_track");
    track.setAttribute("id", this.order);

    title.innerHTML = this.title;

    if (
      this.state_track === "DOWNLOADING" ||
      this.state_track === "TO_DOWNLOAD"
    ) {
      track.appendChild(Svg.displayDownloadSVG(this.order));
    } else if (this.state_track === "ON_ERROR") {
      track.appendChild(Svg.displayErrorSVG(this.order));
    }
  }

  getState() {
    return this.state_track;
  }

  setState(state) {
    this.state_track = state;
    if (this.state_track == "READY") {
      this.removeStateLogo(this.order);
    }
  }

  removeStateLogo(id) {
    let node = document.getElementById("container_logo_" + id);
    node.remove();
  }

  hasStateChanged(state) {
    if (this.state_track != state) {
      return true;
    }
    return false;
  }

  isReady() {
    if (this.state_track == "READY") {
      return true;
    }
    return false;
  }
}
