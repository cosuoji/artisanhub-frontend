import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from '../utils/schemas';
import { useAuthStore } from '../store/useAuthStore';

export default function UpdateProfileForm() {
  const { user, updateProfile } = useAuthStore();
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm({ resolver: zodResolver(profileSchema), defaultValues: { phone: user?.phone || '', address: user?.address || '' } });

  const onSubmit = async (data) => {
    await updateProfile(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <label className="block text-sm font-medium">Phone</label>
      <input type="tel" {...register('phone')} className="w-full border p-2" />
      {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}

      <label className="block text-sm font-medium">Address</label>
      <textarea {...register('address')} rows={3} className="w-full border p-2" />
      {errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}

      <button disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded">
        {isSubmitting ? 'Updating…' : 'Update Profile'}
      </button>
    </form>
  );
}