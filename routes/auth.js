const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const router = express.Router();

// 📌 Ruta de Registro
router.post('/register', [
    check('username', 'El nombre de usuario es obligatorio').not().isEmpty(),
    check('email', 'El email no es válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, foto } = req.body;

    try {
        // 📌 Verificar si el usuario ya existe
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        // 📌 Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 📌 Crear nuevo usuario
        user = new User({
            username,
            email,
            password: hashedPassword,
            foto
        });

        await user.save(); // Guardar en MongoDB

        // 📌 Crear token JWT
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, 'secreto123', { expiresIn: '1h' });

        res.json({ token });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;
