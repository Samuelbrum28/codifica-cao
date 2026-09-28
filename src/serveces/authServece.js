const bycript = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Usuario = require('../model/Usuario')

async function cadastrarUsuario(dados) {
    const { nome, email, senha } = dados
    if (!nome || !email || !senha) {
        const error = new Error('Todos os campos são obrigatórios')
        error.status = 400
        throw error
    }
    const usuarioExistente = await Usuario.findOne({ where: { email } })
    if (usuarioExistente) {
        const error = new Error('Usuário já cadastrado')
        error.status = 400
        throw error
    }
    const senhaHash = await bycript.hash(senha, 10)
    const novoUsuario = await Usuario.create({
        nome,
        email,
        senha: senhaHash
    })
    return{
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email
    }
}
async function login(email, senha) {
    const usuario = await Usuario.findOne({ where: { email } })
    if (!usuario) {
        const error = new Error('Email ou senha inválidos')
        error.status = 401
        throw error
    }
    const senhaValida = await bycript.compare(senha, usuario.senha)
    if (!senhaValida) {
        const error = new Error('Senha inválida')
        error.status = 401
        throw error
    }
    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '5h' })
    return { token,
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        }

     }
}

module.exports = {
    cadastrarUsuario,
    login
}
