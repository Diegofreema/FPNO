import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type userData = {
  Department: string;
  Faculty: string;
  birthday: string;
  email: string;
  fname: string;
  id: string;
  lname: string;
  matricnumber: string;
  mname: string;
  phone: string;
  programtype: string;
};
type Store = {
  user: userData;
  getUser: (user: userData) => void;
  removeUser: () => void;
};

export const useAuth = create<Store>()(
  persist(
    (set) => ({
      user: {
        email: "",
        id: "",
        birthday: "",
        fname: "",
        Department: "",
        Faculty: "",
        lname: "",
        matricnumber: "",
        mname: "",
        phone: "",
        programtype: "",
      },
      getUser: (data) =>
        set({
          user: {
            ...data,
          },
        }),
      removeUser: () =>
        set({
          user: {
            email: "",
            id: "",
            birthday: "",
            fname: "",
            Department: "",
            Faculty: "",
            lname: "",
            matricnumber: "",
            mname: "",
            phone: "",
            programtype: "",
          },
        }),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
