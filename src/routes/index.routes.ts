import { request, response, Router } from 'express';
import { indexWelcome, stopProcess } from '../controllers/index.controllers';
import { body, validationResult } from 'express-validator';

export var DEBUG: any = true;
const router = Router();

router.get('/api', indexWelcome);
router.post('/api/stop/', stopProcess);

export default router;  