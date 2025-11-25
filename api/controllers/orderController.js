import Pedido from '../models/Pedido.js';
import User from '../models/User.js';
import VendasDiarias from '../models/VendasDiarias.js';

// 1. Criar Pedido (Pagamento)
export const createOrder = async (req, res) => {
  try {
    console.log("📥 Recebendo pedido:", req.body); // LOG PARA DEBUG

    const { cliente, itens, total, metodo } = req.body;
    
    // Validação rigorosa
    if (!cliente || !cliente.id) {
      console.error("❌ Erro: Cliente sem ID ou inválido.");
      return res.status(400).json({ message: "Usuário não identificado. Faça login novamente." });
    }

    // Garante que o total seja número
    const totalNumerico = parseFloat(total);

    const novo = await Pedido.create({
      userId: cliente.id,
      itens: itens, // Sequelize converte array p/ JSON automaticamente
      total: totalNumerico,
      metodo,
      status: 'aguardando'
    });

    console.log("✅ Pedido criado com ID:", novo.id);
    return res.status(201).json({ sucesso: true, pedido: novo });
  } catch (error) {
    console.error("❌ Erro ao criar pedido:", error);
    return res.status(500).json({ sucesso: false, message: "Erro interno ao salvar pedido." });
  }
};

// 2. Listar Todos (Dashboard)
export const getAllOrders = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [{ model: User, as: 'cliente', attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']]
    });
    return res.status(200).json(pedidos);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return res.status(500).json([]);
  }
};

// 3. Aprovar/Rejeitar (Dashboard)
export const updateStatus = async (req, res) => {
  try {
    const { id, status } = req.params; 
    const novoStatus = status === 'aprovar' ? 'aprovado' : 'rejeitado';
    
    console.log(`🔄 Atualizando pedido ${id} para: ${novoStatus}`);

    const pedido = await Pedido.findByPk(id, { include: [{ model: User, as: 'cliente' }] });
    if (!pedido) return res.status(404).json({ message: "Pedido não encontrado" });

    // Se aprovar, dá pontos e atualiza vendas diárias
    if (novoStatus === 'aprovado' && pedido.status !== 'aprovado') {
      if (pedido.cliente) {
        pedido.cliente.pontos += Math.floor(pedido.total / 10);
        await pedido.cliente.save();
      }

      const hoje = new Date().toISOString().split('T')[0];
      const [dia] = await VendasDiarias.findOrCreate({
        where: { data: hoje },
        defaults: { valorTotal: 0, quantidadePedidos: 0 }
      });
      dia.valorTotal += pedido.total;
      dia.quantidadePedidos += 1;
      await dia.save();
    }

    pedido.status = novoStatus;
    await pedido.save();
    
    console.log("✅ Status atualizado com sucesso!");
    return res.json({ sucesso: true });
  } catch (error) {
    console.error("Erro no updateStatus:", error);
    return res.status(500).json({ message: "Erro ao atualizar" });
  }
};

// 4. Dados do Gráfico
export const getChartData = async (req, res) => {
  try {
    const dados = await VendasDiarias.findAll({ order: [['data', 'ASC']] });
    const formatados = dados.map(d => ({
      label: d.data.split('-').reverse().join('/'),
      value: d.valorTotal
    }));
    return res.json(formatados);
  } catch (error) {
    return res.json([]);
  }
};

// 5. Meus Pedidos (CORRIGIDO PARA O SITE)
export const getOrdersByClient = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔎 Buscando pedidos do cliente ID: ${id}`);

    const pedidos = await Pedido.findAll({
      where: { userId: id },
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json(pedidos);
  } catch (error) {
    console.error("Erro ao buscar meus pedidos:", error);
    return res.status(500).json([]);
  }
};