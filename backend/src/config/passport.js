const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const pool = require('../config/db.js');

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    
    async (email, password, done) => {
      console.log(`email recibido: ${email}`);
      console.log(`password recibido: ${password}`);
      try {
        
        const result = await pool.query(
          'SELECT * FROM usuarios WHERE email = $1 AND activo = true',
          [email]
        );


        if (result.rows.length === 0) {
          return done(null, false, { message: 'Credenciales inválidas' });
        }

        const usuario = result.rows[0];
        const passwordValido = await bcrypt.compare(password, usuario.password_hash);

        if (!passwordValido) {
          return done(null, false, { message: 'Credenciales inválidas' });
        }

        // No devolver el hash al objeto de sesión
        const { password_hash, ...usuarioSeguro } = usuario;
        return done(null, usuarioSeguro);
      } catch (error) {
        return done(error);
      }
    }
  )
);


module.exports = passport;
