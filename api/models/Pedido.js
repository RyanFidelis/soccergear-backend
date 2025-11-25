import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Pedido = sequelize.define('Pedido', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  itens: {
    type: DataTypes.JSON, // Armazena o array de produtos comprados
    allowNull: false,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  metodo: {
    type: DataTypes.STRING,
    allowNull: false, // pix, cartao, boleto
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'aguardando', // aguardando, aprovado, rejeitado
  },
  dataPedido: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
});

// Relacionamento: Um Pedido pertence a um Usuário
Pedido.belongsTo(User, { foreignKey: 'userId', as: 'cliente' });
User.hasMany(Pedido, { foreignKey: 'userId' });

export default Pedido;