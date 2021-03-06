const url = "https://api.themoviedb.org/3/search/movie"

const express = require('express');
const cors = require('cors');
const superAgent = require('superagent');
const session = require('express-session')
const pg = require('pg')
require('dotenv').config();

const app = express();
// process.env.DATABASE_URL
// { connectionString: process.env.DATABASE_URL,   ssl: { rejectUnauthorized: false } }
const client = new pg.Client({ connectionString: process.env.DATABASE_URL,   ssl: { rejectUnauthorized: false } });

app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.set('view engine', 'ejs')
app.use(cors());
const sessionLocals = function(req, res, next)
{            
    res.locals.session = req.session;
    next();
}

app.use(sessionLocals);


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
        }).catch(error => console.log('error', error))
    }
    
})

app.get('/signup', (req, res) =>{
    if(!req.session.loggedin){
        res.render('signUp');
    } else{
        res.redirect('/')
    }
})

app.get('/login', (req, res) =>{
    if(!req.session.loggedin){
        res.render('logIn');
    } else{
        res.redirect('/')
    }
})



app.get('/logout', (req, res)=>{
    if(req.session.loggedin){
        updateLog(req.session.userName, req, res)
    } else{
        res.redirect('/');
    }
})

app.post('/signup', (req, res) =>{
    let user = req.body.user;
    if(user.userName && user.password){
        let addUser = 'INSERT INTO account(userName, password, isLoggedIn) VALUES($1, $2, TRUE) ON CONFLICT ON CONSTRAINT account_name DO NOTHING RETURNING *;'
        let safeValues = [user.userName, user.password];
        client.query(addUser, safeValues).then(data =>{
            console.log(data.rows);
            if(data.rows.length > 0){
                req.session.loggedin = true;
                req.session.userName = user.userName;
                res.redirect('/');
            } else{
                res.render('signUp', {userNameTaken: true})
            }
        }).catch(error => console.log('error'))
    }
})

app.post('/login', (req, res) =>{
    let user = req.body.user;
    isLoggedIn(user).then(status =>{
        if(status || status === null){
            res.redirect('/login')
        } else{
            updateLog(user.userName, req, res)
        }
    })
})

function isLoggedIn(user){
    let checkIfLoggedIn = 'SELECT isLoggedIn FROM account WHERE userName = $1 AND password = $2'
    return client.query(checkIfLoggedIn, [user.userName, user.password]).then(data =>{
        if(data.rows.length > 0){
            return data.rows[0].isLoggedIn;
        } else{
            return null;
        }
    })
}

function updateLog(userName, req, res){
    if(req.session.loggedin){
        const loggedOff = 'UPDATE account SET isLoggedIn = FALSE WHERE userName = $1;'
        client.query(loggedOff, [req.session.userName]).then(() =>{
            req.session.loggedin = false;
            req.session.userName = '';
            res.redirect('/')
        }).catch(error => console.log(error))  
    }
    if(!req.session.loggedin){
        const loggedIn = 'UPDATE account SET isLoggedIn = TRUE WHERE userName = $1;'
        client.query(loggedIn, [userName]).then(() =>{
            req.session.loggedin = true;
            req.session.userName = userName;
            res.redirect('/')
        }).catch(error => console.log(error))   
    }
}
client.connect().then(() =>{
    app.listen(process.env.PORT, () =>{
        console.log("Listening on " + process.env.PORT);
    })
})
