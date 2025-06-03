import {mutation, query} from "@/convex/_generated/server";
import {ConvexError, v} from "convex/values";
import {paginationOptsValidator} from "convex/server";
import {filter} from "convex-helpers/server/filter";
import {checkIfPendingMember, getUserProfile} from "@/convex/user";
import {Id} from "@/convex/_generated/dataModel";

export const getTopRooms = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("rooms")
      .withIndex("by_member_count")
      .order("desc")
      .take(5);
  },
});

export const getRoomsThatIamIn = query({
  args: {
    user_id: v.id("users"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { user_id, paginationOpts }) => {
    return filter(
      ctx.db.query("rooms").withIndex("by_last_message").order("desc"),
      (room) => room.members.includes(user_id),
    ).paginate(paginationOpts);
  },
});

export const searchRoomsThatIAmIn = query({
  args: {
    user_id: v.id("users"),
    query: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.query) return [];
    return filter(
      ctx.db
        .query("rooms")
        .withSearchIndex("room_name", (q) =>
          q.search("room_name", args.query!),
        ),
      (room) => room.members.includes(args.user_id),
    ).collect();
  },
});

export const exploreRooms = query({
  args: {
    paginationOpts: paginationOptsValidator,
    user_id: v.id("users"),
  },
  handler: async (ctx, args) => {
    return filter(
      ctx.db.query("rooms").withIndex("by_member_count"),
      (room) => !room.members.includes(args.user_id),
    ).paginate(args.paginationOpts);
  },
});
export const exploreRoomsSearch = query({
  args: {
    paginationOpts: paginationOptsValidator,
    user_id: v.id("users"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return filter(
      ctx.db
        .query("rooms")
        .withSearchIndex("room_name", (q) => q.search("room_name", args.name)),
      (room) => !room.members.includes(args.user_id),
    ).paginate(args.paginationOpts);
  },
});

export const isMember = query({
  args: {
    room_id: v.id("rooms"),
    member_id: v.id("users"),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.room_id);
    if (!room) return false;

    const memberIsAccepted = await ctx.db
      .query("members")
      .withIndex("by_user_and_room_id", (q) =>
        q
          .eq("room_id", args.room_id)
          .eq("member_id", args.member_id)
          .eq("status", "ACCEPTED"),
      )
      .first();
    return !!memberIsAccepted;
  },
});
export const isInPending = query({
  args: {
    room_id: v.id("rooms"),
    member_id: v.id("users"),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.room_id);
    if (!room) return false;

    const memberIsAccepted = await ctx.db
      .query("members")
      .withIndex("by_user_and_room_id", (q) =>
        q
          .eq("room_id", args.room_id)
          .eq("member_id", args.member_id)
          .eq("status", "PENDING"),
      )
      .first();

    return !!memberIsAccepted;
  },
});

export const getRoomMembers = query({
  args: {
    room_id: v.id("rooms"),
    status: v.union(v.literal("ACCEPTED"), v.literal("PENDING")),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const members = await ctx.db
      .query("members")
      .withIndex("by_room_id", (q) =>
        q.eq("room_id", args.room_id).eq("status", args.status),
      )
      .order("asc")
      .paginate(args.paginationOpts);
    const page = await Promise.all(
      members.page.map(async (member) => {
        const user = await getUserProfile(ctx, member.member_id);
        return {
          ...member,
          user,
        };
      }),
    );

    return {
      ...members,
      page,
    };
  },
});
export const getRoomPendingMembersCount = query({
  args: { room_id: v.id("rooms") },
  handler: async (ctx, args) => {
    const pendingMembers = await ctx.db
      .query("members")
      .withIndex("by_room_id", (q) =>
        q.eq("room_id", args.room_id).eq("status", "PENDING"),
      )
      .collect();
    return pendingMembers.length;
  },
});

export const room = query({
  args: {
    room_id: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.room_id);
  },
});
// mutations

