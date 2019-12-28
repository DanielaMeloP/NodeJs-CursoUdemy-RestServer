require("./config/config");

const express = require('express');
const app = express();
const bodyParser = require("body-parser");

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

/// parse application/json
app.use(bodyParser.json())

// Muestra data
app.get('/usuario', function(req, res) {
    res.json('get Usuario');
});

// Crea data
app.post('/usuario', function(req, res) {

    let body = req.body;

    if (body.nombre === undefined) {

        res.status(400).json({
            ok: false,
            mensaje: "El nombre es necesario"
        })

    } else {
        res.json({
            persona: body
        });
    }

});

// Actualizar data
app.put('/usuario/:id', function(req, res) {

    // Llama al ID que se rescata desde UTL 
    let id = req.params.id;
    res.json({
        id
    });

});

// Borra data
app.delete('/usuario', function(req, res) {
    res.json('delete Usuario');
});

app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto ", process.env.PORT);
});