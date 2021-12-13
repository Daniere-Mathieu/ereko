let counter = 0;
// initilization d'un compteur
let currentMusic = 0;
// initilization du numéro de la musique actuel
let futureMusic = currentMusic + 1;
// initilization du numéro de la musique a venir
let lastLoadMusic = currentMusic + 4;
// initilization du numéro de la prochaine musique a charger avec fetch
let autoplay = 0;
// initilization d'une variable qui permet d'activer l'autoplay a la premier écoute
let allTrackList = [];
// tableau temporaire servant de remplacant a la réponse du serveur sur la liste de musique
let musicList = [];
//j'initilize le tableau de musique
let audio = new Audio();
//object audio
audio.volume = .75;
// je donne la valeur au volume du son
let track = new Track();
//
function setAudio(source){
      audio.src = source;
}
//function qui change la musique (sert a économisé quelque ligne)
audio.addEventListener("ended",() => {
  let endVerification = currentMusic + 1;
  if (allTrackList.length <= endVerification) {
    console.log("endend")
    setAudio(musicList[0].path);
    spliceList(musicList,4);
    nextLoadMusic();
    currentMusic = 0;
    futureMusic = 1;
  }else {
    setAudio(musicList[0].path);
    currentMusic++;
    futureMusic++;
    spliceList(musicList,4);
    nextLoadMusic();
  }
})
//function qui capte la fin d'une musique grace a l'event ended et lance la prochaine musique;
window.addEventListener("load",async() => {
  await callTrackList("jyizlslbcw");
  await callMusic(allTrackList[currentMusic].download_path,allTrackList[currentMusic]);
  window.setTimeout(()=>{
    setAudio(musicList[0].path);
    spliceList(musicList,1);
    counter = 0;
    loadCallMusic();
    for (let i = 0; i < allTrackList.length; i++) {
      track.displayTrack(allTrackList[i].track_title,allTrackList[i].order)
    }
  },10000)
})
// fonction qui capte le chargement de la page pour load les premier musique
function loadCallMusic(){
  return new Promise(resolve=>{
    for (let i = futureMusic; i < lastLoadMusic+1 ; i++) {
      callMusic(allTrackList[i].download_path,allTrackList[i]);
    }
    resolve("blc");
  })
}
async function nextLoadMusic(){
  if (lastLoadMusic >= allTrackList.length) {
    lastLoadMusic -= allTrackList.length;
    await callMusic(allTrackList[lastLoadMusic].download_path,allTrackList[lastLoadMusic]);
    lastLoadMusic++;
  }
  else {
    await callMusic(allTrackList[lastLoadMusic].download_path,allTrackList[lastLoadMusic]);
    lastLoadMusic++;
  }
}
// fonction qui a pour but de d'apeller la prochaine musique loadable
function spliceList(array,size){
  console.log("splice")
    if (array.length >= size) {
      array.splice(0,1);
    }
}
function setPlaying(){
  let trackTitle = document.getElementById(allTrackList[currentMusic].order);
  let idCurrantMusic = trackTitle.getAttribute("id");
  if(allTrackList[currentMusic].order == idCurrantMusic){
    songName.innerText = allTrackList[currentMusic].track_title;
    trackTitle.setAttribute("class","playing");
  }
}
