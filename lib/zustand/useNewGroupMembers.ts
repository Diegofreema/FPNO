import { create } from "zustand";
import { NewConversationType } from "@/types";
import { Id } from "@/convex/_generated/dataModel";

type GroupMemberStore = {
  members: NewConversationType[];
  addMember: (newMember: NewConversationType) => void;
  removeMember: (id: Id<"users">) => void;
  clearMembers: () => void;
};

export const useNewGroupMembers = create<GroupMemberStore>((set) => ({
  members: [],
  addMember: (newMember: NewConversationType) => {
    set((state) => {
      const groupMemberFound = state.members.find(
        (member) => member.id === newMember.id,
      );
      if (groupMemberFound) {
        return {
          members: state.members.filter((member) => member.id !== newMember.id),
        };
      }
      return { members: [...state.members, newMember] };
    });
  },
  removeMember: (id: Id<"users">) => {
    set((state) => ({
      members: state.members.filter((member) => member.id !== id),
    }));
  },
  clearMembers: () => set({ members: [] }),
}));
