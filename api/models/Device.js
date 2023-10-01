import { sequelize } from "./sequelize.js";
import { DataTypes, Model } from "@sequelize/core";

class Device extends Model {}

Device.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    description: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    macAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // mac_address: {
    //   type: DataTypes.VIRTUAL,
    //   get() {
    //     return this.macAddress;
    //   },
    //   set(value) {
    //     this.setDataValue("macAddress", value);
    //   },
    // },
    address: {
      type: DataTypes.JSON,
    },
    hostnames: {
      type: DataTypes.STRING,
    },
    vendor: {
      type: DataTypes.STRING,
    },
    ports: {
      type: DataTypes.JSON,
    },
    os: {
      type: DataTypes.JSON,
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

export default Device;
