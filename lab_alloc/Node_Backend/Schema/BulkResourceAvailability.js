import { DataTypes } from 'sequelize';
import sequelize from './db_connection.js';
import Lab from './Lab.js';

const BulkResourceAvailability = sequelize.define('BulkResourceAvailability', {
  availability_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  lab_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Lab,
      key: 'lab_id'
    }
  },
  resource_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  total_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  available_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  pending_quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

export default BulkResourceAvailability;