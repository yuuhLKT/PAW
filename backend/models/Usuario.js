const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    senha: {
        type: String,
        required: true,
    },
    imagem: {
        type: String,
        required: false,
    },
    admin: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Usuario', UsuarioSchema);