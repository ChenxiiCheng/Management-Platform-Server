import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';

export interface IUser {
  id: number;
  username: string;
  password: string;
  role: string;
  created: string;
  updated: string;
  getSignedJwtToken: () => Promise<string>;
}

/**
 * @desc  登录接口, 通过Username查询用户，返回改用户的信息
 * @route GET /auth
 * @access Public
 * @param {username: string, password: string} req
 * @param res
 */
export const login = async (req: Request, res: Response): Promise<Response> => {
  const { username, password } = req.body;

  console.log(username, password);

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      msg: 'Please provide username and password',
    });
  }

  // 1. 根据username查用户
  const user = await getRepository(User).findOne({ where: { username } });

  if (!user) {
    return res.status(422).json({
      msg: 'User does not exist',
    });
  }

  // 2.用户存在 校验密码
  const isValid = await user.comparePassword(password);
  if (!isValid) {
    return res.status(422).json({
      success: false,
      msg: 'Password incorrect',
    });
  }
  // 3.返回token, 用户信息
  return sendTokenResponse(user, 200, res);
};

/**
 * @desc  用户注册接口
 * @route POST /auth
 * @access Public
 * @param {username: sting, password: string, role: 默认normal} req
 * @param res
 */
export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { username } = req.body;

    // 判断username是否已经存在
    const isExist = await getRepository(User).findOne({ username });

    if (isExist) {
      return res.status(422).json({
        success: false,
        msg: 'User already exists',
      });
    }

    const newUser = await getRepository(User).create({ ...req.body } as Object);
    const result = await getRepository(User).save(newUser);

    return sendTokenResponse(result, 201, res);
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Server Error',
    });
  }
};

/**
 * @desc   用户登出接口
 * @route  GET /auth/logout
 * @access Private
 * @param req
 * @param res
 */
export const logout = async (
  req: Request,
  res: Response
): Promise<Response> => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  return res.status(200).json({
    success: true,
    msg: 'user logout',
  });
};

// 使用cookie-parser 设置jwttoken
const sendTokenResponse = async (
  user: IUser,
  statusCode: number,
  res: Response
) => {
  // Create token
  const token = await user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIE_TOKEN as string) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  return res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    data: user,
  });
};
