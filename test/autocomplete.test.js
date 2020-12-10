beforeEach(() => {
    document.querySelector('#target').innerHTML = '';
    createAutoComplete({
        root: document.querySelector('#target'),
        fetchData() {
            return [
                {Title: 'Goodfellas'},
                {Title: 'Princess Bride'},
                {Title: 'Team America'}
            ];
        },
        renderOption(movie) {
            console.log(movie)
            return `${movie.Title}<br>`; // not worried about styling here
        }
    });
})

const waitFor = (selector) => {
    return new Promise((resolve, reject) => {
        const inverval = setInterval(() => {
            if (document.querySelector(selector)) {
                clearInterval(inverval);
                clearTimeout(timeout);
                resolve();
            }
        }, 30);
        const timeout = setTimeout(() => {
            clearInterval(inverval);
            reject();
        }, 5000);
    })
}

it('Dropdown initializes closed', () => {
    const dropDown = document.querySelector('.dropdown');
    expect(dropDown.className).not.to.include('is-active');
});


it('Dropdown opens on search', async () => {
    const dropDown = document.querySelector('.dropdown');
    expect(dropDown.className).not.to.include('is-active');
    const input = document.querySelector('input');
    input.value = 'Goodfellas'
    input.dispatchEvent(new Event('input'))
    await waitFor('.dropdown-item')
    expect(dropDown.className).to.include('is-active');
});

it('Dropdown returns items on search', async () => {
    const dropDown = document.querySelector('.dropdown');
    expect(dropDown.className).not.to.include('is-active');
    const input = document.querySelector('input');
    input.value = 'Goodfellas'
    input.dispatchEvent(new Event('input'))
    await waitFor('.dropdown-item')
    expect(dropDown.className).to.include('is-active');

    const items = document.querySelectorAll('.dropdown-item');
    expect(items.length).to.equal(3);
});