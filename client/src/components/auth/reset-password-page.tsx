import WidthWrapper from "../common/width-wrapper";
import ResetForm from "./reset-password-form";

const ResetPasswordPage = () => {
  return (
    <WidthWrapper>
      <div className="px-4 pt-10 max-w-md mx-auto">
        <ResetForm />
      </div>
    </WidthWrapper>
  );
};

export default ResetPasswordPage;
