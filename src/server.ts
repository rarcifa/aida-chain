import app from '@src/app';
import { HTTP_PORT } from '@config/constants';
import { logger } from '@helpers/logger';

app.listen(HTTP_PORT, () => {
  logger.info(`Listening on port ${HTTP_PORT}`);
});
