const express = require('express');
const app = express();

const Usuario = require("../models/usuario");
const bcrypt = require('bcryptjs');
const _ = require("underscore");

// Muestra data
app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;

    // se castea a numero
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    // Se puede especificar la misma condicion que aparece en mongo
    // Se puede especificar que datos mostrar, en este caso los de estado activos
    Usuario.find({ estado: true }, "nombre email role estado google img")
        // Se saltara los primeros 5 registros
        .skip(desde)
        // Mostrara informacion con un limite de 5 registros
        .limit(limite)
        // Ejecutara la funcion
        .exec((err, usuarios) => {

            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                });
            }
            //Realiza conteo de los registros
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });

        });
});

// Crea data
app.post('/usuario', function(req, res) {

    let body = req.body;

    //generas el salt:
    let salt = bcrypt.genSaltSync(10);
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

    /*
    Se reemplaza por el codigo de arriba
    if (body.nombre === undefined) {

        res.status(400).json({
            ok: false,
            mensaje: "El nombre es necesario"
        })

    } else {
        res.json({
            persona: body
        });
    }*/

});

// Actualizar data
app.put('/usuario/:id', function(req, res) {

    // Llama al ID que se rescata desde UTL 
    let id = req.params.id;

    // mostrara los atributos a actualizar
    let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);

    // new : true, mostrara el dato actualizado cuando se cambie
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuarioDB: usuarioDB
        });
    });
});

// Borra data
app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;

    /*
    // Borrara el dato de la BD
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no encontrado"
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });
    */

    // Se entrega valor a esitar
    let cambiaEstado = {
        estado: false
    };
    // Editara el estado del usuario en la BD
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no encontrado"
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });




    });
});

module.exports = app;