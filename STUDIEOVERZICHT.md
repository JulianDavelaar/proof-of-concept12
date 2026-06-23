# Studieoverzicht — Proof of Concept 12 (Pokemon Pokedex)

Leestijd: ~25-30 minuten. Focus op de dingen die je nog moet leren.

---

## 1. DATA OPHALEN (server.js)

### Hoe de data binnenkomt

```js
const getData = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
const getDataJSON = await getData.json()
```

- `fetch()` haalt data op van een externe API
- `.json()` zet het Response-object om naar een JavaScript object/array
- Het is NIET "leesbare tekst" — het is gestructureerde data (objecten, arrays)

### De loop: waarom twee fetches?

```js
for (const [index, item] of getDataJSON.results.entries()) {
    const id = index + 1
    const detailResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    const detail = await detailResponse.json()
    pokemon.push({ name: item.name, id: id, type: detail.types[0].type.name, ... })
}
```

- Eerste fetch: lijst van 151 namen + URLs (geen details)
- Tweede fetch (in de loop): per Pokemon de details (stats, types, weight, height)
- `index + 1` omdat `.entries()` bij 0 begint, maar Pokemon-IDs bij 1
- `.entries()` geeft per item twee dingen: [index, item] — dat heet destructuring

---

## 2. ROUTES — request.query vs request.params

Dit is BELANGRIJK — ken het verschil!

### request.query — data uit de URL na het ?-teken

```
URL: localhost:8000/?search=pikachu
                    ^^^^^^^^^^^^^^^^ dit is de query string
```

```js
request.query.search  // geeft: "pikachu"
```

Komt van formulieren met `method="get"`. Het formulier plakt de input achter de URL.

### request.params — data uit de route zelf

```
Route:  /pokemon/:id
URL:    /pokemon/25
                 ^^ dit is de param
```

```js
request.params.id  // geeft: "25"
```

`:id` is een placeholder in de route. Welke waarde er ook in de URL staat op die plek, dat wordt `request.params.id`.

### Samenvatting

| | Waar in URL | Voorbeeld URL | Hoe uitlezen |
|---|---|---|---|
| query | Na het `?` | `/?search=pikachu` | `request.query.search` |
| params | In het pad zelf | `/pokemon/25` | `request.params.id` |

---

## 3. RESPONSE.RENDER() — Data naar het template sturen

```js
response.render('index', { pokemon: results, search: search, title: 'All Pokemon' })
//               ^            ^                ^                ^
//               |            |                |                |
//          template naam     |          variabele 2       variabele 3
//                       variabele 1
```

- Het eerste argument is de naam van het template bestand (index.liquid)
- Het tweede argument is een object met data
- De NAMEN links van de `:` worden variabelen in Liquid
- `pokemon: results` betekent: de variabele `pokemon` in het template bevat de waarde van `results`

In het template gebruik je die variabelen:

```liquid
{% for item in pokemon %}     <-- 'pokemon' komt van response.render()
  {{ item.name }}             <-- elke 'item' is een Pokemon uit de lijst
{% endfor %}
```

---

## 4. ARRAY METHODS — .map(), .filter(), .find()

### .find() — zoek EEN item

Geeft het EERSTE item terug waarvoor de functie `true` teruggeeft. Niet een lijst, maar EEN ding.

```js
pokemon.find(function (item) { return item.id == 25 })
// Geeft terug: { name: "pikachu", id: 25, image: "...", ... }

pokemon.find(function (item) { return item.id == 999 })
// Geeft terug: undefined (niet gevonden)
```

### .filter() — houd meerdere items over

Loopt door een lijst, houdt alleen items over waarvoor de functie `true` geeft. Geeft een NIEUWE LIJST terug.

```js
pokemon.filter(function (item) { return item.name.includes("char") })
// Geeft: [charmander, charmeleon, charizard]

[pikachu, undefined, mew].filter(function (item) { return item })
// Geeft: [pikachu, mew]  — undefined is weg
```

### .map() — verander elk item in iets anders

