Ontwerp en maak een data driven online concept voor een opdrachtgever

De instructies voor deze opdracht staan in: [docs/INSTRUCTIONS.md](https://github.com/fdnd-task/proof-of-concept/blob/main/docs/INSTRUCTIONS.md)

# Titel
Pokémon overview
Een responsive pokémon overzicht, gebouwt voor Hypersolid met data uit de PokéAPI en Directus database voor favorieten.

## Inhoudsopgave

  * [Beschrijving](#beschrijving)
  * [Gebruik](#gebruik)
  * [Kenmerken](#kenmerken)
  * [Installatie](#installatie)
  * [Bronnen](#bronnen)
  * [Licentie](#licentie)

## Beschrijving
Data-driven website van een pokémon overview, server-side rendering met Express en liquid.
- Live search bar
- Responsive grid
- Favorite toggle
  <img width="1897" height="868" alt="image" src="https://github.com/user-attachments/assets/bcc9959d-ede8-48fe-9ffe-d317ed0a81b0" />
  - live render link: https://proof-of-concept12-3.onrender.com/


## Gebruik
Als bezoeker wil ik alle pokémon kunnen zien die er zijn en deze kunnen opzoeken en markeren als favoriet.
Bij het opstarten van de pagina land je op een overview van de Pokémon, beginnende met de aller eerste. 
Vanuit daar kun je scrollen om de Pokémon lijst te bekijken, je kan ook zoeken op naam. 
Als je op een Pokémon klikt kan je de details van deze Pokémon zien, stats, hp, etc
Je kan elke Pokémon vanuit elk scherm markeren als favoriet, 
de gemarkeerde Pokémon zijn terug te vinden in het favorieten scherm, hier kan je komen vanuit de overview


## Kenmerken
- HTML structuur met liquid: semantisch. `<article>` voor kaarten `<search>`, `<dl>` voor stats. Layout inheritance `{% layout %}` + `{% block %}`
- CSS: page-specifieke bestanden + stylesheet, nesting en mobile-first media queries
- JS: minimaal, async/await voor live zoekfunctie
- NodeJS/Express/compression: statische Pokémon, wordt bij startup 1x opgehaald. 
<!-- Bij Kenmerken staat welke technieken zijn gebruikt en hoe. Wat is de HTML structuur? Wat zijn de belangrijkste dingen in CSS? Wat is er met JS gedaan en hoe? Misschien heb je iets met NodeJS gedaan, of heb je een framwork of library gebruikt? -->

## Installatie
- NodeJS stappen: git clone -> npm install -> npm start.
- opstarten ~20s
- draait op `http://localhost:8000`
<!-- Bij Instalatie staat hoe een andere developer aan jouw repo kan werken -->



- responsive kaart grid, mobile first, type-kleuren, hover. 2 - 3 - 4 kolommen.
- Live search, werkt als form GET (server filter), met JS live filteren. (progressive enhancement)
- favoriet toggle, POST naar Directus. toevoegen/verwijderen, bevestigingsmelding POST met UI-states. werkt zonder JS




## Bronnen

## Licentie

This project is licensed under the terms of the [MIT license](./LICENSE).
