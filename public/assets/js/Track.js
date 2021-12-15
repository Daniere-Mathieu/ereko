class Track {
  party_id;
  track_id;
  state_for_party;
  order;
  state_track;
  download_path;
  
  constructor(party_id, track_id, state_for_party, order, state_track, download_path) {
    this.party_id = party_id;
    this.track_id = track_id;
    this.state_for_party = state_for_party;
    this.order = order;
    this.state_track = state_track;
    this.download_path = download_path;
  }

  displayTrack(titleParam, number){
    let scrollParent = document.getElementById('scroll');
    let track = document.createElement("div");
    let title = document.createElement("p");
    scrollParent.appendChild(track);
    track.setAttribute("class","track");
    track.appendChild(title);
    title.setAttribute("class","title_track")
    title.setAttribute("id",number)

    title.innerText = titleParam + " | " + this.state_track;
    
    console.log(this.state_track);
    if (this.state_track === 'DOWNLOADING') {
      track.appendChild(this.displayDownloadSVG());
    } else if (this.state_track === 'ON_ERROR') {
      track.appendChild(this.displayErrorSVG());
    }
  }

  setState(state) {
    console.log("state = " + state);
    this.state = state;
  }

  displayDownloadSVG() {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('viewBox', '0 0 24 24')
    svg.classList = 'track_state_svg rotate';

    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute('d', 'M0 0h24v24H0z');
    path.setAttribute('stroke', 'none');
    path.setAttribute('fill', 'none');
    
    let path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute('d', 'M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4');
    
    let path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path2.setAttribute('d', 'M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4');

    svg.appendChild(path);
    svg.appendChild(path1);
    svg.appendChild(path2);

    let div = document.createElement('div');
    div.classList = 'container_logo';
    div.appendChild(svg);
    
    return div;
  }

  displayErrorSVG() {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('viewBox', '0 0 24 24')
    svg.classList = 'track_state_svg';

    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute('stroke', 'none');
    path.setAttribute('d', 'M0 0h24v24H0z');
    path.setAttribute('fill', 'none');

    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute('cx', '12');
    circle.setAttribute('cy', '12');
    circle.setAttribute('r', '9');
    
    let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute('x1', '9');
    line.setAttribute('y1', '15');
    line.setAttribute('x2', '15');
    line.setAttribute('y2', '9');

    svg.appendChild(path);
    svg.appendChild(circle);
    svg.appendChild(line);

    let div = document.createElement('div');
    div.classList = 'container_logo';
    div.appendChild(svg);
    
    return div;
  }
}


//   <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
//   <circle cx="12" cy="12" r="9" />
//   <line x1="9" y1="15" x2="15" y2="9" />
// </svg> */}