import {CustomBackgroundImage} from "@/components/ui/custom-background";
import {ForgotForm} from "@/components/ui/forgot-form";

const ForgotPin = () => {
  return (
    <CustomBackgroundImage
      text={"Check your email"}
      text2={"A token has been sent to your registered email"}
    >
      <ForgotForm />
    </CustomBackgroundImage>
  );
};
export default ForgotPin;
