import app from '@src/app';
import { HTTP_PORT } from '@config/constants';
import { logger } from '@utils/logger';
import { runMARL } from './algorithms/marl';

app.listen(HTTP_PORT, () => {
  logger.info(`Listening on port ${HTTP_PORT}`);
  console.log(runMARL());
});
