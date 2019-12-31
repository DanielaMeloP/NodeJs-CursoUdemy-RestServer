require("./config/config");

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const app = express();

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

/// parse application/json
app.use(bodyParser.json())

// Exporta las rutas
// Configuración global de rutas
app.use(require("./routes/index"));

// Realiza conexion a DB MONGO
/*mongoose.connect('mongodb://localhost/cafe', {

        useCreateIndex: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(`DB Connection Error: ${ err.message }`);
    });*/

// Con este comando se conecta a la BD local
// mongoose.connect('mongodb://localhost/cafe', {
mongoose.connect(process.env.URLDB, {
        // useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true
    },
    (err, res) => {
        if (err) throw err;
        console.log("Base de datos conectada");
    });



// Establece el puerto
app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto ", process.env.PORT);
});