function callMusic(url,array){
  console.log("callMusic1");
  return fetch(url).then(response=> {
  if(response.ok) {
    console.log("callMusic2");
    response.blob().then(blob => {
      console.log("callMusic3");
      musicList[counter] = {path:URL.createObjectURL(blob),number: array.order};
      console.log("callMusic4");
      if (counter < 3) {
        counter++;
      }
    });
  } else {
    console.log('Network request for musicCall' + response.status + ': ' + response.statusText);
  }
});
};
//fonction qui demande au serveur les musiques
