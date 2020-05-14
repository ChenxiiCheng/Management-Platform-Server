import { Router } from 'express';
import {
  createInvoice,
  getHomeInvoiceById,
} from '../controllers/invoice.conntroller';

const router = Router();

router.post('/:id', createInvoice); // 用户为某个home保险付款
router.get('/:id', getHomeInvoiceById); // 获取该home保险的所有invoice记录

export default router;
