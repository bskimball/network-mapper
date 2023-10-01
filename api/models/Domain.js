import { sequelize } from "./sequelize.js";
import { DataTypes, Model } from "@sequelize/core";

class Domain extends Model {}

Domain.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.JSON,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "down",
    },
  },
  { sequelize, timestamps: false }
);

export default Domain;
