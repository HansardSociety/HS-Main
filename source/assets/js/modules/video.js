import Plyr from "plyr";

const video = (() => {
  const videoElem = document.querySelectorAll(".plyr__video-embed");

  if (videoElem) {
    videoElem.forEach((vid) => {
      const player = new Plyr(vid);
    })
  }
})()

export { video }
