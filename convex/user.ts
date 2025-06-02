import {mutation} from "@/convex/_generated/server";
import {v} from "convex/values";

export const createUser = mutation({
  args: {
    name: v.string(),
    imageUrl: v.optional(v.string()),
    email: v.string(),
    department: v.optional(v.string()),
    faculty: v.optional(v.string()),
    program_type: v.optional(v.string()),
    user_id: v.string(),
    matriculation_number: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userIsInDb = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("user_id", args.user_id))
      .first();
    if (!userIsInDb) {
      return await ctx.db.insert("users", {
        ...args,
        is_online: false,
      });
    }
    return userIsInDb._id
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});
