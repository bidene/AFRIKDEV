import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as mysqlSchema from './schema.mysql.ts';

declare global {
  var _mysqlPool: mysql.Pool | undefined;
}

export const createMySqlPool = () => {
  if (!global._mysqlPool) {
    global._mysqlPool = mysql.createPool({
      host: process.env.MYSQL_HOST || '127.0.0.1',
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'afrikdev_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return global._mysqlPool;
};

export const mysqlPool = createMySqlPool();
export const mysqlDb = drizzle(mysqlPool, { schema: mysqlSchema, mode: 'default' });
