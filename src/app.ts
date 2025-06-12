import express from 'express';
import swaggerUi from 'swagger-ui-express';

import morgan from 'morgan';
import routes from './api/routes';
import { swaggerSpec } from './configs/swagger';
import { standardResponse } from './middlewares/standardResponse';
import { apiKeyAuth } from './middlewares/apiKeyAuth';

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(standardResponse);
app.use(apiKeyAuth);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', routes);

export default app;
