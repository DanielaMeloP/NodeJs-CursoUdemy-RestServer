// Objeto global que corre siempre
// Puerto

process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || "dev";


// Vencimiento de Token
// Expirará en 60 segundos con 60 minutos 24 horas 30 dias
//process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.CADUCIDAD_TOKEN = "48h";

// SEED de autentificación
process.env.SEED = process.env.SEED || "este-es-el-seed-desarrollo";


// Base de datos
let urlDB;

/*if (process.env.NODE_ENV === "dev") {
    urlDB = "mongodb://localhost/cafe";
} else {*/
urlDB = "mongodb+srv://strujenstrajen:I5Ktfvb5G9QfGm8v@cluster0-oxage.mongodb.net/cafe?retryWrites=true&w=majority"
    //}

process.env.URLDB = urlDB;

// Google Client ID
process.env.CLIENT_ID = process.env.CLIENT_ID || "1094073219637-p2485bj2mvr019olb9nnosob5e9a3otl.apps.googleusercontent.com";