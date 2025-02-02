const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('./models/user'); // Asegúrate de que el modelo de usuario esté bien configurado

// 📌 Serialización y deserialización del usuario (necesario para las sesiones)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// 📌 Configuración de Google OAuth
passport.use(new GoogleStrategy({
  clientID: 'TU_GOOGLE_CLIENT_ID',
  clientSecret: 'TU_GOOGLE_CLIENT_SECRET',
  callbackURL: 'http://localhost:5000/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      user = new User({
        username: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        foto: profile.photos[0].value
      });
      await user.save();
    }
    
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// 📌 Configuración de Facebook OAuth
passport.use(new FacebookStrategy({
  clientID: 'TU_FACEBOOK_CLIENT_ID',
  clientSecret: 'TU_FACEBOOK_CLIENT_SECRET',
  callbackURL: 'http://localhost:5000/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'emails', 'photos']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ facebookId: profile.id });

    if (!user) {
      user = new User({
        username: profile.displayName,
        email: profile.emails ? profile.emails[0].value : 'No email provided',
        facebookId: profile.id,
        foto: profile.photos[0].value
      });
      await user.save();
    }
    
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

module.exports = passport;
