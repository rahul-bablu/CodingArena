require('ts-node/register');
const dotenv = require('dotenv')
dotenv.config();
const {configs} = require('../common.ts');
console.log(configs)
module.exports = {
  username: 'Manager',
  password: 'B1921117589v',
  database: 'coding_club',
  host: 'localhost',
  dialect: "mysql",
  port: 3306
};