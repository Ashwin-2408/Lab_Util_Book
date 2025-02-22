import { DataTypes } from "sequelize";
import sequelize from "./db_connection.js";
import Resource from "./Resource.js";
import User from "./User.js";

const Allocation = sequelize.define(
  "Allocation",
  {
    allocation_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
    resource_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Resource,
        key: "resource_id",
      },
    },
    allocated_from: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    allocated_until: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "Pending",
        "Approved",
        "Rejected",
        "In Progress",
        "Completed"
      ),
      defaultValue: "Pending",
    },
  },
  {
    timestamps: true,
  }
);


User.hasMany(Allocation, { foreignKey: "user_id", onDelete: "CASCADE" });
Allocation.belongsTo(User, { foreignKey: "user_id" });

Resource.hasMany(Allocation, {
  foreignKey: "resource_id",
  onDelete: "CASCADE",
});
Allocation.belongsTo(Resource, { foreignKey: "resource_id" });

export default Allocation;
