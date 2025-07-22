import toast from 'react-hot-toast';

export const toastError = (err) =>
  toast.error(err?.response?.data?.message || 'Something went wrong');

export const toastSuccess = (msg) => toast.success(msg);