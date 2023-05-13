export class Utils {
  static decodeUrl() {
    let url = location.href;
    let arrayDecodeUrl = url.split("/");
    return arrayDecodeUrl[4];
  }

  static getPartyUid() {
    return window.location.href.split("/").pop();
  }
}
