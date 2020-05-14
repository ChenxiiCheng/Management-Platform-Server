import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import moment from 'moment';
import { Invoice } from '../entities/Invoice';
import { Home } from '../entities/Insurance';

/**
 * @desc   用户为保险单付款 保险单id
 * @route  POST /invoice/:id
 * @access Private
 * @param req
 * @param res
 */
export const createInvoice = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    let { end_date, payment_amount, payment_date } = req.body;

    // end_date = moment(end_date).format('YYYY-MM-DD');
    // payment_date = moment(payment_date).format('YYYY-MM-DD');
    // payment_amount = parseInt(payment_amount);

    // const newBody = {
    //   payment_amount,
    //   payment_due_date: end_date,
    //   payment_date,
    // };

    // const invoice = await getRepository(Invoice).create({
    //   ...newBody,
    // } as Object);

    // const result = await getRepository(Invoice).save(invoice);

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Server Error',
    });
  }
};

/**
 * @desc   根据home保险id 获取该home保险的所有home_invoice分期付款记录
 * @route  GET /invoice/:id
 * @access Private
 * @param req
 * @param res
 */
export const getHomeInvoiceById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const result = await getRepository(Home).find({
      where: { id },
      relations: ['home_invoice'],
    });

    return res.status(200).json({
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
