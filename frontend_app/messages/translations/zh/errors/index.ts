/* eslint-disable max-len */
import sessions from './sessions';
import username from './username';
import password from './password';
import newSubmission from './newSubmission';

export default [
  ...sessions,
  ...username,
  ...password,
  ...newSubmission,
  {
    id: 'errors.unexpected',
    defaultMessage: '操作错误，请重试。',
  },
  {
    id: 'errors.required',
    defaultMessage: '必填',
  },
  {
    id: 'errors.invalidEmail',
    defaultMessage: '邮箱地址无效',
  },
  {
    id: 'errors.noneFound',
    defaultMessage: '查找不到',
  },
];
