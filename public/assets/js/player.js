export class Player {
  audioPlayer = document.querySelector(".audio-player");
  songName = document.getElementById("songName");

  constructor() {
    this.init();
  }

  init() {
    this.AudioLoadedDataEvent();

    this.setTimeBarInterval();

    this.setVolumeEvent();

    this.setTimeBarInterval();

    this.setPlayingEvent();

    this.setMuteEvent();
  }

  setMuteEvent() {
    this.audioPlayer
      .querySelector(".volume-button")
      .addEventListener("click", () => {
        const volumeEl = audioPlayer.querySelector(".volume-container .volume");
        audio.muted = !audio.muted;
        if (audio.muted) {
          volumeEl.classList.remove("icono-volumeMedium");
          volumeEl.classList.add("icono-volumeMute");
        } else {
          volumeEl.classList.add("icono-volumeMedium");
          volumeEl.classList.remove("icono-volumeMute");
        }
      });
  }

  setPlayingEvent() {
    const playBtn = audioPlayer.querySelector(".controls .toggle-play");
    playBtn.addEventListener(
      "click",
      () => {
        if (audio.paused) {
          playBtn.classList.remove("play");
          playBtn.classList.add("pause");
          audio.play();
        } else {
          playBtn.classList.remove("pause");
          playBtn.classList.add("play");
          audio.pause();
        }
      },
      false
    );
  }

  setTimeBarInterval() {
    setInterval(() => {
      const progressBar = audioPlayer.querySelector(".progress");
      progressBar.style.width =
        (audio.currentTime / audio.duration) * 100 + "%";
      audioPlayer.querySelector(".time .current").textContent =
        getTimeCodeFromNum(audio.currentTime);
    }, 500);
  }

  setTimeEvent() {
    const timeline = audioPlayer.querySelector(".timeline");
    timeline.addEventListener(
      "click",
      (e) => {
        const timelineWidth = window.getComputedStyle(timeline).width;
        const timeToSeek =
          (e.offsetX / parseInt(timelineWidth)) * audio.duration;
        audio.currentTime = timeToSeek;
      },
      false
    );
  }

  setVolumeEvent() {
    const volumeSlider = audioPlayer.querySelector(".controls .volume-slider");
    volumeSlider.addEventListener(
      "click",
      (e) => {
        const sliderWidth = window.getComputedStyle(volumeSlider).width;
        const newVolume = e.offsetX / parseInt(sliderWidth);
        audio.volume = newVolume;
        audioPlayer.querySelector(".controls .volume-percentage").style.width =
          newVolume * 100 + "%";
      },
      false
    );
  }
  AudioLoadedDataEvent() {
    audio.addEventListener(
      "loadeddata",
      async () => {
        if (autoplay === 0) {
          audio.autoplay = true;
          // je donne la valeur true a autoplay pour que les musique se jouent en automatique apres la premiere
        }
        audioPlayer.querySelector(".time .length").textContent =
          getTimeCodeFromNum(audio.duration);
        setPlaying("track playing");
        setThumbnail(allTrackList);
      },
      false
    );
  }

  getTimeCodeFromNum(num) {
    let seconds = parseInt(num);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;
    const hours = parseInt(minutes / 60);
    minutes -= hours * 60;

    if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
    return `${String(hours).padStart(2, 0)}:${minutes}:${String(
      seconds % 60
    ).padStart(2, 0)}`;
  }
}
