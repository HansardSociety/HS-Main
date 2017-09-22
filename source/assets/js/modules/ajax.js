const getForms = (() => {

  document.querySelector("body").addEventListener("click", function() {

    fetch('/ajax')
      .then(function(response) {
        return response.text();

      }).then(function(data) {

        function html2dom(html, getElem) {
          const container = document.createElement('div');
          container.innerHTML = html;

          console.log(container.querySelector(getElem));
        }

        html2dom(data, '#AJAX-form-newsletter');
      })
  })

})();

export { getForms }
