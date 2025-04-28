const express = require('express');
const router = express.Router();
const User = require('../models/Usuario');
const path = require('path');
const fs = require('fs');

function userRouter() {
    router.get('/', async (req, res) => {
        try {
            const users = await User.find();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar usuários' });
        }
    });

    router.post('/', async (req, res) => {
        try {
            const user = new User(req.body);
            await user.save();
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: 'Erro ao criar usuário' });
        }
    });

    router.post('/login', async (req, res) => {
        try {
            const { email, senha } = req.body;
            const user = await User.findOne({ email, senha });
            if (user){
                res.status(200).json({
                    message: 'Usuário habilitado a logar',
                });
            } else {
                res.status(401).json({ error: 'Credenciais inválidas' });
            }
        } catch (error) {
            res.status(401).json({ error: 'Credenciais inválidas' });
        }
    });

    router.get('/:id', async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            res.json(user);
        } catch (error) {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    });

    router.post('/upload/:id', async (req, res) => {
        try {
            if (!req.files || !req.files.imagem) {
                return res.status(400).json({ error: 'Nenhuma imagem enviada' });
            }

            const file = req.files.imagem;
            const fileName = Date.now() + path.extname(file.name);
            const dir = path.join(__dirname, '../../frontend/public/images');
            const filePath = path.join(dir, fileName);

            // Certifique-se de que o diretório existe
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir, { recursive: true });
            }

            await file.mv(filePath);

            const user = await User.findByIdAndUpdate(
                req.params.id,
                { imagem: `/images/${fileName}` },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            res.json(user);
        } catch (error) {
            console.error('Erro no upload:', error);
            res.status(400).json({ error: 'Erro ao fazer upload da imagem' });
        }
    });

    router.delete('/:id', async (req, res) => {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(204).json({ message: 'Usuário deletado com sucesso' });
        } catch (error) {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    });

    return router;
}

module.exports = userRouter;
