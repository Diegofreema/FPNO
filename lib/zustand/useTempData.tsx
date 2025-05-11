import { create } from "zustand";

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

export const useTempData = create<Store>()((set) => ({
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
}));
