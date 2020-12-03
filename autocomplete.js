// reusable search/autocomplete
const createAutoComplete = ({root, renderOption, onOptionSelect, inputValue, fetchData}) => {
    root.innerHTML = buildAutoCompleteTemplate();
    const search = root.querySelector('input')
    const dropdown = root.querySelector('.dropdown')

    const onInput = async () => {
        // first destroy old results
        removeAllChildNodes(root.querySelector('.search-results'));
        try { 
            const items = await fetchData(search.value);
            // request fine, but api resp has Error prop
            if (!items.length) {
                dropdown.classList.remove('is-active');
                return;
            }
            // results found, loop through'm
            dropdown.classList.add('is-active');
            for (let i of items) {
                const option = document.createElement('a');
                option.classList.add('dropdown-item');
                option.innerHTML = renderOption(i);

                option.addEventListener('click', () => {
                    dropdown.classList.remove('is-active');
                    search.value = inputValue(i);
                    onOptionSelect(i);
                })
                root.querySelector('.search-results').appendChild(option);

            }
        } catch (error) {
            console.log('Request error:  ', error)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error,
            })
        }

    }
    search.addEventListener('input', debounce(onInput, 500))

    document.addEventListener('click', event => {
        if (!root.contains(event.target)) {
            dropdown.classList.remove('is-active');
        }
    })

}


function buildAutoCompleteTemplate() {
    return `
    <label><b>Search For Movie</b></label>
    <input type="text" class="input" placeholder="Search by title">
    <div class="dropdown">
        <div class="dropdown-menu">
        <div class="dropdown-content search-results">
        </div>
        </div>
    </div>`
}
function removeAllChildNodes(parentNode) {
    while (parentNode.firstChild) {
        parentNode.removeChild(parentNode.firstChild);
    }
}

