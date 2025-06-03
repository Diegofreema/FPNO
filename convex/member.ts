import {ConvexError, v} from "convex/values";
import {mutation} from "@/convex/_generated/server";
import {checkIfPendingMember} from "@/convex/user";

// mutation

export const leaveRoom = mutation({
  args: {
    room_id: v.id("rooms"),
    member_id: v.id("users"),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.room_id);
    if (!room) {
      throw new ConvexError("Room not found");
    }

    const member = await checkIfPendingMember(ctx, {
      status: "ACCEPTED",
      room_id: args.room_id,
      member_to_join: args.member_id,
    });

    if (!member) {
      throw new ConvexError("Member not found");
    }

    await ctx.db.delete(member._id);
    await ctx.db.patch(room._id, {
      member_count: room.member_count - 1,
      members: room.members.filter((m) => m !== args.member_id),
    });
  },
});

export const removeUser = mutation({
  args: {
    room_id: v.id("rooms"),
    member_id: v.id("users"),
    actionUser_id: v.id("users"),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.room_id);
    if (!room) {
      throw new ConvexError("Room not found");
    }

    const actionUser = await checkIfPendingMember(ctx, {
      status: "ACCEPTED",
      room_id: args.room_id,
      member_to_join: args.actionUser_id,
    });

    if (!actionUser || actionUser.access_role !== "ADMIN") {
      throw new ConvexError("You are not authorized to perform this action");
    }
    const member = await checkIfPendingMember(ctx, {
      status: "ACCEPTED",
      room_id: args.room_id,
      member_to_join: args.member_id,
    });

    if (!member) {
      throw new ConvexError("Member not found");
    }

    await ctx.db.delete(member._id);
    await ctx.db.patch(room._id, {
      member_count: room.member_count - 1,
      members: room.members.filter((m) => m !== args.member_id),
    });
  },
});
export const updateUserRole = mutation({
  args: {
    room_id: v.id("rooms"),
    member_id: v.id("users"),
    actionUser_id: v.id("users"),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.room_id);
    if (!room) {
      throw new ConvexError("Room not found");
    }

    const actionUser = await checkIfPendingMember(ctx, {
      status: "ACCEPTED",
      room_id: args.room_id,
      member_to_join: args.actionUser_id,
    });

    if (!actionUser || actionUser.access_role !== "ADMIN") {
      throw new ConvexError("You are not authorized to perform this action");
    }
    const member = await checkIfPendingMember(ctx, {
      status: "ACCEPTED",
      room_id: args.room_id,
      member_to_join: args.member_id,
    });

    if (!member) {
      throw new ConvexError("Member not found");
    }

    if (
      member.access_role === "ADMIN" &&
      room.creator_id !== args.actionUser_id
    ) {
      throw new ConvexError("You are not authorized to perform this action");
    }
    const newRole = member.access_role === "ADMIN" ? "MEMBER" : "ADMIN";

    await ctx.db.patch(member._id, {
      access_role: newRole,
    });
  },
});
