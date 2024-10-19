// const {Sequelize, DataTypes} = require("sequelize");
// import 'dotenv/config';
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { Dialect, Sequelize } from "sequelize";
dotenv.config();

// console.log(process.env.DB_NAME,  process.env.DB_HOST, process.env.DB_PASS)
export const sequelize = new Sequelize(
    process.env.DB_NAME || 'coding_club',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || 'root',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: process.env.DB as Dialect || 'mysql',
    }
);

export const configs = {
    database: process.env.DB_NAME || 'coding_club',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'root',
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB as Dialect || 'mysql'
}

export const sendEmail = async (options: any) => {

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMPT_HOST,
            port: parseInt(process.env.SMPT_PORT || '587'),
            service: process.env.SMPT_SERVICE,
            secure: false,
            auth: {
                user: process.env.SMPT_MAIL,
                pass: process.env.SMPT_APP_PASS,
            },
        });
        const mailOptions = {
            from: process.env.SMPT_MAIL,
            to: options.to,
            subject: options.subject,
            text: options.message,
        };

        await transporter.sendMail(mailOptions);
    } catch (e) {
        console.log('error in smtp');
    }

};
