
const apiKey = 'c8b6c661' // would usually not store publicly like this. note: 1000 calls/day 
const search = document.querySelector('#search')
const searchResults = [];
const debounce = (func, delay=1000) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(null, args)
        }, delay)
    }
}

const onInput = () => {
    searchMovies().then(({data}) => {
        console.log('data  is ', data)
    });
}
search.addEventListener('input', debounce(onInput, 500))


async function doRequest(params) {
    let baseUrl = 'http://www.omdbapi.com/';
    params['apikey'] = apiKey;
    try {
        return response = await axios.get(baseUrl, {
            params: params
        });
    } catch (error) {
        return { data: error }
    }
}


function searchMovies() {
    return doRequest(params = { s: search.value });
}

function getSingleMovie(id) {
    return doRequest(params = { i: id }).then(({ data }) => {
        console.log(data);
    });
}
