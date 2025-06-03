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
