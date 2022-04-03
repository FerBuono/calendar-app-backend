const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

const createUser = async(req, res = response) => {
    const {email, password} = req.body;

    try {
        let user = await User.findOne({email}); // busca un usuario con ese email
        
        if(user) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            });
        };
       
        user = new User(req.body); //si no encuentra uno con ese mail, crea uno nuevo
        
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync(); //genera un salt: un numero o un pedazo de informacion aleatorio para encriptar, a mas vueltas mas seguro. por defecto 10
        user.password = bcrypt.hashSync(password, salt); //cambio la contraseña por la hasheada

        await user.save(); //lo guarda en la db

        // Generar JSON Web Token
        const token = await generateJWT(user.id, user.name);
    
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin',
        });
    };
};

const loginUser = async(req, res = response) => {
    const {email, password} = req.body;

    try {
        let user = await User.findOne({email}); // busca un usuario con ese email
        console.log(user.uid)
        if(!user) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        };

        // Confirmar los passwords
        const validPassword = bcrypt.compareSync(password, user.password);

        if(!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        };

        // Generar JSON Web Token
        const token = await generateJWT(user.id, user.name);
    
        res.status(200).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin',
        });
    }
};

const renewToken = async(req, res = response) => {
    const {uid, name} = req;

    // Generar un nuevo JWT
    const token = await generateJWT(uid, name);

    res.status(200).json({
        ok: true,
        token
    });
};

module.exports = {
    createUser,
    loginUser,
    renewToken
};