// 1. server.js basis, dit staat altijd in het begin van server.js, het is de soort van installatie ervan
// dependencies die via npm install geïnstalleerd zijn 
import express, { response, urlencoded } from 'express'
import { Liquid } from 'liquidjs';

// fetchen van data (je API)
const getData = await fetch ('https://pokeapi.co/api/v2/pokemon?limit=151')

// met dat fetchen zelf kan je niks dus je leest de JSON data van die fetch af, dit wordt dus je html/liquid. iets waar we wat mee kunnen
const getDataJSON = await getData.json()

// console.log(getDataJSON)
//maak een express applicatie aan waarmee we de server configureren 
const app = express()

// dit zorgt ervoor dat ingevulde formulierdata leesbaar wordt dus als een gebruiker een form invult kan je dit uitlezen met request.body
app.use(express.urlencoded({extended: true}))

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts) Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))

// start de liquid template motor op
const engine = new Liquid();

// koppelt die motor aan express zodat express .liquid bestanden kan verwerken
app.engine('liquid', engine.express());

// verteld waar templates bestanden staan, in map views
app.set('views', './views')

// zegt: standaard zijn mijn templates van het type liquid, daarom kun je response.render('index') doen zonder .liquid erachter
app.set('view engine', 'liquid')




// als iemand de homepage(/) opvraagt, doe dan dit:
app.get ('/', async function (request, response) {

// deze const haalt de images uit de API
// pak mijn lijst van 151 pokemon en stuur deze over de lopende band. item = de pokémon die nu op de band ligt. index = het nummer van zijn plek
// promise.all laat wachten op alle 151 detail fetches voor we verder gaan.
const pokemon = await Promise.all(
    getDataJSON.results.map(async function(item, index) {
// berekenen van id bulbasaur ligt op plek 0 dus 0+1 = 1 enz. 
    const id = index + 1 

// Nieuwe regel voor de types zorgt ervoor de we in deze functie wachten op de fetch van de details. betekent: haal alle data van deze pokémon op
    const detailResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
// data uitlezen
    const detail = await detailResponse.json()
// De nieuwe versie die van de band af rolt. name = naam overnemen, id is nieuwe id toewijzen, image = de URL van afbeelding bouwen met id type is ophalen van type
    return {
        name: item.name,
        id: id,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
// detail.types is de lijst types, [0] is het eerste type, .type.name is de naam ervan
        type: detail.types[0].type.name
    }
})
)

// maak index.liquid om naar html en geef hier onderstaande data aan mee
    response.render('index', {
// de data die in de template mag, in me liquid kan ik dan {{} pokemon }} gebruiken
    pokemon: pokemon
    })
})





app.set('port', process.env.PORT || 8000)
app.listen(app.get('port'), function () {
    console.log(`application started on http://localhost:${app.get('port')}`)
})