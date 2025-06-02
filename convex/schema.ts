import {defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";

export const User = {
  name: v.string(),
  is_online: v.boolean(),
  imageUrl: v.optional(v.string()),
  email: v.string(),
  push_token: v.optional(v.union(v.string(), v.null())),
  lastSeen: v.optional(v.string()),
  department: v.optional(v.string()),
  faculty: v.optional(v.string()),
  program_type: v.optional(v.string()),
  user_id: v.string(),
  matriculation_number: v.optional(v.string()),
};
export const Reaction = {
  user_id: v.id("users"),
  message_id: v.id("messages"),
  emoji: v.union(
    v.literal("LIKE"),
    v.literal("SAD"),
    v.literal("LOVE"),
    v.literal("WOW"),
    v.literal("ANGRY"),
    v.literal("LAUGH"),
  ),
};

export const Room = {
  room_name: v.string(),
  creator_id: v.id("users"),
  members: v.array(v.id("users")),
  adminMembers: v.array(v.id("users")),
  member_count: v.number(),
  image_id: v.optional(v.id("_storage")),
  image_url: v.optional(v.string()),
  description: v.optional(v.string()),
  last_message: v.string(),
  last_message_time: v.number(),
};
export const PendingMember = {
  member_to_join: v.id("users"),
  room_id: v.id("rooms"),
};

export const Message = {
  room_id: v.id("rooms"),
  message: v.string(),
  sender_id: v.id("users"),
  seen_ids: v.array(v.id("users")),
  file_url: v.optional(v.string()),
  file_id: v.optional(v.id("_storage")),
  reply_to: v.optional(v.id("messages")),
  file_type: v.optional(
    v.union(v.literal("image"), v.literal("pdf"), v.literal("audio")),
  ),
};

export const Member = {
  room_id: v.id("rooms"),
  member_id: v.id("users"),
  access_role: v.union(v.literal("ADMIN"), v.literal("MEMBER")),
  status: v.union(v.literal("PENDING"), v.literal("ACCEPTED")),
};

export default defineSchema({
  users: defineTable(User)
    .index("by_department_faculty", ["department", "faculty"])
    .index("by_name", ["name"])
    .index("by_userId", ["user_id"])
    .searchIndex("searchName", {
      searchField: "name",
    }),
  messages: defineTable(Message).index("by_room_id", ["room_id"]),
  reactions: defineTable(Reaction)
    .index("by_message_id", ["message_id"])
    .index("by_sender_id", ["user_id"]),
  rooms: defineTable(Room)
    .index("by_creator_id", ["creator_id"])
      .index('by_member_count', ['member_count'])
      .index('by_last_message', ['last_message_time'])
      .index('name', ['room_name'])
    .searchIndex("room_name", {
      searchField: "room_name",
    }),
  pendingMembers: defineTable(PendingMember).index("by_room_id", ["room_id"]),
  members: defineTable(Member).index("by_room_id", ["room_id"]).index('by_user_and_room_id', ['room_id','member_id', 'status']),
});
