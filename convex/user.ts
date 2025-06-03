import {mutation, MutationCtx, QueryCtx} from "@/convex/_generated/server";
import {v} from "convex/values";
import {Id} from "@/convex/_generated/dataModel";

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
    return userIsInDb._id;
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const getUserProfile = async (ctx: QueryCtx, userId: Id<"users">) => {
  return await ctx.db.get(userId);
};

export const checkIfPendingMember = async (
  ctx: MutationCtx,
  {
    room_id,
    member_to_join,
      status = 'PENDING'
  }: { room_id: Id<"rooms">; member_to_join: Id<"users"> , status?: 'ACCEPTED' | 'PENDING'},

) => {
  return await ctx.db
    .query("members")
    .withIndex("by_user_and_room_id", (q) =>
      q
        .eq("room_id", room_id)
        .eq("member_id", member_to_join)
        .eq("status", status),
    )
    .first();
};
