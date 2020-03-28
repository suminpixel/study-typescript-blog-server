import * as dotenv from 'dotenv';

dotenv.config();

//config object type 
type IConfig = {
  username: string,
  password: string,
  database: string,
  [key: string]: any,
};

interface IConfigGroup {
  development: IConfig;
  test: IConfig;
  production: IConfig;
}

const config: IConfigGroup = {
  development: {
    username: 'root',
    password: process.env.DB_PASSWORD!,
    database: 'suminblog',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: process.env.DB_PASSWORD!,
    database: 'suminblog',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: process.env.DB_PASSWORD!,
    database: 'suminblog',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};

export default config;