Loopt door een lijst en verandert elk item. Geeft een NIEUWE LIJST terug met DEZELFDE LENGTE.

```js
// Directus geeft:  [{text: "25"}, {text: "1"}, {text: "6"}]
// Dat zijn alleen ID-nummers, geen echte Pokemon-data

favJSON.data.map(function (message) {
    return pokemon.find(function (item) { return item.id == message.text })
})
// Wordt: [pikachu-object, bulbasaur-object, charizard-object]
```

Map = vertaalmachine (andere vorm, zelfde aantal)
Filter = zeef (sommige vallen weg)
Find = zoek 1 specifiek item

---

## 5. FAVORIETEN — De complete flow

### Waarom Directus?
PokéAPI is read-only (alleen lezen). Directus is een eigen database waar je WEL data kunt opslaan/verwijderen.

### Wat er gebeurt als je op de pokeball drukt:

```
1. Browser stuurt POST naar /pokemon/25/favorite
2. Server checkt in Directus: is Pokemon 25 al opgeslagen voor 'favorites-julian'?
3A. JA (data.length > 0) → DELETE uit Directus → status = 'removed'
3B. NEE (data.length == 0) → POST naar Directus → status = 'added'
4. Redirect naar: /?favorite=added  of  /?favorite=removed
5. Middleware leest request.query.favorite uit de URL
6. Template toont bevestigingsmelding
```

### Favorieten ophalen (GET /favorites):

```
1. Haal alle berichten uit Directus met filter 'favorites-julian'
2. .map() — per bericht: zoek de echte Pokemon in de pokemon-array via het ID
3. .filter() — gooi undefined weg (voor het geval een Pokemon niet bestaat)
4. Render de favorites pagina met de echte Pokemon-objecten
```

### Waar komt 'favorite' in het template vandaan?

NIET uit de database! Het komt uit de URL via de middleware:

```js
// Middleware in server.js:
app.use(function (request, response, next) {
    response.locals.favorite = request.query.favorite   // uit de URL
    next()
})

// Na redirect staat in de URL: /?favorite=added
// Dus request.query.favorite = "added"
// response.locals maakt het beschikbaar in ALLE templates
```

---

## 6. DATA-ATTRIBUTEN — data-name en dataset

### In de HTML (index.liquid):

```html
<li class="card" data-name="pikachu">
```

`data-name` is een HTML data-attribuut. Je kunt zelf data opslaan in HTML-elementen.

### In JavaScript (main.js):

```js
card.dataset.name   // geeft: "pikachu"
```

De regel: `data-` in HTML wordt `dataset.` in JavaScript.
Wat na `data-` komt, wordt de property-naam:
- `data-name` → `dataset.name`
- `data-id` → `dataset.id`
- `data-pokemon-type` → `dataset.pokemonType` (streepje wordt camelCase)

---

## 7. PROGRESSIVE ENHANCEMENT — Twee zoekfuncties

### Server-side (server.js) — werkt ALTIJD

```js
results = pokemon.filter(function (item) {
    return item.name.includes(search.toLowerCase())
})
```

- Gebruiker typt, drukt Enter, pagina laadt opnieuw
- Werkt zonder JavaScript
- Data wordt gefilterd op de server

### Client-side (main.js) — verbetering met JS

```js
searchInput.addEventListener('input', function () {
    cards.forEach(function (card) {
        card.hidden = !card.dataset.name.includes(query)
    })
})
```

- Filtert LIVE terwijl je typt, zonder pagina te herladen
- Verbergt kaarten met `card.hidden = true`
- Werkt alleen als JavaScript aan staat

Dit heet PROGRESSIVE ENHANCEMENT:
- Basisfunctionaliteit werkt altijd (server-side)
- Met JS wordt het beter (client-side live zoeken)

---

## 8. LIQUID TEMPLATES

### {{ }} vs {% %}

- `{{ }}` = TONEN — zet een waarde op het scherm
- `{% %}` = LOGICA — loops, if/else, layout (toont zelf niks)

### Layout systeem

