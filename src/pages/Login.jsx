import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRedirect } from '../hooks/useRedirect';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../utils/schemas';
import { useAuthStore } from '../store/useAuthStore';


export default function Login() {
  const navigate = useNavigate();
  const { login, user, loading } = useAuthStore();
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    await login(data);
  };

  // const handleCaptchaChange = (token) => {
  //   setRecaptchaToken(token);
  // };

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user]);


  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold text-[#1F2937] mb-6 text-center">Login</h2>

  <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-4">
      <input {...register('email')} type="email" placeholder="Email" className="w-full border p-2" />
      {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}

      <input {...register('password')} type="password" placeholder="Password" className="w-full border p-2" />
      {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}

      <button disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded">
        {isSubmitting ? 'Logging in…' : 'Login'}
      </button>
    </form>

      <div className="text-sm text-center mt-4">
        Don’t have an account?{' '}
        <a href="/signup" className="text-[#1E3A8A] hover:underline">
          Sign up
        </a>
      </div>
    </div>
  );
}
