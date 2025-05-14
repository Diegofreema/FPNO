import { z } from 'zod';

export const createChatRoomSchema = z.object({
  channel_name: z.string().min(1, { message: 'Room name is required' }),
  description: z
    .string()
    .max(200, { message: 'Description must be at most 200 characters ' })
    .optional(),
  image_url: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === '' ? undefined : value)),
    ])
    .optional(),
});
