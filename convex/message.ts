import {mutation, query, QueryCtx} from "@/convex/_generated/server";
import {paginationOptsValidator} from "convex/server";
import {ConvexError, v} from "convex/values";
import {checkIfPendingMember, getUserProfile} from "@/convex/user";
import {Id} from "@/convex/_generated/dataModel";

export const getMessages = query({
  args: {
    room_id: v.id("rooms"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_room_id", (q) => q.eq("room_id", args.room_id))
      .order("desc")
      .paginate(args.paginationOpts);

    const page = await Promise.all(
      messages.page.map(async (m) => {
        const sender = await getUserProfile(ctx, m.sender_id);
        const reactions = await messageReactions(ctx, m._id);
        let reply;
        if (m.reply_to) {
          reply = await messageHelper(ctx, m.reply_to);
        }
        return {
          ...m,
          user: sender,
          reactions,
          reply,
        };
      }),
    );
    return {
      ...messages,
      page,
    };
  },
});

export const messageReactions = async (
  ctx: QueryCtx,
  messageId: Id<"messages">,
) => {
  return await ctx.db
    .query("reactions")
    .withIndex("by_message_id", (q) => q.eq("message_id", messageId))
    .collect();
};

export const messageHelper = async (
  ctx: QueryCtx,
  messageId: Id<"messages">,
) => {
  const message = await ctx.db.get(messageId);
  if (!message) return;

  const sender = await getUserProfile(ctx, message?.sender_id);

  return {
    fileType: message.file_type,
    fileUrl: message.file_url,
    message: message.message,
    sender_id: message.sender_id,
    user: {
      name: sender?.name,
      id: sender?.user_id,
    },
  };
};

// mutations

export const sendMessage = mutation({
  args: {
    room_id: v.id("rooms"),
    message: v.string(),
    sender_id: v.id("users"),
    file_type: v.optional(
      v.union(v.literal("image"), v.literal("pdf"), v.literal("audio")),
    ),
    file_url: v.optional(v.string()),
    file_id: v.optional(v.id("_storage")),
    reply_to: v.optional(v.id("messages")),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.room_id);
    if (!room) {
      throw new ConvexError("Room not found");
    }
    const isSenderAMember = await checkIfPendingMember(ctx, {
      status: "ACCEPTED",
      member_to_join: args.sender_id,
      room_id: args.room_id,
    });

    if (!isSenderAMember) {
      throw new ConvexError("You are not a member of this room");
    }

    await ctx.db.insert("messages", {
      ...args,
      seen_ids: [args.sender_id],
    });
    await ctx.db.patch(room._id, {
      last_message: args.message || "file",
      last_message_time: new Date().getTime(),
    });
  },
});
