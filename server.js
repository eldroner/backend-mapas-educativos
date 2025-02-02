const express = require('express');
const cors = require('cors');
const connectDB = require('./database');
const session = require('express-session');
const passport = require('./passport'); // 📌 Importamos Passport.js

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));

// 📌 Configurar sesiones para Passport
app.use(session({
  secret: 'secreto123', // 🔐 Cambia esto por un valor seguro
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Conectar a la base de datos
connectDB();

app.get('/', (req, res) => {
  res.send('Servidor funcionando y conectado a MongoDB Atlas 🚀');
});

// 📌 Rutas de autenticación con Google
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect('http://localhost:4200');
});

// 📌 Rutas de autenticación con Facebook
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), (req, res) => {
  res.redirect('http://localhost:4200');
});

// 📌 Ruta para cerrar sesión
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('http://localhost:4200');
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🟢 Servidor corriendo en el puerto ${PORT}`));
