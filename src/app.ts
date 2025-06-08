import express from 'express';

import morgan from 'morgan';
import routes from './api/routes';
import { standardResponse } from './middlewares/standardResponse';

const app = express();
app.use(express.json());
app.use(standardResponse);
app.use(morgan('dev'));

app.use(morgan('dev'));

app.use('/api', routes);

export default app;
