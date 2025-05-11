import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
type Details = {
  exp: string;
  programtype: string;
  faculty: string;
  student: string;
  matricnumber: string;
  department: string;
  School: string;
  id: string;
  stateoforigin: string;
};

type Store = {
  details: Details;
  setDetails: (id: string) => Promise<void>;
  removeDetails: () => void;
};

export const useStoreId = create<Store>()(
  persist(
    (set) => ({
      details: {
        exp: "",
        programtype: "",
        faculty: "",
        student: "",
        matricnumber: "",
        department: "",
        School: "",
        id: "",
        stateoforigin: "",
      },
      removeDetails: () => {
        set({
          details: {
            exp: "",
            programtype: "",
            faculty: "",
            student: "",
            matricnumber: "",
            department: "",
            School: "",
            id: "",
            stateoforigin: "",
          },
        });
      },
      setDetails: async (id) => {
        try {
          const { data } = await axios(
            `https://estate.netpro.software/api.aspx?api=idcard&studentid=${id}
`,
          );

          set({
            details: { ...data },
          });
        } catch (error) {
          console.log(error);
        }
      },
    }),
    {
      name: "id",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
