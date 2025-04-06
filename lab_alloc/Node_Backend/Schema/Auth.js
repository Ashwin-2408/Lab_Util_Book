import { DataTypes } from "sequelize";
import sequelize from "./db_connection.js";
import User from "./User.js";

const Auth = sequelize.define(
  "Auth",
  {
    auth_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'user_id',
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_login: {
      type: DataTypes.DATE,
    },
    token: {
      type: DataTypes.STRING,
    },
    token_expiry: {
      type: DataTypes.DATE,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  },
  {
    timestamps: true,
  }
);

// Establish relationship with User model
Auth.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

User.hasOne(Auth, {
  foreignKey: 'user_id'
});

export default Auth;