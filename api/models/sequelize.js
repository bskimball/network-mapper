import { Sequelize } from "@sequelize/core";

const sequelize = new Sequelize("postgres", "postgres", "example", {
  host: "localhost",
  dialect: "postgres",
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { sequelize, testConnection };
