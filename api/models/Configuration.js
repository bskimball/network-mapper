import { sequelize } from "./sequelize.js";
import { DataTypes, Model } from "@sequelize/core";

class Configuration extends Model {}

Configuration.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  { sequelize, timestamps: false }
);

export default Configuration;
