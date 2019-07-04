(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    function addImage() {
    	let htmlImageContent = '';
    	const data = JSON.parse(this.responseText),
    	firstImage = data.results[0];
    	
    	if(data && data.results && data.results[0]) {
	    	htmlImageContent = `<figure>
	    		<img src="${firstImage.urls.regular}" alt="${searchedForText}" />
	    		<figCaption>${searchedForText} by ${firstImage.user.name}</figCaption>
			</figure>`;
		}else {
			htmlImageContent = `<section class="error-no-image">No images available</section>`;
		}
		responseContainer.insertAdjacentHTML('afterbegin', htmlImageContent);
    };

    function getArticles() {
    	let htmlArticleContent = '';
    	const data = JSON.parse(this.responseText),
    	firstArticle = data.response.docs[0];

    	if(data.response && data.response.docs && data.response.docs.length > 1) {
    		htmlArticleContent = '<ul>' + data.response.docs.map(article => `<li class="article">
    				<h2><a href="${article.web_url}">${article.headline.main}</a></h2>
    				<p>${article.snippet}</p>
    			</li>`).join('') + '</ul>';
    	}else {
    		htmlArticleContent = `<section class="error-no-articles">No articles available</section>`;
    	}

    	responseContainer.insertAdjacentHTML('beforeend', htmlArticleContent);
    }

    function handleImageError() {
    	console.log('Oops an error occured');
    };

    function handleArticleError() {
    	console.log('Oops an error occured');
    };

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        const unsplashRequest = new XMLHttpRequest();
        unsplashRequest.onload = addImage;
        unsplashRequest.onerror = handleImageError;

        unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        unsplashRequest.setRequestHeader('Authorization', 'Client-ID d835059f25247bf26b39614a0807e93f7bd8314a0276a0ad043b12eaeadcf51c');
        unsplashRequest.send();

        const articleRequest = new XMLHttpRequest();
        articleRequest.onload = getArticles;
        articleRequest.onerror = handleArticleError;

        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=PGG8J16DCCd7gmy6t286qkdHd3jpOPTX`);
        articleRequest.send();
    });

})();
