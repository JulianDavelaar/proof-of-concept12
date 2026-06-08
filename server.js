// 1. server.js basis, dit staat altijd in het begin van server.js, het is de soort van installatie ervan
// dependencies die via npm install geïnstalleerd zijn 
import express from 'express'
import compression from 'compression'
import { Liquid } from 'liquidjs'

//maak een express applicatie aan waarmee we de server configureren 
const app = express()

// dit zorgt ervoor dat ingevulde formulierdata leesbaar wordt dus als een gebruiker een form invult kan je dit uitlezen met request.body
app.use(compression())
app.use(express.urlencoded({extended: true}))

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts) Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))


// start de liquid template engine op
const engine = new Liquid();
app.engine('liquid', engine.express());
app.set('views', './views')
app.set('view engine', 'liquid')



// als iemand de homepage(/) opvraagt, doe dan dit:
app.get ('/', async function (request, response) {
try {
    //zoekterm van URL uitlezen (?search)
    const search = (request.query.search || '').trim()

    //lijst van 151 pokémon ophalen
    const getData = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
    const getDataJSON = await getData.json()

    // lege lijst die we vullen met loop
    let pokemon = []

    //loop door resultaten index begint bij - dus +1
    for (const [index, item] of getDataJSON.results.entries()) {
        const id = index + 1 

    //per pokémon details ophalen
    const detailResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    const detail = await detailResponse.json()

    //pokémon toevoegen aan lijst
    pokemon.push({
        name: item.name,
        id: id,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
        // detail.types is de lijst types, [0] is het eerste type, .type.name is de naam ervan
        type: detail.types[0].type.name,
        types: detail.types,
        stats: detail.stats,
        height: detail.height,
        weight: detail.weight  
    })
}

//filteren op zoekterm
if (search.length > 0) {
    pokemon = pokemon.filter(function (item) {
        return item.name.includes(search.toLowerCase())
    })
}

// maak index.liquid om naar html en geef hier onderstaande data aan mee
    response.render('index', { pokemon: pokemon, search: search})
 } catch (error) {
    response.redirect('/?error=true')
 }
})



//detailpagina per pokémon
app.get ('/pokemon/:id', async function (request, response) {

// id uit URL halen 
try {
        const id = request.params.id
        const detailResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
if (!detailResponse.ok) {
    return response.status(404).render('404')
}

const detail = await detailResponse.json()
const pokemon = { 
        name: detail.name,
        id: id,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
        // detail.types is de lijst types, [0] is het eerste type, .type.name is de naam ervan
        type: detail.types[0].type.name,
        types: detail.types,
        stats: detail.stats,
        height: detail.height,
        weight: detail.weight  
    }

        response.render('detail', { pokemon: pokemon})
 } catch (error) {
    response.redirect('/?error=true')
 }
 })


app.set('port', process.env.PORT || 8000)
app.listen(app.get('port'), function () {
    console.log(`application started on http://localhost:${app.get('port')}`)
})