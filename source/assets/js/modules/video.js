import Plyr from "plyr";

const video = (() => {
  Array.from(document.querySelectorAll(".video")).map((p) => {
    const player = new Plyr(p);

    // if (p.dataset) {
    //   const startTime = Number(p.dataset.start);
    //   const endTime = Number(p.dataset.start);

    //   player.on("ready", (e) => {

    //   })
    // }
  })
})()

export { video }
