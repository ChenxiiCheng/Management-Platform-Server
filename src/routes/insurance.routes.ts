import { Router } from 'express';
import {
  createInsuranceByUsername,
  getInsuranceByUsername,
  updateHomeInsuranceById,
  updateAutoInsuranceById,
  getInsuranceById,
  createAutoInsurance,
  getAllInsuByAdminUser,
  adminDeleteHome,
  adminDeleteAuto,
} from '../controllers/insurance.controller';
// import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.post('/:username/home', createInsuranceByUsername); // 当前登录用户 新增Home保险单
router.post('/:username/auto', createAutoInsurance); // 当前登录用户 新增Auto保险单
router.get('/:username/insurance', getInsuranceByUsername); // 获取当前登录用户的所有保险
router.get('/insurance/:id', getInsuranceById); // 获取保险 通过 保险单id
router.put('/home/:id', updateHomeInsuranceById); // 更新Home保险
router.put('/auto/:id', updateAutoInsuranceById); // 更新Auto保险
router.get('/insurances', getAllInsuByAdminUser); // 管理员：获取所有的保险记录
router.delete('/home/:id', adminDeleteHome); // 管理员：删除某个Home保险
router.delete('/auto/:id', adminDeleteAuto); // 管理员：删除某个Auto保险

export default router;
