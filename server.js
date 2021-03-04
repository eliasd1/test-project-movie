const url = "https://api.themoviedb.org/3/search/movie"

const express = require('express');
const cors = require('cors');
const superAgent = require('superagent');
require('dotenv').config();
const app = express();

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(cors());

app.get('/', (req, res) => {
    res.render('index')
})
app.get('/searches', (req, res) =>{
    if(req.query.search !== " " || req.query.search !== 'undefined'){
        const query = {
            api_key: process.env.MOVIES_API_KEY,
            query: req.query.search
        }
        return superAgent.get(url).query(query).then(data =>{
            res.send(data.body)
        }).catch(error => console.log('error'))
    }
    
})

app.listen(process.env.PORT, () =>{
    console.log("Listening on " + process.env.PORT);
})