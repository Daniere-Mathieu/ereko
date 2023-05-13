export class Svg {
  static displayDownloadSVG(id) {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.classList = "track_state_svg rotate";

    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M0 0h24v24H0z");
    path.setAttribute("stroke", "none");
    path.setAttribute("fill", "none");

    let path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("d", "M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4");

    let path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path2.setAttribute("d", "M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4");

    svg.appendChild(path);
    svg.appendChild(path1);
    svg.appendChild(path2);

    let div = document.createElement("div");
    div.classList = "container_logo";
    div.id = "container_logo_" + id;
    div.appendChild(svg);

    return div;
  }

  static displayErrorSVG(id) {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.classList = "track_state_svg";

    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("stroke", "none");
    path.setAttribute("d", "M0 0h24v24H0z");
    path.setAttribute("fill", "none");

    let circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circle.setAttribute("cx", "12");
    circle.setAttribute("cy", "12");
    circle.setAttribute("r", "9");

    let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", "9");
    line.setAttribute("y1", "15");
    line.setAttribute("x2", "15");
    line.setAttribute("y2", "9");

    svg.appendChild(path);
    svg.appendChild(circle);
    svg.appendChild(line);

    let div = document.createElement("div");
    div.classList = "container_logo";
    div.id = "container_logo_" + id;
    div.appendChild(svg);

    return div;
  }
}
