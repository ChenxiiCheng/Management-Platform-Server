import { Router } from 'express';
import {
  getUsers,
  delUserByUsername,
  updateUsername,
} from '../controllers/user.controller';

const router = Router();

router.get('/', getUsers); // 获取全部用户
router.put('/:id', updateUsername); // 管理员：更新某个用户的username
router.delete('/:username/:role', delUserByUsername); // 管理员：删除用户 by user id

export default router;
