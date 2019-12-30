const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

// Se genera los esquemas
let Schema = mongoose.Schema;

// Si se desea una lista de objetos admitibles
let rolesValidos = {
    values: ["ADMIN_ROLE", "USER_ROLE"],
    message: "{VALUE} no es un rol valido"
};

// Clase para las tablas creadas en la DB (Modelos)
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es necesario"]
    },
    email: {
        type: String,
        required: [true, "El correo es necesario"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "La clave es necesaria"]
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: "USER_ROLE",
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

// Para que excluya la password en el JSON a retornar
usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, {

    message: '{PATH} Correo ya se encuentra registrado'

});


module.exports = mongoose.model("Usuario", usuarioSchema);