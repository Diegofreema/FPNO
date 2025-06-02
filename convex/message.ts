import {query, QueryCtx} from "@/convex/_generated/server";
import {paginationOptsValidator} from "convex/server";
import {v} from "convex/values";
import {getUserProfile} from "@/convex/user";
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
        const reply = await messageHelper(ctx, m._id);
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