export const createRoom = mutation({
  args: {
    room_name: v.string(),
    description: v.optional(v.string()),
    creator_id: v.id("users"),
    image_url: v.optional(v.string()),
    image_id: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const findRoomWithSameName = await ctx.db
      .query("rooms")
      .withIndex("name", (q) => q.eq("room_name", args.room_name))
      .first();
    if (findRoomWithSameName) {
      throw new ConvexError("Room with name exists");
    }
    let imgUrl: string = "";
    if (args.image_id) {
      imgUrl = (await ctx.storage.getUrl(args.image_id)) as string;
    }

    const roomId = await ctx.db.insert("rooms", {
      ...args,
      adminMembers: [args.creator_id],
      members: [args.creator_id],
      member_count: 1,
      last_message: `The chat room "${args.room_name}" was created`,
      last_message_time: new Date().getTime(),
      image_id: args.image_id,
      image_url: imgUrl,
    });
    await ctx.db.insert("members", {
      room_id: roomId,
      status: "ACCEPTED",
      member_id: args.creator_id,
      access_role: "ADMIN",
    });
    return roomId;
  },
});

export const editRoom = mutation({
  args: {
    room_name: v.string(),
    description: v.optional(v.string()),
    creator_id: v.id("users"),
    image_id: v.optional(v.id("_storage")),
    room_id: v.id("rooms"),
    previous_image_id: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.room_id);
    if (!room) {
      throw new ConvexError("Room not found");
    }

    if (room.creator_id !== args.creator_id) {
      throw new ConvexError("Unauthorized");
    }

    if (args.image_id) {
      const imageUrl = await ctx.storage.getUrl(args.image_id);
      await ctx.storage.delete(args.previous_image_id as Id<"_storage">);
      if (!imageUrl) return;
      await ctx.db.patch(room._id, {
        image_url: imageUrl as string,
        room_name: args.room_name,
        description: args.description,
        image_id: args.image_id,
      });
    }

    await ctx.db.patch(room._id, {
      room_name: args.room_name,
      description: args.description,
    });
  },
});

export const joinRoom = mutation({
  args: { room_id: v.id("rooms"), member_to_join: v.id("users") },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.room_id);
    if (!room) {
      throw new ConvexError("Room not found");
    }

    const checkIfMemberIsInPending = await checkIfPendingMember(ctx, {
      member_to_join: args.member_to_join,
      room_id: args.room_id,
    });
    if (checkIfMemberIsInPending) {
      throw new ConvexError(
        "You have already sent a request to join this room",
      );
    }
    await ctx.db.insert("members", {
      room_id: args.room_id,
      member_id: args.member_to_join,
      status: "PENDING",
      access_role: "MEMBER",
    });
  },
});

export const acceptRequest = mutation({
  args: {
    room_id: v.id("rooms"),
    member_to_join: v.id("users"),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.room_id);

    if (!room) {
      throw new ConvexError("Room not found!!!");
    }

    const isPendingMember = await checkIfPendingMember(ctx, {
      member_to_join: args.member_to_join,
      room_id: args.room_id,
    });
    if (!isPendingMember) {
      throw new ConvexError("Pending member does not exist");
    }

    await ctx.db.patch(isPendingMember._id, {
      status: "ACCEPTED",
    });
    await ctx.db.patch(room._id, {
      members: [...room.members, args.member_to_join],
      member_count: room.member_count + 1,
    });
  },
});


export const declineRequest = mutation({
  args: {
    room_id: v.id("rooms"),
    member_to_join: v.id("users"),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.room_id);

    if (!room) {
      throw new ConvexError("Room not found!!!");
    }

    const isPendingMember = await checkIfPendingMember(ctx, {
      member_to_join: args.member_to_join,
      room_id: args.room_id,
    });
    if (!isPendingMember) {
      throw new ConvexError("Pending member does not exist");
    }

    await ctx.db.delete(isPendingMember._id,);
  }
});
