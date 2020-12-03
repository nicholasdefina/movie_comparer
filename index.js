
const apiKey = 'c8b6c661' // would usually not store publicly like this, e.g. would put in settings/prod secret file. note: 1000 calls/day 


const autoCompleteConfigBase = {
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src="${imgSrc}"/>
            ${movie.Title} (${movie.Year})
            `;
    },
    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchValue) {
        const resp = await searchMovies(searchValue);
        return resp;
    }
}
createAutoComplete({
    ...autoCompleteConfigBase,
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        fetchSingleMovie(movie, document.querySelector('#left-summary'));
    },
    root: document.querySelector('#left-autocomplete'),
});
createAutoComplete({
    ...autoCompleteConfigBase,
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        fetchSingleMovie(movie, document.querySelector('#right-summary'));
    },
    root: document.querySelector('#right-autocomplete'),
});

async function doRequest(params) {
    let baseUrl = 'http://www.omdbapi.com/';
    params['apikey'] = apiKey;
    const response = await axios.get(baseUrl, {
        params: params
    });
    return response.data
}

async function searchMovies(searchValue) {
    const response = await doRequest(params = { s: searchValue });
    if (response.Error) {
        return [];
    }
    return response.Search;
}

let leftMovie;
let rightMovie;
async function fetchSingleMovie(movie, element) {
    const movieInfo = await doRequest(params = { i: movie.imdbID });
    element.innerHTML = movieTemplate(movieInfo);
    if (element.id === 'left-summary') {
        leftMovie = movieInfo;
    } else {
        rightMovie = movieInfo;
    }
    if (leftMovie && rightMovie) {
        runComparison();
    }
}

const runComparison = () => {
    const leftStats = document.querySelectorAll('#left-summary .notification');
    const rightStats = document.querySelectorAll('#right-summary .notification');
    console.log(leftStats, rightStats)
    leftStats.forEach((leftStat, idx) => {
        const rightStat = rightStats[idx];
        const leftValue = parseInt(leftStat.dataset.value);
        const rightValue = parseInt(rightStat.dataset.value);
        console.log(leftStat, leftValue, rightStat, rightValue);
        if (leftValue > rightValue) {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-danger');
        } else if (rightValue > leftValue) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-danger');
        } else {
            // tie game???
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        }

    })
}

const movieTemplate = (movieData) => {
    let dollars = parseInt(movieData.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    dollars = isNaN(dollars) ? 0 : dollars;
    let metascore = parseInt(movieData.Metascore);
    metascore = isNaN(metascore) ? 0 : metascore;
    let imdbRating = parseFloat(movieData.imdbRating);
    imdbRating = isNaN(imdbRating) ? 0: imdbRating;
    let imdbVotes = parseInt(movieData.imdbVotes.replace(/,/g, ''));
    imdbVotes = isNaN(imdbVotes) ? 0 : imdbVotes;

    const awards = movieData.Awards.split(' ').reduce((accumulator, curVal) => {
        if (!isNaN(parseInt(curVal))) {
            return accumulator + parseInt(curVal);
        }
        return accumulator;
    }, 0)

    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieData.Poster}"/>
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieData.Title}</h1>
                    <h4>${movieData.Genre}</h4>
                    <p>${movieData.Plot}</p>
                </div>
            </div>
        </article>
        <article class="notification is-primary" data-value="${awards}">
            <p class="title">${movieData.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article class="notification is-primary" data-value="${dollars}">
            <p class="title">${movieData.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article class="notification is-primary" data-value="${metascore}">
            <p class="title">${movieData.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article class="notification is-primary" data-value="${imdbRating}">
            <p class="title">${movieData.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article class="notification is-primary" data-value="${imdbVotes}">
            <p class="title">${movieData.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `
}
