import { z } from 'zod';

// Custom validator for ImagePickerAsset
const imagePickerAssetSchema = z
  .object({
    uri: z.string().url({ message: 'Invalid image URI' }),
    type: z.string(),
    size: z
      .number()
      .max(5 * 1024 * 1024, { message: 'Image must be less than 5MB' }),
    name: z.string(),
  })
  .optional();

// Schema for creating a chat room
export const createChatRoomSchema = z.object({
  name: z.string().min(1, { message: 'Room name is required' }),
  description: z
    .string()
    .max(200, { message: 'Description must be at most 200 characters' })
    .optional(),
  image: imagePickerAssetSchema,
});

// Export inferred TypeScript type
export type CreateChatRoomSchema = z.infer<typeof createChatRoomSchema>;