`base.liquid` is het frame met een gat:

```liquid
{% block content %}{% endblock %}    <-- hier komt pagina-inhoud
```

Elke pagina vult dat gat:

```liquid
{% layout 'layouts/base.liquid' %}   <-- gebruik de base layout
{% block content %}
  <h1>Mijn pagina</h1>               <-- dit komt in het gat
{% endblock %}
```

### For-loop met else

```liquid
{% for item in pokemon %}
  <li>{{ item.name }}</li>
{% else %}
  <li>No Pokemon found</li>       <-- toont alleen als de lijst LEEG is
{% endfor %}
```

### Lazy loading in Liquid

```liquid
loading="{% if forloop.index <= 8 %}eager{% else %}lazy{% endif %}"
```

- `forloop.index` = welk item je bent in de loop (1, 2, 3...)
- Eerste 8: eager (direct laden, want zichtbaar zonder scrollen)
- Rest: lazy (pas laden als je erheen scrollt)

---

## 9. CSS — Dark Mode (drie blokken)

```css
/* 1. Standaard light mode kleuren */
:root {
    --color-background: #ffffff;
}

/* 2. Systeem staat op dark EN gebruiker heeft NIET handmatig light gekozen */
@media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
        --color-background: #000000;
    }
}

/* 3. Gebruiker kiest HANDMATIG dark via toggle */
:root[data-theme="dark"] {
    --color-background: #000000;
}

/* 4. Gebruiker kiest HANDMATIG light via toggle */
:root[data-theme="light"] {
    --color-background: #ffffff;
}
```

Handmatige keuze (via toggle) wint ALTIJD van systeeminstelling.
De keuze wordt opgeslagen in `localStorage` zodat het blijft na herladen.

### Toggle alleen zichtbaar met JS

```css
.theme-toggle { display: none; }        /* standaard verborgen */
.js .theme-toggle { display: inline-block; }  /* zichtbaar als JS werkt */
```

In `main.js`: `document.documentElement.classList.add('js')` voegt de class toe.
Zonder JS → geen `.js` class → toggle blijft verborgen → geen kapotte knop.

---

## 10. CSS LAYOUT — Grid & Responsive

```css
.pokemon-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));   /* telefoon: 2 kolommen */

    @media (min-width: 480px) {
        grid-template-columns: repeat(3, ...);            /* tablet: 3 kolommen */
    }
    @media (min-width: 768px) {
        grid-template-columns: repeat(4, ...);            /* laptop: 4 kolommen */
    }
}
```

### Stat bars (detail pagina)

```css
.stat-row { grid-template-columns: 7rem 2.8rem 1fr; }
/*                                  naam  getal  balk */
```

De balk wordt gevuld met inline style uit het template:
```html
<div class="stat-fill" style="width:65%"></div>
```

### Centreren met left + transform

```css
left: 50%;                    /* linkerkant op het midden */
transform: translateX(-50%);  /* schuif halve eigen breedte terug */
/* = precies gecentreerd */
```

Dit is een standaard CSS-truc. `left: 50%` alleen centreert NIET correct,
omdat het de linkerkant van het element op 50% zet, niet het midden.

---

## QUICK REFERENCE — Vergeet deze niet!

| Concept | Onthoud |
|---|---|
| `request.query` | Data uit URL na `?` — komt van GET formulieren |
| `request.params` | Data uit de route zelf — van `:id` placeholder |
| `response.render()` | Stuurt template + data — namen worden Liquid variabelen |
| `.find()` | Zoekt EEN item, geeft dat terug (of undefined) |
| `.filter()` | Houdt items over die true geven, geeft een LIJST |
| `.map()` | Verandert elk item, geeft NIEUWE LIJST (zelfde lengte) |
| `data-name` → `dataset.name` | HTML data-attribuut uitlezen in JS |
| `response.locals` | Maakt data beschikbaar in ALLE templates |
| Progressive enhancement | Server = basis, JS = verbetering |
| `localStorage` | Slaat data op in de browser, blijft na herladen |
