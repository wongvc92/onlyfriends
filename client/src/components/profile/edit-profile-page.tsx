import WidthWrapper from "../common/width-wrapper";
import EditProfileForm from "./edit-profile-form";

const EditProfilePage = () => {
  return (
    <WidthWrapper>
      <div className="p-4 md:pl-10 pb-10 max-w-xl">
        <EditProfileForm />
      </div>
    </WidthWrapper>
  );
};

export default EditProfilePage;
