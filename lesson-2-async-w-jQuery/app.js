/* eslint-env jquery */

(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    function addImage(images) {
    	let htmlImageContent = '';
    	const firstImage = images.results[0];
    	
    	if(images && images.results && images.results[0]) {
	    	htmlImageContent = `<figure>
	    		<img src="${firstImage.urls.regular}" alt="${searchedForText}" />
	    		<figCaption>${searchedForText} by ${firstImage.user.name}</figCaption>
			</figure>`;
		}else {
			htmlImageContent = `<section class="error-no-image">No images available</section>`;
		}
		responseContainer.insertAdjacentHTML('afterbegin', htmlImageContent);
    };

    function getArticles(articles) {
    	let htmlArticleContent = '';
    	const firstArticle = articles.response.docs[0];

    	if(articles.response && articles.response.docs && articles.response.docs.length > 1) {
    		htmlArticleContent = '<ul>' + articles.response.docs.map(article => `<li class="article">
    				<h2><a href="${article.web_url}">${article.headline.main}</a></h2>
    				<p>${article.snippet}</p>
    			</li>`).join('') + '</ul>';
    	}else {
    		htmlArticleContent = `<section class="error-no-image">No articles available</section>`;
    	}

    	responseContainer.insertAdjacentHTML('beforeend', htmlArticleContent);
    }

    function handlerError(e, type) {
    	responseContainer.insertAdjacentHTML('beforeend', `<p>No ${type} available. Network Error</p>`);
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        $.ajax({
    		url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
    		headers: {
    			Authorization: 'Client-ID d835059f25247bf26b39614a0807e93f7bd8314a0276a0ad043b12eaeadcf51c'
    		}
		}).done(addImage).fail(function(err) {
			handleError(err, 'Images');
		});

        $.ajax({
        	url: `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=PGG8J16DCCd7gmy6t286qkdHd3jpOPTX`
        }).done(getArticles).fail(function(err) {
        	handleError(err, 'Articles');
        });

    });
})();
