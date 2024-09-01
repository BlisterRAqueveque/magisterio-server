import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASS: string;
  DATABASE: string;
  JWT_SEED: string;
  NODEMAILER_USER: string;
  NODEMAILER_PASS: string;
  NODEMAILER_HOST: string;
  NODEMAILER_PORT: number;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_USER: joi.string().required(),
    DATABASE: joi.string().required(),
    JWT_SEED: joi.string().required(),
    NODEMAILER_USER: joi.string().required(),
    NODEMAILER_PASS: joi.string().required(),
    NODEMAILER_HOST: joi.string().required(),
    NODEMAILER_PORT: joi.number().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  db_host: envVars.DB_HOST,
  db_port: envVars.DB_PORT,
  db_user: envVars.DB_USER,
  db_pass: envVars.DB_PASS,
  db: envVars.DATABASE,
  jwt_seed: envVars.JWT_SEED,
  mail_user: envVars.NODEMAILER_USER,
  mail_pass: envVars.NODEMAILER_PASS,
  mail_host: envVars.NODEMAILER_HOST,
  mail_port: envVars.NODEMAILER_PORT,
};
