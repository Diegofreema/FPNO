import {mutation, query} from "@/convex/_generated/server";
import {ConvexError, v} from "convex/values";
import {paginationOptsValidator} from "convex/server";
import {filter} from "convex-helpers/server/filter";

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
      const findRoomWithSameName = await ctx.db.query('rooms').withIndex('name', q => q.eq('room_name', args.room_name)).first()
      if(findRoomWithSameName) {
          throw new ConvexError('Room with name exists')
      }
      let imgUrl: string = '';
      if(args.image_id) {
          imgUrl = await ctx.storage.getUrl(args.image_id) as string
      }
   return  await ctx.db.insert("rooms", {
      ...args,
      adminMembers: [args.creator_id],
      members: [args.creator_id],
      member_count: 1,
      last_message: `The chat room "${args.room_name}" was created`,
      last_message_time: new Date().getTime(),
      image_id: args.image_id,
       image_url: imgUrl
    });
  },
});
