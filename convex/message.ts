import {mutation, MutationCtx, query, QueryCtx,} from "@/convex/_generated/server";
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

    let file_url = "";
    if (args.file_id) {
      file_url = (await ctx.storage.getUrl(args.file_id)) as string;
    }

    await ctx.db.insert("messages", {
      ...args,
      file_url,
      seen_ids: [args.sender_id],
    });
    await ctx.db.patch(room._id, {
      last_message: args.message || "file",
      last_message_time: new Date().getTime(),
    });
  },
});

export const editMessage = mutation({
  args: {
    text: v.string(),
    message_id: v.id("messages"),
    sender_id: v.id("users"),
  },
  handler: async (ctx, args) => {
    const messageToEdit = await ctx.db.get(args.message_id);
    if (!messageToEdit) {
      throw new ConvexError("Message not found");
    }
    if (messageToEdit.sender_id !== args.sender_id) {
      throw new ConvexError("You are not authorized to edit this text");
    }
    await ctx.db.patch(messageToEdit._id, {
      message: args.text,
    });
  },
});

export const deleteMessage = mutation({
  args: {
    sender_id: v.id("users"),
    message_id: v.id("messages"),
  },
  handler: async (ctx, args) => {
    await deleteMessageHelpFn(ctx, args.message_id, args.sender_id);
  },
});

// helpers

export const deleteMessageHelpFn = async (
  ctx: MutationCtx,
  message_id: Id<"messages">,
  logged_in_user: Id<"users">,
) => {
  const messageToDelete = await ctx.db.get(message_id);
  if (!messageToDelete) {
    throw new ConvexError("Message not found");
  }
  const room = await ctx.db.get(messageToDelete.room_id);
  if (!room) {
    throw new ConvexError("Room not found");
  }
  if (messageToDelete.sender_id !== logged_in_user) {
    throw new ConvexError("Unauthorized");
  }
  if (messageToDelete.file_id) {
    await ctx.storage.delete(messageToDelete.file_id);
  }
  await findAndDeleteReplies(ctx, message_id);
  await ctx.db.delete(message_id);
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_room_id", (q) => q.eq("room_id", messageToDelete.room_id))
    .order("asc")
    .collect();
  await ctx.db.patch(room?._id, {
    last_message: messages[messages.length - 1]?.message || "file",
    last_message_time: messages[messages.length - 1]?._creationTime,
  });
};

export const findAndDeleteReplies = async (
  ctx: MutationCtx,
  message_id: Id<"messages">,
) => {
  const isReplyTo = await ctx.db
    .query("messages")
    .withIndex("by_reply_to", (q) => q.eq("reply_to", message_id))
    .collect();
  if (isReplyTo.length > 0) {
    for (const reply of isReplyTo) {
      await ctx.db.patch(reply._id, {
        reply_to: undefined,
      });
    }
  }
};

export const reactToMessage = mutation({
  args: {
    messageId: v.id("messages"),
    senderId: v.id("users"),
    emoji: v.union(
      v.literal("LIKE"),
      v.literal("SAD"),
      v.literal("LOVE"),
      v.literal("WOW"),
      v.literal("ANGRY"),
      v.literal("LAUGH"),
    ),
  },
  handler: async (ctx, args) => {
    const messageToReactTo = await ctx.db.get(args.messageId);
    if (!messageToReactTo) {
      throw new ConvexError("Message not found");
    }

    const isSenderAMember = await checkIfPendingMember(ctx, {
      status: "ACCEPTED",
      room_id: messageToReactTo.room_id,
      member_to_join: args.senderId,
    });

    if (!isSenderAMember) {
      throw new ConvexError("You are not a member of this group");
    }

    const reactionExists = await ctx.db
      .query("reactions")
      .withIndex("by_sender_message_id", (q) =>
        q.eq("message_id", args.messageId).eq("user_id", args.senderId),
      )
      .first();

    const isSameReaction = reactionExists?.emoji === args.emoji
    if(reactionExists && isSameReaction) {
      await ctx.db.delete(reactionExists._id,)
      return
    }

    if(reactionExists) {
      await ctx.db.delete(reactionExists._id)
    }

    await ctx.db.insert('reactions', {
      emoji: args.emoji,
      message_id: args.messageId,
      user_id: args.senderId
    })
  },
});
