import { Utils } from "./utils.js";

export class YoutubeSearch {
  search_input = document.getElementById("search_input");
  result_list = document.getElementById("result_list");
  request_error = document.getElementById("request_error");
  list_exist = false;
  API_KEY = "AIzaSyChQda9SVL9Lql8-KBX-6XsNJzB4hrSbkM";

  constructor() {
    this.init();
  }

  init() {
    this.searchInputEvent();
  }

  searchInputEvent() {
    this.search_input.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        if (this.search_input.value.length > 0) {
          if (this.list_exist) {
            this.removeResultDiv();
          }
          this.requestToYoutube(search_input.value);
          this.list_exist = true;
        }
      }
    });
  }

  removeResultDiv() {
    let result_div = document.getElementsByClassName("result");
    for (let i = result_div.length - 1; i >= 0; i--) {
      result_list.removeChild(result_div[i]);
    }
    list_exist = false;
  }

  async requestToYoutube(research) {
    let url = new URL("https://www.googleapis.com/youtube/v3/search?");
    let params = {
      part: "snippet",
      q: research,
      maxResults: 5,
      type: "video",
      videoDuration: "medium", // Entre 4 et 20 mn
      key: this.API_KEY,
    };

    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );

    await fetch(url, { headers: { Accept: "application/json" } })
      .then(function (response) {
        if (response.status == 200) {
          return response.json();
        } else {
          throw new TypeError(
            "Youtube request failed ! Status code : " + response.status
          );
        }
      })
      .then(function (data) {
        for (const item of data.items) {
          this.createResultDiv(item);
        }
      })
      .catch(function (e) {
        console.log(e);
        this.createErrorDiv("Something went wrong - RESEARCH");
      });
  }

  createResultDiv(item) {
    let img = document.createElement("img");
    img.src = item.snippet.thumbnails.medium.url;
    img.alt = "Thumbnail of Youtube video";

    let result_img = document.createElement("div").appendChild(img);
    result_img.className = "result_img";

    let result_title = document.createElement("p");
    result_title.className = "result_title";
    result_title.innerHTML = this.titleInBold(item.snippet.title);

    let result_info = document.createElement("div").appendChild(result_title);
    result_info.className = "result_info";

    let result = document.createElement("div");
    result.addEventListener(
      "click",
      function () {
        this.addTrackApi(item.snippet.title, item.id.videoId);
      },
      false
    );
    result.className = "result";
    result.id = item.id.videoId;

    result.appendChild(result_img);
    result.appendChild(result_info);

    result_list.appendChild(result);
  }

  titleInBold(title) {
    let found = title.match("[-]");
    if (found) {
      let splitTitle = title.split(" -");
      return "<b>" + splitTitle.shift() + "</b> -" + splitTitle.join(" -");
    }
    return title;
  }

  async addTrackApi(track_title, track_id) {
    let party = Utils.getPartyUid();
    let url = window.location.origin + "/api/add/" + party + "/" + track_id;

    await fetch(url, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ title: track_title }),
    })
      .then(function (response) {
        if (response.status == 200) {
          this.removeResultDiv();
          this.clearInputSearch();
          return response.json();
        } else {
          throw new TypeError(
            "Request failed ! Status code : " + response.status
          );
        }
      })
      .then(function (data) {
        let track = new Track(
          data.party_id,
          data.track_id,
          data.state_for_party,
          data.order,
          data.state_track,
          data.download_path,
          data.track_title
        );
        allTrackList.push(track);
        myPlaylist.addTrack(track);
        track.displayTrack();
      })
      .catch(function (e) {
        console.log(e);
        this.createErrorDiv("Something went wrong - ADD TRACK");
      });
  }

  clearInputSearch() {
    search_input.value = "";
    search_input.focus();
  }

  createErrorDiv(error) {
    let error_div = document.getElementById("error");
    if (error_div) {
      request_error.removeChild(error_div);
    }

    let error_p = document.createElement("p");
    error_p.id = "error";
    error_p.innerText = error;

    request_error.appendChild(error_p);
  }
}
