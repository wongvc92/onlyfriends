import WidthWrapper from "../common/width-wrapper";
import { LoginForm } from "./login-form";

const LoginPage = () => {
  return (
    <WidthWrapper>
      <div className="max-w-sm mx-auto px-4 pt-10">
        <div className="space-y-4">
          <div className="text-center font-bold">Welcome to onlyfriends</div>
          <LoginForm />
        </div>
      </div>
    </WidthWrapper>
  );
};

export default LoginPage;
