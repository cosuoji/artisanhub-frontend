import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '../utils/schemas';


export default function Signup() {
  const navigate = useNavigate();
  const { user, error, signup, loading } = useAuthStore();
 const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data) => {
    await signup(data);
  };


  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user]);


  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold text-charcoal mb-6 text-center">Create Account</h2>

 <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-4">
      <input {...register('name')} placeholder="Full name" className="w-full border p-2" />
      {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}

      <input {...register('email')} type="email" placeholder="Email" className="w-full border p-2" />
      {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}

      <input {...register('password')} type="password" placeholder="Password" className="w-full border p-2" />
      {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}

      <input {...register('confirmPassword')} type="password" placeholder="Confirm password" className="w-full border p-2" />
      {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}

      <select {...register('role')} className="w-full border p-2">
        <option value="user">Customer</option>
        <option value="artisan">Artisan</option>
      </select>

      <button disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded">
        {isSubmitting ? 'Creating…' : 'Sign Up'}
      </button>
    </form>

    </div>
  );
}
