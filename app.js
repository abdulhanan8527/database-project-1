if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const http = require('http')
const fs = require('fs')
const port = 3000

const express = require('express')
const path = require('path')
const app = express()
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const users = []

const bcrypt = require('bcrypt')
const passport = require('passport')
const initializePassport= require('./passport-config')
const { authenticate } = require('passport')
initializePassport(
    passport,
    username => users.find(user => user.username === username),
    id => users.find(user => user.id === id)
)

app.use(express.json())
app.set('view-engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
// app.get('/users', function(req, res){
//     res.json(users)
// })

// app.post('/users', async function(req, res){
//     try{
//         const salt = await bcrypt.genSalt()
//         const hashedPassword = await bcrypt.hash(req.body.password, salt)
//         const user = {username: req.body.username, password: hashedPassword}
//         users.push(user)
//         res.status(201).send()
//     }
//     catch{
//         res.status(500).send()
//     }
    
// })

// app.post('/users/login', async function(req, res){
//     const user = users.find(user => user.username === req.body.username)
//     if(user == null){
//         return res.status(400).send('Cannot Find the User')
//     }
//     try{
//         if(await bcrypt.compare(req.body.password, user.password)){
//             res.render('index.ejs')
//             res.send('Success')
//         }
//         else{
//             res.send('Not Allowed')
//         }
//     }
//     catch{
//         res.status(500).send()
//     }
// })

app.use(express.static(__dirname + '/public'))

app.get('/',checkAuthenticated, function(req, res){
    res.render('index.ejs', { name : req.user.firstname })
})

app.get('/login', checkNotAuthenticated, function(req, res){
    res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, function(req, res){
    res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async function(req, res){
    try{
        const salt = await bcrypt.genSalt() //by defualt genSalt takes 10 inside function parameters
        const hashedPassword = await bcrypt.hash(req.body.password, salt) //if we replace salt by 10 nothing will change
        const user = {id: Date.now().toString(), firstname: req.body.firstname, lastname: req.body.lastname, username: req.body.username, email: req.body.email, password: hashedPassword}
        users.push(user)
        res.redirect('/login')
        //res.status(201).send()
    }
    catch{
        res.redirect('/register')
        //res.status(500).send()
    }
    console.log(users)
})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }

app.listen(port);

console.log('Now the server is running on url: https://127.0.0.1:3000')

// const server = http.createServer(function(req, res){
//     res.writeHead(200, { 'Content-type' : 'text/html' })
//     fs.readFile('index.html', function(error, data){
//         if(error){
//             res.writeHead(404);
//             res.write('Error: File Not Found')
//         }
//         else{
//             res.write(data)
//         }
//         res.end()
//     })    
// })

// server.listen(port, function(error){
//     if(error){
//         console.log('Something went wrong', error)
//     }
//     else{
//         console.log('Server is listening to port ' + port)
//     }
// })