import ReceivedRequestList from "./received-request-list";

const ReceivedRequestPage = () => {
  return (
    <div className="space-y-4 px-4 h-screen">
      <h4 className="font-semibold">Friend Request</h4>
      <ReceivedRequestList />
    </div>
  );
};

export default ReceivedRequestPage;
