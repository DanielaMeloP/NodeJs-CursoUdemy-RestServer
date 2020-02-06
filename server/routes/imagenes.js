const express = require("express");

const fs = require("fs");
const path = require("path");


const {verificaTokenImg} = require("../middlewares/autenticacion");


let app = express();

// Crea servicio que mostrara imnagenes
app.get('/imagen/:tipo/:img',verificaTokenImg, (req, res) =>{

    let tipo = req.params.tipo;
    let img = req.params.img;

   
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if(fs.existsSync(pathImagen)){
        // Si los parametros son correctos mostrara la imagen cargada
        res.sendFile(pathImagen);
    }else{
        // Si no encuentra la imagen por los parametros otorgdos, mostrara una imagen estandar.
        let noImagePath = path.resolve(__dirname, "../assets/not-found-image.jpg")

        res.sendFile(noImagePath);
    }


});

module.exports = app;