let cpt = 0;
// initilization d'un compteur
let currentMusic = 0;
// initilization du numéro de la musique actuel
let futureMusic = currentMusic + 1;
// initilization du numéro de la musique a venir
let lastLoadMusic = currentMusic + 4;
// initilization du numéro de la prochaine musique a charger avec fetch
let musicList1 = [
  {path: "https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/BackgroundMusica2.ogg",number:0,},
  {path: "https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/Hangout.ogg",number:1,},
  {path: "https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/BackgroundMusica2.ogg",number:2,},
  {path: "https://ia800905.us.archive.org/19/items/FREE_background_music_dhalius/Hangout.ogg",number:3,},
];
// tableau temporaire servant de remplacant a la réponse du serveur sur la liste de musique
let musicList = [];
//tableau de musique
let audio = new Audio();
//object audio
audio.autoplay = true;
// je donne la valeur true a autoplay pour que les musique se jouent en automatique apres la premiere
audio.volume = .75;
// je donne la valeur au volume du son
function setAudio(source){
  console.log("setAudio");
  audio.src = source;
}
//function qui change la musique (sert a économisé quelque ligne)
audio.addEventListener("ended",() => {
  console.log("ended");
  let endVerification = currentMusic + 1;
  if (musicList.length === endVerification) {
    currentMusic = 0;
    futureMusic = 1;
    setAudio(musicList[currentMusic]);
  }else {
    setAudio(musicList[futureMusic]);
    currentMusic = futureMusic;
    futureMusic++;
  }
})
//function qui capte la fin d'une musique grace a l'event ended et lance la prochaine musique;
window.addEventListener("load",() => {
  console.log("load");
  for (let i = currentMusic; i < lastLoadMusic; i++) {
    callMusic(musicList1[i].path);
  }
    let timeoutID = setTimeout(()=>{
    setAudio(musicList[currentMusic])
  },9000);
  console.log("c'est passé");
})
// fonction qui capte le chargement de la page pour load les premier musique
