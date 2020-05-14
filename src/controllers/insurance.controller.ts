import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import moment from 'moment';
import { User } from '../entities/User';
import { IUser } from './auth.controller';
import { Home } from '../entities/Insurance';
import { Auto } from '../entities/Auto';

interface UserRequest extends Request {
  user?: IUser;
  username?: string;
  role?: string;
}

/**
 * @desc  获取该用户的所有保险
 * @route POST /username/insurance 前端请求的时候把username带过来
 * @access Private
 * @param {* Object} req
 * @param res
 */
export const getInsuranceByUsername = async (
  req: UserRequest,
  res: Response
): Promise<Response> => {
  try {
    let reqUsername = req.params.username;

    console.log(reqUsername);

    const userInfo = await getRepository(User).findOne({
      where: { username: reqUsername },
    });

    const resultHome = await getRepository(Home).find({
      where: { firstName: reqUsername },
    });

    const resultAuto = await getRepository(Auto).find({
      where: { username: reqUsername },
    });

    console.log(resultAuto);

    return res.status(200).json({
      success: true,
      home: resultHome,
      auto: resultAuto,
      user: userInfo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Server Error',
    });
  }
};

/**
 * @desc  登录用户创建Home类型保险订单
 * @route POST /:username/home 前端请求的时候把username带过来
 * @access Private
 * @param {* Object} req
 * @param res
 */
export const createInsuranceByUsername = async (
  req: UserRequest,
  res: Response
): Promise<Response> => {
  const {
    firstName,
    lastName,
    address,
    gender,
    marital_status,
    customer_type,
    start_date,
    end_date,
    home_purchase_date,
    home_purchase_value,
    home_area,
    type_home,
    factors,
    swimming_pool,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !address ||
    !gender ||
    !marital_status ||
    !customer_type ||
    !start_date ||
    !end_date ||
    !home_purchase_date ||
    !home_purchase_value ||
    !home_area ||
    !type_home
  ) {
    return res.status(422).json({
      success: false,
      msg: 'Please provide all the required information.',
    });
  }

  try {
    // 处理下字段 加上insurance_status和premium_amount字段
    let newInsu = { ...req.body };
    let totalCount = 0;
    newInsu.insurance_status = 'C';

    if (swimming_pool) {
      if (swimming_pool === 'U') {
        totalCount += 1000;
      } else if (swimming_pool === 'O') {
        totalCount += 1500;
      } else if (swimming_pool === 'I') {
        totalCount += 1200;
      } else if (swimming_pool === 'M') {
        totalCount += 3000;
      }
    }

    if (factors) {
      (factors as string[]).forEach((item) => {
        if (item === 'Auto Fire Notification') {
          totalCount += 3000;
        } else if (item === 'Home Security System') {
          totalCount += 2000;
        } else {
          totalCount += 1500;
        }
      });
    }

    newInsu.premium_amount = totalCount;

    newInsu.start_date =
      moment(start_date).format('YYYY-MM-DD') +
      ' ' +
      moment(start_date).format('h:mm:ss');
    newInsu.end_date =
      moment(end_date).format('YYYY-MM-DD') +
      ' ' +
      moment(end_date).format('h:mm:ss');
    newInsu.home_purchase_date =
      moment(home_purchase_date).format('YYYY-MM-DD') +
      ' ' +
      moment(home_purchase_date).format('h:mm:ss');

    let insurance = await getRepository(Home).create({
      ...newInsu,
    } as Object);
    insurance = await getRepository(Home).save(insurance);

    // 不使用protect校验路由了，直接前端登录时把返回数据里的username存在本地，请求的时候带过来
    const loginedUsername = req.params.username;
    const userInsurances = await getRepository(User).findOne({
      where: { username: loginedUsername },
      relations: ['home'],
    });
    userInsurances?.home.push(insurance);

    await userInsurances?.save();

    return res.status(201).json({
      success: true,
      data: userInsurances,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Server Error',
    });
  }
};

/**
 * @desc  登录用户创建Auto类型保险订单
 * @route POST /:username/auto 前端请求的时候把username带过来
 * @access Private
 * @param {* Object} req
 * @param res
 */
export const createAutoInsurance = async (
  req: UserRequest,
  res: Response
): Promise<Response> => {
  const {
    username,
    vehicle_vin,
    make_model_year,
    status_vehicle,
    customer_type,
    start_date,
    end_date,
    amount,
  } = req.body;

  if (
    !vehicle_vin ||
    !make_model_year ||
    !status_vehicle ||
    !customer_type ||
    !start_date ||
    !end_date ||
    !amount
  ) {
    return res.status(422).json({
      success: false,
      msg: 'Please provide all the required information.',
    });
  }

  try {
    // 处理下字段 加上insurance_status和premium_amount字段
    let newInsu = { ...req.body };
    newInsu.insurance_status = 'C';
    newInsu.amount = amount;

    newInsu.start_date =
      moment(start_date).format('YYYY-MM-DD') +
      ' ' +
      moment(start_date).format('h:mm:ss');
    newInsu.end_date =
      moment(end_date).format('YYYY-MM-DD') +
      ' ' +
      moment(end_date).format('h:mm:ss');

    let insurance = await getRepository(Auto).create({
      ...newInsu,
    } as Object);

    insurance = await getRepository(Auto).save(insurance);

    // 不使用protect校验路由了，直接前端登录时把返回数据里的username存在本地，请求的时候带过来
    const userInsurances = await getRepository(User).findOne({
      where: { username },
      relations: ['auto'],
    });
    userInsurances?.auto.push(insurance);

    await userInsurances?.save();

    return res.status(201).json({
      success: true,
      data: userInsurances,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Server Error',
    });
  }
};

