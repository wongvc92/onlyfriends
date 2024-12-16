import SentRequestList from "./sent-request-list";

const SentRequestPage = () => {
  return (
    <div className="space-y-4 px-4">
      <h4 className="font-semibold">Sent Request</h4>
      <SentRequestList />
    </div>
  );
};

export default SentRequestPage;
