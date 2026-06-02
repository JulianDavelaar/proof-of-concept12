// dependencies die via npm install geïnstalleerd zijn 
import express, { response, urlencoded } from 'express'
import { Liquid } from 'liquidjs';

// fetchen van data (je API)
const getData = await fetch ('https://pokeapi.co/api/v2/pokemon?limit=151')

// met dat fetchen zelf kan je niks dus je leest de JSON data van die fetch af, dit wordt dus je html/liquid. iets waar we wat mee kunnen
const getDataJSON = await getData.json()

console.log(getDataJSON)

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


