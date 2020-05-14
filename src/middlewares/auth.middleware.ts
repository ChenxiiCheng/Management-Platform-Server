import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import { IUser } from '../controllers/auth.controller';

interface UserRequest extends Request {
  user?: IUser;
  username?: string;
  role?: string;
}

interface IPayload {
  username?: string;
  role?: string;
}

export const protect = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  let token;
  let decoded: IPayload;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      msg: 'Not authorized to access this route',
    });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET as string);

    if (decoded) {
      const { username, role } = decoded as IPayload;
      // req.user = (await getRepository(User).findOne({
      //   where: { username },
      // })) as User;
      req.username = username;
      req.role = role;
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      msg: 'Not authorized to access this route',
    });
  }
};
