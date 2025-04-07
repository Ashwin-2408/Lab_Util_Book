import { DataTypes } from 'sequelize';
import sequelize from './db_connection.js';
import User from './User.js';
import BulkResourceAvailability from './BulkResourceAvailability.js';

const BulkRequest = sequelize.define('BulkRequest', {
  request_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  availability_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: BulkResourceAvailability,
      key: 'availability_id'
    }
  },
  requested_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  request_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

// Establish relationships
BulkRequest.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

BulkRequest.belongsTo(BulkResourceAvailability, {
  foreignKey: 'availability_id',
  as: 'resourceAvailability'
});

export default BulkRequest;