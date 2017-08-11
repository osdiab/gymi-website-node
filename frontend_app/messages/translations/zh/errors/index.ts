/**
 * Messages related to errors in the frontend application
 */

import newSubmission from 'frontend/messages/translations/zh/errors/newSubmission';
import password from 'frontend/messages/translations/zh/errors/password';
import sessions from 'frontend/messages/translations/zh/errors/sessions';
import username from 'frontend/messages/translations/zh/errors/username';

export default [
  ...sessions,
  ...username,
  ...password,
  ...newSubmission,
  {
    id: 'errors.unexpected',
    defaultMessage: '操作错误，请重试。'
  },
  {
    id: 'errors.required',
    defaultMessage: '必填'
  },
  {
    id: 'errors.invalidEmail',
    defaultMessage: '邮箱地址无效'
  },
  {
    id: 'errors.noneFound',
    defaultMessage: '查找不到'
  }
];
