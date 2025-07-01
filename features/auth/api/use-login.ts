import {generateFromRandomNumbersOtp, sendEmail} from "@/helper";
import {useTempData} from "@/lib/zustand/useTempData";
import {Variants} from "@/types";
import {useMutation} from "@tanstack/react-query";
import {useMutation as useConvexMutation} from "convex/react";
import axios from "axios";
import {useRouter} from "expo-router";
import {toast} from "sonner-native";
import {api} from "@/convex/_generated/api";
import {useAuth} from "@/lib/zustand/useAuth";

export const useLogin = (variant: Variants) => {
  const router = useRouter();
  const getTempUser = useTempData((state) => state.getUser);
  const getUser = useAuth((state) => state.getUser)
  const createUser = useConvexMutation(api.user.createUser);
  return useMutation({
    mutationFn: async (values: { email: string; password: string }) => {
      const baseApi = variant === "LECTURER" ? "lecturerlogin" : "userlogin";
      const { data } = await axios(
        `https://estate.netpro.software/api.aspx?api=${baseApi}&email=${
          values.email
        }&pasword=${encodeURI(values.password)}`,
      );

      return data;
    },
    onSuccess: async (data) => {
      console.log({data})
      if (data.result === "failed") {
        return toast.error("Error", {
          description: "Failed to login",
        });
      }
      if (data.result === "incorrect credentials") {
        return toast.error("Error", {
          description: "Incorrect credentials",
        });
      }
      const otp = generateFromRandomNumbersOtp();
      await sendEmail(data.email, otp);

      let userData;
      if (variant === "LECTURER") {
        const name = data.fullname;
        userData = {
          ...data,
          name,
        };
      }
      if (variant === "STUDENT") {
        const name = `${data.fname} ${data.mname} ${data.lname}`;
        userData = {
          ...data,
          name,
        };
      }

      const isStudent = variant === "STUDENT";
      const id = await createUser({
        user_id: data.id,
        email: data.email,
        name: userData.name,
        department: isStudent ? userData?.Department : undefined,
        faculty: isStudent ? userData.Faculty : undefined,
        imageUrl: isStudent
          ? `https://fpn.netpro.software/Uploads/${data.id}.jpeg`
          : undefined,
        program_type: isStudent ? userData.programtype : undefined,
        matriculation_number: isStudent ? userData.matricnumber : undefined,
      });
      getUser({ variant, convexId: id, ...userData });
      toast.success("Success", {
        description: "An otp was sent to your email",
      });
      // router.push(`/token?token=${otp}`);
      // router.push(`/(private)/(tabs)`);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error", {
        description: "Failed to login, please try again later",
      });
    },
  });
};
