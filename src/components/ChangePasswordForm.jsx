import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordSchema } from '../utils/schemas';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'react-hot-toast';

export default function ChangePasswordForm() {
  const { logout } = useAuthStore();
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm({ resolver: zodResolver(passwordSchema) });

  const onSubmit = async ({ password }) => {
    try {
      await axiosInstance.patch('/auth/change-password', { newPassword: password });
      toast.success('Password changed');
      logout();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input
        {...register('password')}
        type="password"
        placeholder="New password"
        className="w-full border p-2"
      />
      {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}

      <input
        {...register('confirmPassword')}
        type="password"
        placeholder="Confirm password"
        className="w-full border p-2"
      />
      {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}

      <button disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded">
        {isSubmitting ? 'Updating…' : 'Change Password'}
      </button>
    </form>
  );
}