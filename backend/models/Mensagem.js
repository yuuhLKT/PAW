const mongoose = require('mongoose')

const MensagemSchema = new mongoose.Schema({
    texto: {
        type: String,
        required: true,
    },

    autorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
})

module.exports = mongoose.model('Mensagem', MensagemSchema);