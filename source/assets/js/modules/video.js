import Plyr from "plyr";

const player = (() => {
  const videoElem = document.querySelectorAll(".plyr__video-embed");

  if (videoElem) {
    videoElem.forEach((vid) => new Plyr(vid))
  }
})()

export { player }
