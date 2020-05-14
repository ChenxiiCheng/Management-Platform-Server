import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';

/**
 * @desc   获取数据库中的所有用户
 * @route  GET /users
 * @access Private
 * @param req
 * @param res
 */
export const getUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const users = await getRepository(User).find();
  return res.status(200).json({
    msg: 'success',
    data: users,
  });
};

/**
 * @desc   管理员：更新某个用户的用户名
 * @route  PUT /users/:id  req.body = {新的username}
 * @access Private
 * @param req
 * @param res
 */
export const updateUsername = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    const user = (await getRepository(User).findOne({ where: { id } })) as User;
    user.username = username;
    const newUser = await getRepository(User).save(user);

    return res.status(200).json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Server Error',
    });
  }
};

/**
 * @desc   删除数据库中的某个用户
 * @route  DELETE /users/:id
 * @access Private
 * @param req
 * @param res
 */
interface IReq extends Request {
  username?: string;
  role?: string;
}
export const delUserByUsername = async (
  req: IReq,
  res: Response
): Promise<Response> => {
  const { username, role } = req.params;

  console.log(username, role);

  if (role !== 'admin') {
    return res.status(401).json({
      success: false,
      msg: 'You do not have permissions to delete user',
      data: {},
    });
  }

  try {
    const result = await getRepository(User).delete({ username });

    return res.status(200).json({
      success: true,
      msg: 'success',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Server Error',
      data: {},
    });
  }
};
