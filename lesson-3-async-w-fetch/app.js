(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
            headers: {
                Authorization: 'Client-ID d52c4db4f8fc8d2374eefa0105ae87ff3d6dbff26cf4c59d3309e1b9749e4938'
            }
        })
        .then(response => response.json())
        .then(addImage)
        .catch(e => requestError(e, 'image'));

        fetch(`http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=8976effe535b440e9f1e38486ba3fa29`)
        .then(response => response.json())
        .then(addArticles)
        .catch(e => requestError(e, 'articles'));
    });

    function addImage(data){
      let htmlContent = "";
      const firstImage = data.results[0];

      if(firstImage) {
        htmlContent = `<figure>
                <img src="${firstImage.urls.small}" alt="${searchedForText}">
                <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
            </figure>`;
      } else {
        htmlContent = 'Unfortunately, no image was returned for your search.'
      }

      responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }

    function addArticles(articles) {
      let htmlContent = "";

      if (articles.response && articles.response.docs && articles.response.docs.length > 1) {
          htmlContent = '<ul>' + articles.response.docs.map(article =>
              `<li class="article">
                <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                <p>${article.snippet}</p>
              <li>`)
              .join('') + '</ul>';
      } else {
          htmlContent = '<div class="error-no-articles">No articles available</div>';
      }

      responseContainer.insertAdjacentHTML('beforeend', htmlContent);
    }

    function requestError(e, part) {
      console.log(e);
      responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
    }
})();
