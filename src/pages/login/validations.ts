import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'El correo es obligatorio' })
    .email('Ingresa un correo válido'),
  password: z
    .string()
    .min(1, { message: 'La contraseña es obligatoria' })
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const signUpSchema = loginSchema.extend({
  fullName: z
    .string()
    .trim()
    .min(1, { message: 'El nombre es obligatorio' })
    .min(3, 'Ingresa tu nombre completo'),
  phone: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined))
    .refine(
      (value) => !value || /^[+]?[\d\s-()]{7,}$/.test(value),
      'Ingresa un teléfono válido'
    ),
});

export type FormErrors = Partial<Record<'email' | 'password' | 'fullName' | 'phone', string>>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
