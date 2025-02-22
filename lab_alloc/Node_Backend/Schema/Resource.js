import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Lab from "./Lab.js";

const Resource = sequelize.define(
  "Resource",
  {
    resource_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    lab_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Lab,
        key: "lab_id",
      },
    },
    type: {
      type: DataTypes.ENUM("i3", "i5", "i7"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Available", "Allocated", "Under Maintenance"),
      defaultValue: "Available",
    },
  },
  {
    timestamps: true,
  }
);

// Define relationships
Lab.hasMany(Resource, { foreignKey: "lab_id", onDelete: "CASCADE" });
Resource.belongsTo(Lab, { foreignKey: "lab_id" });

export default Resource;
