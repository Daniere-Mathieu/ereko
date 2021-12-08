function callMusic(url){
  console.log("callMusic");
  fetch(url).then(function(response) {
  if(response.ok) {
    response.blob().then(function(blob) {
      musicList[cpt] = URL.createObjectURL(blob);
      cpt++;
    });
  } else {
    console.log('Network request for "' + response.status + ': ' + response.statusText);
  }
});
}
//fonction qui demande au serveur les musique
