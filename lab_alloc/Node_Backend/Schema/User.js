import { DataTypes } from "sequelize";
import sequelize from "./db_connection.js";

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.ENUM("Admin", "Faculty", "Student"),
      defaultValue: "Student",
    },
  },
  {
    timestamps: true,
  }
);

export default User;
