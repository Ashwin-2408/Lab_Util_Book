import { DataTypes } from "sequelize";
import sequelize from "./db_connection.js";
import Resource from "./Resource.js";

const ResourceRequest = sequelize.define("ResourceRequest", {
  request_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  resource_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Resource,
      key: "resource_id",
    },
  },
  status: {
    type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
    defaultValue: "Pending",
  },
});

export default ResourceRequest;
