    const searchInput = document.querySelector('.search input')
    if (searchInput) {
        
        const cards = document.querySelectorAll('.pokemon-grid .card')
        searchInput.addEventListener('input', function () {
        const query = searchInput.value.toLowerCase().trim()
        cards.forEach(function (card) {
            const name = card.dataset.name.toLowerCase()
            if (name.includes(query)) {
                card.hidden = false
            }
            else {
                card.hidden = true
            }
        })
    })
}

document.documentElement.classList.add('js');
const root = document.documentElement;
const toggle = document.querySelector('.theme-toggle')

const saved = localStorage.getItem('theme');
if (saved) {
    root.dataset.theme = saved;
}

toggle.addEventListener('click', () => {
    const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
    const current = root.dataset.theme || (prefersDark ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';

    root.dataset.theme = next;
    localStorage.setItem('theme', next);
});