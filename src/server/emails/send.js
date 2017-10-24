import nodemailer from 'nodemailer';
import mg from 'nodemailer-mailgun-transport';

const transporter = nodemailer.createTransport(
  mg({
    auth: {
      api_key: 'key-5ce6a1cfa233a3d2de83aca7214626aa',
      domain: 'mg.redpelicans.com',
    },
  }),
);

const mailOptions = {
  from: 'Peep peep dont sleep<peep@redpelicans.com>',
};

export const sendMail = options => {
  const promise = new Promise((resolve, reject) => {
    transporter.sendMail({ ...mailOptions, ...options }, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
  return promise;
};
