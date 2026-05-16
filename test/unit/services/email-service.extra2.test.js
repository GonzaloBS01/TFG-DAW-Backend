import nodemailer from 'nodemailer';
import logger from '../../../src/utils/logger.js';
import * as emailService from '../../../src/services/email/email-service.js';

jest.mock('nodemailer', () => ({
  __esModule: true,
  default: {
    createTransport: jest.fn(),
  },
}));

jest.mock('../../../src/utils/logger.js', () => ({
  __esModule: true,
  default: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

describe('email-service extra branches', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset module state so transporter is fresh
    jest.resetModules();
  });

  it('initMailer propaga si nodemailer.createTransport lanza', () => {
    const nodemailerModule = require('nodemailer');
    nodemailerModule.default.createTransport.mockImplementation(() => { throw new Error('transport fail'); });
    const { initMailer } = require('../../../src/services/email/email-service.js');

    expect(() => initMailer({ email: 'a', password: 'b' })).toThrow('transport fail');
  });

  it('sendEmail lanza si transporter.sendMail falla', async () => {
    const nodemailerModule = require('nodemailer');
    const transporter = { sendMail: jest.fn().mockRejectedValue(new Error('send fail')) };
    nodemailerModule.default.createTransport.mockReturnValue(transporter);

    const { initMailer, sendEmail } = require('../../../src/services/email/email-service.js');
    initMailer({ email: 'a', password: 'b' });

    await expect(sendEmail({ to: 'x@y' })).rejects.toThrow('send fail');
  });
});
