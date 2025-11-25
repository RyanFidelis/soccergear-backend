import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const VendasDiarias = sequelize.define('VendasDiarias', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  data: {
    type: DataTypes.STRING(10), // Formato YYYY-MM-DD
    allowNull: false,
    unique: true, // Não pode ter duas linhas para o mesmo dia
  },
  valorTotal: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  quantidadePedidos: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  }
});

export default VendasDiarias;