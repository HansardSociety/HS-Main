
const historyNav = (() => {
  let title = document.querySelector(".banner__title").innerText;
  let url = window.location.pathname;

  let state = Object.assign(
    {},
    history.state,
    {
      title,
      url
    }
  );

  history.pushState(state, title, url);

  console.log(history.state)
})();

export { historyNav }
