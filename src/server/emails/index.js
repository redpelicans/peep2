import R from 'ramda';
import nodemailer from 'nodemailer';
import mg from 'nodemailer-mailgun-transport';
import initEvents from './events';

const mailDefaultOptions = {
  from: 'Peep peep dont sleep<peep@redpelicans.com>',
};

const fakeSendMail = () => Promise.resolve();

const sendMail = mgOptions => {
  if (!mgOptions) return fakeSendMail;
  const transporter = nodemailer.createTransport(mg({ auth: mgOptions }));
  return mailOptions => {
    const promise = new Promise((resolve, reject) => {
      transporter.sendMail(
        { ...mailDefaultOptions, ...mailOptions },
        (err, res) => {
          if (err) return reject(err);
          resolve(res);
        },
      );
    });
    return promise;
  };
};

const allServices = [initEvents];

const init = ctx => {
  const { config: { mg } } = ctx;
  return R.reduce(
    (acc, service) => acc.then(service),
    Promise.resolve({ ...ctx, email: { sendMail: sendMail(mg) } }),
    allServices,
  );
};

export default init;
