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
