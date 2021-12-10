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
function setAudio(source){
  return new Promise(test => {
      audio.src = source;
  })
}
//function qui change la musique (sert a économisé quelque ligne)
audio.addEventListener("ended",() => {
  let endVerification = currentMusic + 1;
  if (allTrackList.length === endVerification) {
    setAudio(musicList[0]);
    spliceList(musicList,4);
    nextLoadMusic();
  }else {
    setAudio(musicList[0]);
    currentMusic = futureMusic;
    futureMusic++;
    spliceList(musicList,4);
    nextLoadMusic();
  }
})
//function qui capte la fin d'une musique grace a l'event ended et lance la prochaine musique;
window.addEventListener("load",async() => {
  await callTrackList("ntqfjswdnk");
    for (let i = currentMusic; i < lastLoadMusic; i++) {
      await callMusic(allTrackList[i].download_path);
    }
    setAudio(musicList[0]);
    spliceList(musicList,3);
})
// fonction qui capte le chargement de la page pour load les premier musique
async function nextLoadMusic(){
  if (lastLoadMusic >= allTrackList.length) {
    lastLoadMusic -= allTrackList.length;
    await callMusic(allTrackList[lastLoadMusic].download_path);
    lastLoadMusic++;
  }
  else {
    await callMusic(allTrackList[lastLoadMusic].download_path);
    lastLoadMusic++;
  }
}
// fonction qui a pour but de d'apeller la prochaine musique loadable
function spliceList(array,size){
  console.log("slice");
  console.log(array.length);
  if (array.length >= size) {
    console.log("slicer")
    array.splice(0,1);
  }
}
