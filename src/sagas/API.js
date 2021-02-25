import axios from 'axios';
import { create } from 'apisauce';

import { BASE_URL } from '../constants/global';

// const BASE_URL =
//   process.env.NODE_ENV === 'production'
//     ? 'https://api-dev.blogchiem.com/v1'
//     : 'http://localhost:3000/v1';

const getInstance = (env) => {
  console.log('BASE_URL', BASE_URL);
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    validateStatus(status) {
      return status >= 200 && status <= 503;
    },
  });

  const apisauceInstance = create({ axiosInstance: instance });
  return apisauceInstance;
};

const API = { instance: getInstance() };

API.login = (body) => {
  return API.instance.post('/auth/login', body);
};

API.getProfile = () => {
  return API.instance.get('/auth/me');
};

API.updatePassword = (body) => {
  return API.instance.put('/auth/update-password', body);
};

API.getUsers = (params) => {
  return API.instance.get('/user', params);
};

API.createUser = (body) => {
  return API.instance.post('/user', body);
};

API.updateUser = (params) => {
  return API.instance.put(`/user/${params.userId}`, params.body);
};

API.deleteUser = (userId) => {
  return API.instance.delete(`/user/${userId}`);
};

API.getGroups = () => {
  return API.instance.get('/group');
};

// API.updatePassword = (body) => {
//   return API.instance.post('auth/update-password', body);
// };

// API.get2FASecret = () => {
//   return API.instance.get('auth/2fa/g-authenticator');
// };

// API.set2FACode = (body) => {
//   return API.instance.post('auth/2fa/g-authenticator', body);
// };

// API.remove2FACode = (body) => {
//   return API.instance.delete('auth/2fa/g-authenticator', {}, { data: body });
// };

// API.getListUser = (params) => {
//   return API.instance.get('/users/list', params);
// };

// API.getListChild = () => {
//   return API.instance.get('/users/children');
// };

// API.createUser = (body) => {
//   return API.instance.post('/users/create', body);
// };

// API.adminDisable2FA = (id, body) => {
//   return API.instance.patch(`/users/${id}`, body);
// };

// /** Admin dừng hoặc mở đặt cược */
// API.adminSuspendUser = (body) => {
//   return API.instance.put(`/users/suspend`, body);
// };

// API.adminUnsuspendUser = (body) => {
//   return API.instance.put(`/users/unsuspend`, body);
// };

// /** Admin đóng hoặc mở tài khoản */
// API.adminBlockUser = (body) => {
//   return API.instance.put(`/users/block`, body);
// };

// API.adminUnblockUser = (body) => {
//   return API.instance.put(`/users/unblock`, body);
// };

// /** Admin cập nhật mật khẩu của user */
// API.adminUpdatePasswordUser = (params) => {
//   return API.instance.put(`/users/${params.id}/password`, params.body);
// };

// /** Admin yêu cầu OTP */
// API.adminRequireOTP = (body) => {
//   return API.instance.put(`/users/otp_required`, body);
// };

// API.adminRemoveRequireOTP = (body) => {
//   return API.instance.put(`/users/remove_otp_required`, body);
// };
// /** Admin tắt yêu cầu OTP khi đăng nhập */
// API.adminRemoveRequireOTPLogin = (body) => {
//   return API.instance.put(`/users/disable_otp`, body);
// };

// /** Admin cập nhật thông tin của user */
// API.adminUpdateProfileUser = (params) => {
//   return API.instance.put(`/users/${params.id}/profile`, params.body);
// };

// /** Tìm lớp cha của user */
// API.getAncestorUser = (params) => {
//   return API.instance.get(`/users/${params.id}/ancestors`);
// };

// /** Tìm lớp cha của user */
// API.getAncestorUser = (params) => {
//   return API.instance.get(`/users/${params.id}/ancestors`);
// };

// /** Lấy danh sách game */
// API.getListGame = () => {
//   return API.instance.get('/gameTypes');
// };

// /** Lấy bảng giá */
// API.getListNumberAgent = (boby) => {
//   return API.instance.post('/agentNumbers/list', boby);
// };

// /** Lấy danh sách chọn nhanh */
// API.getChoiceOptions = () => {
//   return API.instance.get('/choiceOptions');
// };

// /** Cập nhật giá của một hoặc nhiều số */
// API.updateNumbersAgent = (body) => {
//   return API.instance.put('/agentNumbers', body);
// };

export default API;
