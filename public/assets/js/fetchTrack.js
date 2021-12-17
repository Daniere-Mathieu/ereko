async function callTrackList(uid){
  let url = "http://localhost:8000/api/playlist/"+uid;
  return fetch(url).then((response)=>{
    if(response.ok){
      return response.json().then(json => {
        jsonTransfer(json);
       });
    }
    else{
      console.log("il y a eu une erreur")
    }
  })
}
function jsonTransfer(json){
  return new Promise(resolve =>{
    for(let i = 0; i < json.length ;i++){
    allTrackList[i] = json[i];
    console.log("callTrackList")
  }
  resolve("resolve")
  })
}
function callTrack(id){
  let url = "http://localhost:8000/info/"+ id;

}
