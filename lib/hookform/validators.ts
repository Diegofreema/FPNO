import {z} from 'zod';


export const loginSchema = z.object({
    email: z
        .string({
            required_error: 'Please enter your email',
            invalid_type_error: 'Please enter a valid email',
        })
        .min(1, { message: 'Please enter your email' })
        .email({ message: 'Please enter a valid email address' }),
    password: z
        .string({ required_error: 'Please enter your password' })
        .min(1, { message: 'Password must be at least 5 characters long' }),
})