const express = require('express');
const router = express.Router();
const Message = require('../models/Mensagem');
const authMiddleware = require('../middlewares/auth.middleware');

function messageRouter() {
    // Todas as rotas de mensagens são protegidas
    router.use(authMiddleware);

    router.get('/', async (req, res) => {
        try {
            const messages = await Message.find().sort({ createdAt: -1 });
            res.json(messages);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar mensagens' });
        }
    });

    router.post('/', async (req, res) => {
        try {
            const message = new Message({
                texto: req.body.texto,
                autorId: req.userId,
                type: req.body.type || 'message'
            });
            await message.save();
            res.status(201).json(message);
        } catch (error) {
            res.status(400).json({ error: 'Erro ao criar mensagem' });
        }
    });

    router.get('/:id', async (req, res) => {
        try {
            const message = await Message.findById(req.params.id);
            res.json(message);
        } catch (error) {
            res.status(404).json({ error: 'Mensagem não encontrada' });
        }
    });

    router.put('/:id', async (req, res) => {
        try {
            const message = await Message.findById(req.params.id);
            if (!message) {
                return res.status(404).json({ error: 'Mensagem não encontrada' });
            }

            if (message.autorId.toString() !== req.userId) {
                return res.status(403).json({ error: 'Não autorizado' });
            }

            message.texto = req.body.texto;
            await message.save();
            res.json(message);
        } catch (error) {
            res.status(400).json({ error: 'Erro ao atualizar mensagem' });
        }
    });

    router.delete('/:id', async (req, res) => {
        try {
            const message = await Message.findById(req.params.id);
            if (!message) {
                return res.status(404).json({ error: 'Mensagem não encontrada' });
            }

            if (message.autorId.toString() !== req.userId) {
                return res.status(403).json({ error: 'Não autorizado' });
            }

            await Message.findByIdAndDelete(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: 'Erro ao deletar mensagem' });
        }
    });

    return router;
}

module.exports = messageRouter;