/**
 * @desc  获取用户的单个保险单by id，id前端传过来
 * @route GET /insurance/:id
 * @access Private
 * @param {* Object} req
 * @param res
 */
export const getInsuranceById = async (
  req: UserRequest,
  res: Response
): Promise<Response> => {
  try {
    let id = req.params.id;
    const resultHome = await getRepository(Home).findOne({
      where: { id },
    });

    const resultAuto = await getRepository(Auto).findOne({
      where: { id },
    });

    const result = { ...resultHome, ...resultAuto };

    if (result) {
      return res.status(200).json({
        success: true,
        data: result,
      });
    }

    return res.status(400).json({
      success: false,
      msg: 'Insurance ID does not exists.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Server Error',
    });
  }
};

/**
 * @desc  更新用户Home的保险单by id，id前端传过来
 * @route POST /insu/home/:id 前端请求的时候把username带过来
 * @access Private
 * @param {* Object} req
 * @param res
 */
interface IBody {
  address: string;
  gender: string;
  marital_status: string;
  customer_type: string;
  premium_amount: number;
  home_purchase_value?: number;
  home_area?: number;
  type_home?: string;
}

export const updateHomeInsuranceById = async (
  req: UserRequest,
  res: Response
): Promise<Response> => {
  // const {
  //   address,
  //   gender,
  //   marital_status,
  //   customer_type,
  //   premium_amount,
  //   home_purchase_value,
  //   home_area,
  //   type_home,
  // } = req.body;

  try {
    const { id } = req.params;
    const {
      insurance_status,
      start_date,
      end_date,
      home_purchase_date,
      home_purchase_value,
      home_area,
      type_home,
    } = req.body;

    let insurance = await getRepository(Home).findOne({ where: { id } });

    if (!insurance) {
      return res.status(400).json({
        success: false,
        msg: 'Insurance does not exists.',
      });
    }

    let new_insurance_status = '';

    if (insurance_status === 'Current') {
      new_insurance_status = 'C';
    } else {
      new_insurance_status = 'P';
    }

    const newBody = {
      new_insurance_status,
      start_date,
      end_date,
      home_purchase_date,
      home_purchase_value,
      home_area,
      type_home,
    };

    await getRepository(Home).merge(insurance, newBody);

    const result = await getRepository(Home).save(insurance);

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Server Error',
    });
  }
};

/**
 * @desc  更新用户Auto的保险单by id，id前端传过来
 * @route POST /insu/auto/:id
 * @access Private
 * @param {* Object} req
 * @param res
 */
interface IAutoBody {
  insurance_status: string;
  start_date: string;
  end_date: string;
}

export const updateAutoInsuranceById = async (
  req: UserRequest,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const {
      insurance_status,
      make_model_year,
      start_date,
      end_date,
    } = req.body;
    let insurance = await getRepository(Auto).findOne({ where: { id } });

    if (!insurance) {
      return res.status(400).json({
        success: false,
        msg: 'Insurance does not exists.',
      });
    }

    let new_insurance_status = '';
    let new_make_model_year = '';
    let new_start_date = '';
    let new_end_date = '';

    if (insurance_status === 'Current') {
      new_insurance_status = 'C';
    } else {
      new_insurance_status = 'P';
    }

    new_make_model_year =
      moment(make_model_year).format('YYYY-MM-DD') +
      ' ' +
      moment(make_model_year).format('h:mm:ss');

    new_start_date =
      moment(start_date).format('YYYY-MM-DD') +
      ' ' +
      moment(start_date).format('h:mm:ss');

    new_end_date =
      moment(end_date).format('YYYY-MM-DD') +
      ' ' +
      moment(end_date).format('h:mm:ss');

    insurance.make_model_year = new_make_model_year;
    insurance.insurance_status = insurance_status;
    insurance.start_date = new_start_date;
    insurance.end_date = new_end_date;

    const result = await getRepository(Auto).save(insurance);

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Server Error',
    });
  }
};

/**
 * @desc  获取所有保险的记录
 * @route GET /insu/insurances
 * @access Private
 * @param {* Object} req
 * @param res
 */
export const getAllInsuByAdminUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const resultHome = await getRepository(Home).find();
    const resultAuto = await getRepository(Auto).find();

    return res.status(200).json({
      success: true,
      home: resultHome,
      auto: resultAuto,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Server Error',
    });
  }
};

/**
 * @desc   管理员删除某个HOME保险
 * @route  DELETE /home/:id
 * @access Private
 * @param req
 * @param res
 */
interface IReq extends Request {
  username?: string;
  role?: string;
}
export const adminDeleteHome = async (
  req: IReq,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const result = await getRepository(Home).delete(id);

    console.log('result = ', result);

    return res.status(200).json({
      success: true,
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

/**
 * @desc   管理员删除某个AUTO保险
 * @route  DELETE /auto/:id
 * @access Private
 * @param req
 * @param res
 */
interface IReq extends Request {
  username?: string;
  role?: string;
}
export const adminDeleteAuto = async (
  req: IReq,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const result = await getRepository(Auto).delete(id);

    console.log('result = ', result);

    return res.status(200).json({
      success: true,
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
