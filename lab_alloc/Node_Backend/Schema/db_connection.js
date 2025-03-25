import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.password);

const sequelize = new Sequelize(
  process.env.database,
  process.env.DB_Username,
  process.env.password,
  {
    host: process.env.host,
    dialect: process.env.dialect || "mysql",
    dialectOptions: {
      charset: "utf8mb4", // Change 'cesu8' to 'utf8mb4'
    },
  }
);

export const check_connection = async () => {
  try {
    await sequelize.authenticate();
    console.log({ LOG: "Connection successful" });
  } catch (err) {
    console.log({ ERR: err });
  }
};

check_connection();

export default sequelize;
