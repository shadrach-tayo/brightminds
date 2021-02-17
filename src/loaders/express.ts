import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import compression from 'compression';
import { stream } from '../utils/logger';
import express from 'express';

function expressLoader(app) {
  if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined', { stream }));
    app.use(cors());
    app.use(cors({ origin: true, credentials: false })); // remove this line before production
    // app.options('*', cors());
  } else if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev', { stream }));
    app.use(cors({ origin: true, credentials: true }));
    // app.options('*', cors());
  }

  app.use(hpp());
  app.use(helmet());
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  return;
}

export default expressLoader;
