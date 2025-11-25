import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

// ... (register e login continuam iguais, vou focar nas mudanças) ...

// 1. REGISTRO
export const register = async (req, res) => {
  try {
    const { name, email, password, telefone, dataNascimento } = req.body;
    if (!name) return res.status(400).json({ message: 'Nome obrigatório' });
    
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: 'Email já cadastrado' });

    const newUser = await User.create({ name, email, password, telefone, dataNascimento });
    return res.status(201).json({ message: 'Criado', user: newUser });
  } catch (e) { return res.status(500).json({ message: 'Erro' }); }
};

// 2. LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Inválido' });
    }
    return res.json({ message: 'OK', user });
  } catch (e) { return res.status(500).json({ message: 'Erro' }); }
};

// 3. ATUALIZAR (Com Limpeza de Imagem)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, telefone, time, foto, pontos, dataNascimento } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Não encontrado' });

    // Atualiza dados
    if (name) user.name = name.trim();
    if (email) user.email = email;
    if (telefone) user.telefone = telefone;
    if (time) user.time = time;
    if (dataNascimento) user.dataNascimento = dataNascimento;
    if (pontos !== undefined) user.pontos = pontos;

    // --- LIMPEZA DA FOTO ANTES DE SALVAR NO BANCO ---
    if (foto) {
        // Remove quebras de linha que corrompem o arquivo
        user.foto = foto.replace(/(\r\n|\n|\r)/gm, "").trim();
    }

    await user.save();
    return res.json({ message: 'Atualizado!', user });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar' });
  }
};

export const getAllClients = async (req, res) => {
    const users = await User.findAll();
    res.json(users);
};

// --- 4. BUSCAR DADOS COMPLETOS DO BANCO (Header usa isso) ---
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    // Busca no banco pelo ID. O retorno inclui a foto gigante completa.
    const user = await User.findByPk(id);
    
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
    
    return res.json(user);
  } catch (error) {
    console.error("Erro getUserById:", error);
    return res.status(500).json({ message: "Erro interno" });
  }
};