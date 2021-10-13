import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';
import { transfer } from './runtime/handleTransfer.js'
import { transact } from './runtime/handleTransact.js'

console.log('starting app in ' + process.env.NODE_ENV)

async function connect() {
  try {
      await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    } catch (error) {
      console.log(error)
    }
}

connect()
transfer.start()
transact.start()

import {notFound, errorHandler} from './middlewares.mjs';
import api from './api/index.mjs';

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄'
  });
});

app.use('/api/v1', api);

app.use(notFound);
app.use(errorHandler);

export default app
