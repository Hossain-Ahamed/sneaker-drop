import express, { Request, Response } from 'express';
import router from './routes';
import { httpStatus } from './utils/http-status';
import { globalErrorHandler } from './middlewares/globalerrorhandler';
import { notFound } from './middlewares/not-found';

const app = express();

/* ------------ PARSERS ------------ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ------------ ROUTES ------------ */
app.use('/api/v1', router);

/* ------------ HEALTH CHECK ------------ */
app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.status(httpStatus.OK).json({ message: 'OK' });
});

/* ------------ 404 HANDLER ------------ */
app.use(notFound);

/* ------------ GLOBAL ERROR HANDLER ------------ */
app.use(globalErrorHandler);

export default app;
