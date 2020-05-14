import { Router } from 'express';
import { login, register, logout } from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', login); // 用户登录接口
router.post('/register', register); // 用户注册接口
router.get('/logout', logout); // 用户登出接口

export default router;
