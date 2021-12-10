function callMusic(url){
  console.log("callMusic");
  fetch(url).then(function(response) {
  if(response.ok) {
    response.blob().then(function(blob) {
      console.log(counter+"/ctp");
      musicList[counter] = URL.createObjectURL(blob);
      counter++;
    });
  } else {
    console.log('Network request for musicCall' + response.status + ': ' + response.statusText);
  }
});
}
//fonction qui demande au serveur les musique
