import { z } from 'zod';

export const phoneRegex = /^[+]?[0-9]{10,15}$/;

// Login
export const loginSchema = z.object({
  email: z.string().email('Invalid e-mail'),
  password: z.string().min(8, 'At least 8 characters'),
});

// Sign-up
export const signupSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid e-mail'),
  password: z.string()
    .min(8, 'Min 8 chars')
    .regex(/[A-Z]/, 'Need 1 uppercase')
    .regex(/[^a-zA-Z0-9]/, 'Need 1 symbol'),
  confirmPassword: z.string(),
  role: z.enum(['user', 'artisan']),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Change / Reset / Update password
export const passwordSchema = z.object({
  password: z.string()
    .min(8, 'Min 8 chars')
    .regex(/[A-Z]/, 'Need 1 uppercase')
    .regex(/[^a-zA-Z0-9]/, 'Need 1 symbol'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Phone & Address update
export const profileSchema = z.object({
  phone: z.string().regex(phoneRegex, 'Invalid phone').max(15, 'Too long'),
  address: z.string().max(200).optional(),
});