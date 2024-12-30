import WidthWrapper from "../common/width-wrapper";
import AddProfileForm from "./add-profile-form";

const AddProfilePage = () => {
  return (
    <WidthWrapper>
      <div className="p-4 md:pl-10 pb-10 max-w-xl">
        <AddProfileForm />
      </div>
    </WidthWrapper>
  );
};

export default AddProfilePage;
