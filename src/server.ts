import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { initQueues } from './workers/init';
import { PORT } from './configs/constants';

// const app = express();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  initQueues();
});
