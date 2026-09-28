const auhService = require('../services/authService');

async function cadastrarUsuario(req, res) {
    try {
        const usuario = await authService.cadastrarUsuario(req.body);
        res.status(201).json(usuario);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
}

async function login(req, res) {
    try {
        const { email, senha } = req.body;
        const { token, usuario } = await authService.login(email, senha);
        res.json({ token, usuario });
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
}

module.exports = {
    cadastrarUsuario,
    login
};