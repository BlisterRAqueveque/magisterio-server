//! Inject config module
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { envs } from './envs';
dotenv.config();

export const dbConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: envs.db_host,
  port: envs.db_port,
  username: envs.db_user,
  password: envs.db_pass,
  database: envs.db,
  entities: [],
  autoLoadEntities: true, //! Loads entities
  synchronize: true, //! Synchronize all tables (entities)
};
