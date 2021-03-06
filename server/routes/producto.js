const express = require("express");

const { verificaToken } = require("../middlewares/autenticacion");

let app = express();
let Producto = require("../models/producto");

// =====================================
// MOSTRARA TODO LOS PRODUCTOS
// =====================================
app.get("/productos", verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    // Mostrara los productos que esten disponibles
    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate("usuario", "email")
        .populate("categoria", "descripcion")
        .exec((err, productos) => {

            if (err) return res.status(500).json({ ok: false, err });

            res.json({
                ok: true,
                productos
            });
        });

});

// =====================================
// MOSTRARA PRODUCTOS POR ID
// =====================================
app.get("/productos/:id", verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate("usuario", "nombre email")
        .populate("categoria", "descripcion")
        .exec((err, productoDB) => {

            if (err) return res.status(500).json({ ok: false, err });

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "El id de producto no existe"
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });

        });
});

// =====================================
//  BUSCARA PRODUCTOS
// =====================================
app.get("/productos/buscar/:termino", verificaToken, (req, res) => {

    let termino = req.params.termino;

    let reqex = new RegExp(termino, "i");

    Producto.find({ nombre: reqex })
        .populate("categoria", "nombre")
        .exec((err, productos) => {

            if (err) return res.status(500).json({ ok: false, err });

            res.json({
                ok: true,
                productos
            });

        });
});

// =====================================
// CREARA PRODUCTOS
// =====================================

app.post("/productos", verificaToken, (req, res) => {

    let body = req.body;

    console.log("Boddyyy: ", body);

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {

        if (err) return res.status(500).json({ ok: false, err });

        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });

});

// =====================================
//  ELIMINARA PRODUCTOS
// =====================================
app.delete("/productos/:id", verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

        if (err) return res.status(500).json({ ok: false, err });

        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El id de producto no existe"
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {
            res.json({
                ok: true,
                producto: productoBorrado,
                message: "Se ha borrado producto: "
            });
        });

    });

});

// =====================================
//  EDITARA PRODUCTOS
// =====================================
app.put("/productos/:id", verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El id no existe"
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });

        });

    });

});




module.exports = app;