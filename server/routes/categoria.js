const express = require("express");

let { verificaToken, verificaAdmin_Role } = require("../middlewares/autenticacion");

let app = express();

let Categoria = require("../models/categoria");

// =====================================
// MOSTRARA TODAS LAS CATEGORIAS
// =====================================
app.get("/categoria", verificaToken, (req, res) => {

    Categoria.find({})

    // ordenara en base a descripcion
    .sort("descripcion")

    // Verificara que object existen y permite cargar informacion
    .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });

        });
});


// =====================================
// MOSTRARA UNA CATEGORIA POR ID
// =====================================
app.get("/categoria/:id", verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "El Id de categoria no es correcto"
                }
            });
        }

        res.json({
            ok: true,
            Categoria: categoriaDB
        });

    });

});

// =====================================
// CREARA UNA NUEVA CATEGORIA
// =====================================
app.post("/categoria", verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

// =====================================
// ACTUALIZARA CATEGORIA POR ID
// =====================================
app.put("/categoria/:id", verificaToken, (req, res) => {
    // regresa la nueva categoria
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

// =====================================
// ELIMINARA CATEGORIA POR ID
// =====================================
app.delete("/categoria/:id", [verificaToken, verificaAdmin_Role], (req, res) => {
    // solo un admin puede eliminar
    // debe solicitar token

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Id no existe"
                }
            });
        }

        res.json({
            ok: true,
            message: "Categoria borrada"
        });
    });
});

module.exports = app;