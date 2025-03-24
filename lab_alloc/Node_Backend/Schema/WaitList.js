import { DataTypes } from "sequelize";
import sequelize from "./db_connection.js";
import Lab from "./Lab.js";

const Waitlist = sequelize.define(
  "Waitlist",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lab_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Lab, 
        key: "lab_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estimated_wait_time: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    notified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
  }
);


Waitlist.belongsTo(Lab, { foreignKey: "lab_id", as: "lab" });
Lab.hasMany(Waitlist, { foreignKey: "lab_id", as: "waitlist" });

export default Waitlist;
