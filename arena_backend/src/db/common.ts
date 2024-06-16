// const {Sequelize, DataTypes} = require("sequelize");
import { Sequelize, DataTypes, Dialect } from "sequelize";
import 'dotenv/config';

export const sequelize = new Sequelize(
    process.env.DB_NAME || 'coding_club',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || 'root',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: process.env.DB as Dialect || 'mysql',
    }
);
