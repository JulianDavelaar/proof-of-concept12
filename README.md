# Pokémon overview

Een responsive Pokémon-overzicht, gebouwd voor Hypersolid met data uit de PokéAPI en een Directus-database voor favorieten.

> FDND-opdracht: [Ontwerp en maak een data driven online concept voor een opdrachtgever](https://github.com/fdnd-task/proof-of-concept/blob/main/docs/INSTRUCTIONS.md)

![Screenshot van de Pokémon overview](https://github.com/user-attachments/assets/bcc9959d-ede8-48fe-9ffe-d317ed0a81b0)

Live: https://proof-of-concept12-3.onrender.com/

## Inhoudsopgave

  * [Beschrijving](#beschrijving)
  * [Gebruik](#gebruik)
  * [Kenmerken](#kenmerken)
  * [Installatie](#installatie)
  * [Testen](#testen)
  * [Bronnen](#bronnen)
  * [Licentie](#licentie)

## Beschrijving

Data-driven website met server-side rendering via Express en Liquid.

- Live search (werkt ook zonder JS)
- Responsive kaarten-grid met type-kleuren
- Favorieten toevoegen/verwijderen, opgeslagen in Directus

## Gebruik

Als bezoeker wil ik alle Pokémon kunnen zien, ze kunnen opzoeken en markeren als favoriet.

Bij het openen land je op een overview van alle Pokémon, beginnend bij de allereerste. Je kan scrollen door de lijst of zoeken op naam. Klik je op een Pokémon, dan zie je de detailpagina met stats. Elke Pokémon kan je vanuit elk scherm markeren als favoriet; je favorieten vind je terug op het favorietenscherm, bereikbaar vanaf de overview.

## Kenmerken

- **HTML/Liquid**: semantische structuur — `<article>` voor kaarten, `<search>` voor de zoekbalk, `<dl>` voor stats. Layout-inheritance met `{% layout %}` + `{% block %}`.
- **CSS**: page-specifieke bestanden + gedeelde stylesheet. Selectors en media queries genest per component, mobile first (grid: 2 → 3 → 4 kolommen). Kleuren via custom properties.
- **JS**: minimaal, alleen als enhancement — async/await voor de live zoekfunctie.
- **Node/Express**: Pokémon-data wordt bij startup één keer opgehaald uit de PokéAPI en daarna uit het geheugen geserveerd. Compression-middleware voor kleinere responses.
- **Progressive enhancement**: zoeken werkt als form GET (serverfilter) zonder JS, mét JS wordt er live gefilterd. Favoriet-toggle werkt zonder JS via een POST-form, met bevestigingsmelding.

## Installatie

```bash
git clone https://github.com/juuldavelaar/proof-of-concept12.git
cd proof-of-concept12
npm install
npm start
```

De server draait op `http://localhost:8000`. Opstarten duurt ~20 seconden omdat alle Pokémon-data één keer wordt opgehaald.

## Testen

Alle testen (HTML-validatie, performance, screenreader, gebruikerstest) staan systematisch gedocumenteerd in issues. Per test wordt een issue aangemaakt volgens een vaste template.

## Bronnen

<!-- TODO juul: vul aan met de bronnen die je écht gebruikt hebt, volgens je wiki-conventie: link + wat je ermee gedaan hebt -->

- [PokéAPI](https://pokeapi.co/docs/v2) — documentatie voor de endpoints en datastructuur van de Pokémon-data
- [Directus API reference](https://directus.io/docs/api) — voor het opslaan en verwijderen van favorieten (POST/DELETE naar de items-endpoint)
- [LiquidJS](https://liquidjs.com/tutorials/layouts.html) — layout-inheritance met `{% layout %}` en `{% block %}`

## Licentie

This project is licensed under the terms of the [MIT license](./LICENSE).
