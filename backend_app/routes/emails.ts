import _ from 'lodash';
import nodemailer from 'nodemailer';
import emailValidator from 'email-validator';

import { ApplicationError } from '../errors';

const MAX_MESSAGE_LENGTH = 1000;
const MAX_NAME_LENGTH = 50;

const transporter = nodemailer.createTransport({
  host: process.env.GYMI_EMAIL_HOST,
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.GYMI_EMAIL_USERNAME,
    pass: process.env.GYMI_EMAIL_PASSWORD,
  },
});

export default {
  send: (req, res, next) => {
    const requiredFields = ['reason', 'sender', 'message', 'name'];
    if (_.compact(requiredFields.map(field => req.body[field])).length !== requiredFields.length) {
      next(new ApplicationError('Missing required fields', 400, { requiredFields }));
      return;
    }

    const { sender, reason, message, name } = req.body;
    if (!emailValidator.validate(sender)) {
      next(new ApplicationError('Invalid email', 400));
      return;
    }

    if (name.length > MAX_NAME_LENGTH) {
      next(new ApplicationError('Name too long', 400));
      return;
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      next(new ApplicationError('Message too long', 400));
      return;
    }

    const validReasons = ['general', 'press'];
    if (!validReasons.includes(reason)) {
      next(new ApplicationError('Invalid message reason', 400));
      return;
    }

    let receiver = null;
    let subject = null;
    switch (reason) {
      case 'press':
        subject = `GYMI WEBSITE: PRESS EMAIL FROM ${req.body.sender}`;
        receiver = 'info@gymiteam.com';
        break;
      case 'general':
        subject = `GYMI WEBSITE: GENERAL EMAIL FROM ${req.body.sender}`;
        receiver = 'hr@gymiteam.com';
        break;
      default:
        subject = `GYMI WEBSITE: ??? EMAIL FROM ${req.body.sender}`;
        receiver = 'hr@gymiteam.com';
    }

    const mailOptions = {
      from: `"${req.body.name}" <${req.body.sender}>`,
      to: receiver,
      subject,
      text: req.body.message,
    };

    transporter.sendMail(mailOptions).then(res.sendStatus(200)).catch(next);
  },
};
