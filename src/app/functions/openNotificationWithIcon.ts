import { notification } from 'antd';
import i18next from 'i18next';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';
const openNotificationWithIcon = (
  type: NotificationType,
  message: string,
  description: string,
) => {
  notification[type]({
    message,
    description,
  });
};
export default openNotificationWithIcon;

const returnMessage = ({ type, title, message, params }) => {
  const errorParamsMessage = params
    ? ` ${i18next.t('errors.error_params')}: ${JSON.stringify(params)}`
    : '';

  openNotificationWithIcon(
    type, // 'success' hoặc 'error'
    title,
    message + errorParamsMessage,
  );

  return type === 'success';
};

export const getMessage = response => {
  const { type, title, message, params } = normalizeApiResponse(response);
  returnMessage({ type, title, message, params });
};

export const normalizeApiResponse = response => {
  // Thành công
  if (response?.data?.success) {
    return {
      success: true,
      type: 'success',
      title: i18next.t('errors.success'),
      message: response.data?.trans
        ? i18next.t(response.data.trans)
        : response.data?.message || i18next.t('errors.success_message'),
    };
  }

  // Lỗi được định nghĩa trong response.errors
  if (response?.errors) {
    const { trans, message, params, key } = response.errors;
    return {
      success: false,
      type: 'error',
      title: key || i18next.t('errors.error'),
      message: trans
        ? i18next.t(trans)
        : message || i18next.t('errors.error_message'),
      params: params || null,
    };
  }

  // Lỗi 403
  if (response?.data?.status === 403) {
    const { title, detail } = response.data;
    const errorDetail = isValidJSON(detail) ? JSON.parse(detail)?.errors : null;
    return {
      success: false,
      type: 'error',
      title: title || i18next.t('errors.error'),
      message: errorDetail?.trans
        ? i18next.t(errorDetail.trans)
        : errorDetail?.message || i18next.t('errors.unauthorized'),
    };
  }

  // Lỗi 500
  if (response?.data?.status === 500) {
    const { title, detail } = response.data;
    const errorDetail = isValidJSON(detail) ? JSON.parse(detail)?.errors : null;
    return {
      success: false,
      type: 'error',
      title: title || i18next.t('errors.error'),
      message: errorDetail?.trans
        ? i18next.t(errorDetail.trans)
        : errorDetail?.message || i18next.t('errors.internal_server_error'),
    };
  }

  // Các lỗi khác
  const { message, params, key } = response?.data || {};
  return {
    success: false,
    type: 'error',
    title: key || i18next.t('errors.error'),
    message: message || i18next.t('errors.error_message'),
    params: params || null,
  };
};

function isValidJSON(string) {
  try {
    JSON.parse(string);
    return true;
  } catch (error) {
    return false;
  }
}
