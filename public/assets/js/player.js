// Possible improvements:
// - Change timeline and volume slider into input sliders, reskinned
// - Change into Vue or React component
// - Be able to grab a custom title instead of "Music Song"
// - Hover over sliders to see preview of timestamp/volume change

const audioPlayer = document.querySelector(".audio-player");
//constante du player de musique
let cpt = 0;
// initilization d'un compteur
let currentMusic = 0;
// initilization du numro de la musique actuel
let futureMusic = currentMusic + 1;
// initilization du numro de la musique a venir
let musicList1 = [
  {path: "https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/BackgroundMusica2.ogg"},
  {path: "https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/Hangout.ogg"},
  {path: "https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/BackgroundMusica2.ogg"},
  {path: "https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/Hangout.ogg"},
];
// tableau temporaire servant de remplacant a la réponse du serveur sur la liste de musique
let musicList = ["https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/Hangout.og"];
//tableau de musique
let audio = new Audio();
//object audio
audio.autoplay = true;
// je donne la valeur true a autoplay pour que les musique ce joue en automatique apres la premiere
window.addEventListener("load",() => {
  console.log("load");
  for (let i = 0; i < 4; i++) {
    callMusic(musicList1[currentMusic].path);
  }
  window.setTimeout(setAudio(musicList[0]),1000);
  console.log("c'est passé");
})
// fonction qui capte le chargement de la page pour load les premier musique
audio.addEventListener(
  "loadeddata",
  () => {
    console.log("loadeddata");
    audioPlayer.querySelector(".time .length").textContent = getTimeCodeFromNum(
      audio.duration
    );
    audio.volume = .75;
  },
  false
);
//function qui capte le chargement des donné sur l'élement audio et indique le temps et donne un volume de base

//click on timeline to skip around
const timeline = audioPlayer.querySelector(".timeline");
timeline.addEventListener("click", e => {
  const timelineWidth = window.getComputedStyle(timeline).width;
  const timeToSeek = e.offsetX / parseInt(timelineWidth) * audio.duration;
  audio.currentTime = timeToSeek;
}, false);

//click volume slider to change volume
const volumeSlider = audioPlayer.querySelector(".controls .volume-slider");
volumeSlider.addEventListener('click', e => {
  const sliderWidth = window.getComputedStyle(volumeSlider).width;
  const newVolume = e.offsetX / parseInt(sliderWidth);
  audio.volume = newVolume;
  audioPlayer.querySelector(".controls .volume-percentage").style.width = newVolume * 100 + '%';
}, false)

//check audio percentage and update time accordingly
setInterval(() => {
  const progressBar = audioPlayer.querySelector(".progress");
  progressBar.style.width = audio.currentTime / audio.duration * 100 + "%";
  audioPlayer.querySelector(".time .current").textContent = getTimeCodeFromNum(
    audio.currentTime
  );
}, 500);

//toggle between playing and pausing on button click
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

audioPlayer.querySelector(".volume-button").addEventListener("click", () => {
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

//turn 128 seconds into 2:08
function getTimeCodeFromNum(num) {
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
audio.addEventListener("ended",() => {
  console.log("ended");
  let endVerification = currentMusic + 2
  setAudio(musicList[futureMusic]);
  currentMusic = futureMusic;
  futureMusic++;
  if (musicList.length === endVerification) {
    currentMusic = 0;
    futureMusic = 0;
  }
})
//function qui capte la fin d'une musique grace a l'event ended et lance la prochaine musique;
function callMusic(url){
  console.log("callMusic");
  fetch(url).then(function(response) {
  if(response.ok) {
    response.blob().then(function(blob) {
      musicList[cpt] = URL.createObjectURL(blob);
      cpt++;
    });
  } else {
    console.log('Network request for "' + product.name + '" image failed with response ' + response.status + ': ' + response.statusText);
  }
});
}
//fonction qui demande au serveur les musique
function setAudio(source){
  console.log("setAudio");
  audio.src = source;
}
//function qui change la musique (sert a économisé quelque ligne)
