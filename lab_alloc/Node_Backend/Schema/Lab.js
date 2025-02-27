import { DataTypes } from "sequelize";
import sequelize from "./db_connection.js";
import Resource from "./Resource.js";

const Lab = sequelize.define(
  "Lab",
  {
    lab_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    lab_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_systems: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    available_systems: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  }
);


export default Lab;
