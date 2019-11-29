
const historyNav = (() => {
  let titleKey = "PAGE-TITLE";
  let pathKey = "PAGE-PATH";

  let title = document.querySelector(".banner__title").innerText;
  let path = window.location.pathname;
  let hasPageStorage = sessionStorage.getItem(`1-${ titleKey }`);


  if (!hasPageStorage) {
    sessionStorage.setItem(`1-${ titleKey }`, title);
    sessionStorage.setItem(`1-${ pathKey }`, path);

  } else {
    const pageNo = (sessionStorage.length / 2) + 1;
    let storedPagePaths = [];

    Object.keys(sessionStorage).map(key => {
      if (key.indexOf(pathKey) > -1) {
        storedPagePaths.push(sessionStorage[key]);
      }
    });

    if (!storedPagePaths.includes(path)) {
      sessionStorage.setItem(`${ pageNo }-${ titleKey }`, title);
      sessionStorage.setItem(`${ pageNo }-${ pathKey }`, path);
    }
  }

  console.log(sessionStorage)
})();

export { historyNav }
