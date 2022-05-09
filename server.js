const express = require('express');
const path = require('path');
const minimist = require('minimist')
require('dotenv').config()

const {fork} = require('child_process')

const cookieParser = require('cookie-parser');
const session = require('express-session');

const {faker} = require('@faker-js/faker')
const Memoria = require('./src/contenedores/contenedorMemoria.js')

const app = express();

let options = {alias: {p: 'puerto'}}
let args = minimist(process.argv, options)

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
//app.use(express.static('public'));

const hds = require('express-handlebars');

app.set('views', path.join(path.dirname(''), 'src/views'));

app.engine('.hbs', hds.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
}))

app.set('view engine', '.hbs');

app.use(cookieParser())
app.use(session({
   secret: '123456789!#$%&/()',
   resave: false,
   saveUninitialized: false,
   cookie: {
      secure: 'auto',
      maxAge: 600000
   }
}))


passport.use(new FacebookStrategy({
   clientID: process.env.FACEBOOK_APP_ID,
   clientSecret: process.env.FACEBOOK_APP_SECRET,
   callbackURL: "http://localhost:8080/auth/facebook/callback",
   profileFields: ['id', 'displayName', 'photos', 'email']
 },
 function(accessToken, refreshToken, profile, cb) {
   return cb(null, profile);
 }
));

passport.serializeUser((user, cb) => {
   cb(null, user);
});

passport.deserializeUser((obj, cb) => {
   cb(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

const productos = new Memoria();
const mensajes = new Memoria();

app.get('/', (req,res)=>{
   if(req.isAuthenticated()){

      const datosUsuario = {
         nombre: req.user.displayName,
         foto: req.user.photos[0].value,
         email: req.user.email 
      };

      res.render('inicio', {mensajes: mensajes.getAll(), productos: productos.getAll(), datos: datosUsuario})
   }else{
      res.redirect('/api/login')
   }
});

app.get('/api/login', (req,res)=>{
   res.render('login')
})

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', { 
      failureRedirect: '/login',
      successRedirect: '/' 
   }
))

app.get('/api/logout', (req,res)=>{
   req.logout()
   res.redirect('/')
});

app.post('/api/productos', (req,res) =>{
   productos.save({
      nombre: req.body.nombre,
      precio: req.body.precio,
      foto: req.body.urlFoto
   })
   res.redirect('/')

})

app.post('/api/mensajes', (req,res) =>{
   const mensaje = {
      email: req.body.email,
      nombre: req.body.nombreMensaje,
      apellido: req.body.apellido,
      edad: req.body.edad,
      alias: req.body.alias,
      mensaje: req.body.mensaje
   }
   let fechaActual = new Date();
   mensaje.fecha = `[(${fechaActual.getDay()}/${fechaActual.getMonth()}/${fechaActual.getFullYear()} ${fechaActual.getHours()}:${fechaActual.getMinutes()}:${fechaActual.getSeconds()})]`;
   mensaje.avatar = faker.image.avatar();
   mensajes.save(mensaje)
   res.redirect('/')
});

app.get('/info', (req,res)=>{

    res.render('info', {
        argsEnt: process.argv.slice(2),
        nomPlat: process.platform,
        verNode: process.version,
        memToRev: JSON.stringify(process.memoryUsage().rss),
        pathExe: process.execPath,
        procId: process.pid,
        carProy: process.cwd()
    })
})

app.get('/api/randoms', (req,res) => {
    console.log('no bloqueante antes')
    const randoms = fork('./random.js')
    randoms.send({query: req.query.cant})
    randoms.on('message', randoms =>{
        res.render('random', {random: JSON.stringify(randoms)})
    })
    console.log('no bloqueante despues')
})


const PORT = args.puerto || 8080;

const server = app.listen(PORT, () => {
   console.log(`Servidor escuchando en el puerto ${server.address().port}`);
});

server.on("error", error => console.log(`Error en servidor ${error}`));
