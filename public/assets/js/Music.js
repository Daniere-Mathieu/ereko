export class Music {
  musicList = [];
  url = "";

  constructor() {
    this.url = window.location.origin + "/api/playlist";
  }
  async callMusic(url) {
    return await fetch(url);
  }
  async getMusic(url) {
    const response = await this.callMusic(url);
    if (response.ok) {
      const blob = await response.blob();
      this.musicList.push({
        path: URL.createObjectURL(blob),
      });
    } else {
      console.log("il y a eu une erreur");
    }
  }
}
