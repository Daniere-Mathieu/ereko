class Track {
  party_id;
  track_id;
  state_for_party;
  order;
  state_track;
  download_path;
  constructor(party_id,track_id,state_for_party,order,state_track,download_path) {
    this.party_id = party_id;
    thistrack_id = track_id;
    this.state_for_party = state_for_party;
    this.order = order;
    this.state_track = state_track;
    this.download_path = download_path;
  }
  displayTrack(titleParam){
    let scrollParent = document.getElementById('scroll');
    let track = document.createElement("div");
    let author = document.createElement("b");
    let title = document.createElement("p");
    scrollParent.appendChild(track);
    track.setAttribute("class","track");
    track.appendChild(author);
    track.appendChild(title);
    author.innerText = "authorParam -";
    title.innerText = titleParam;
  }
}
