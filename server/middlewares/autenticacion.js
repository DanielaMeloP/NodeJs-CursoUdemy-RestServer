//
const jwt = require("jsonwebtoken");

// =======================
// VERIFICAR TOKEN
// =======================

let verificaToken = (req, res, next) => {

    let token = req.get("token"); // Buscara el nombre de variable creada

    /* res.json({
         token : token
     });*/

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({

                ok: false,
                err: {
                    message: "Token no valido"
                }

            });
        }

        req.usuario = decoded.usuario;
        // El next ejecuta codigo siguiente
        next();
    });
};


// =======================
// VERIFICAR ADMIN ROLE
// =======================

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === "ADMIN_ROLE") {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: "El usuario no es administrador"
            }
        });
    }
};


// =======================
// VERIFICAR TOKEN IMG
// =======================

let verificaTokenImg = (req, res, next) => {

    // Rescata el token de la URL

    let token = req.query.token;
   
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({

                ok: false,
                err: {
                    message: "Token no valido"
                }

            });
        }

        req.usuario = decoded.usuario;
        // El next ejecuta codigo siguiente
        next();

    });

}

module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
};