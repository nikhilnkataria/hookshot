import { Router } from 'express';

const router = Router();

router.get('/', (_, res) => {
  // res.send({ status: 'ok' });
  res.sendSuccess({}, 200);
});

export default router;
