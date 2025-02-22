import { initiatePayment } from "../services/paymentService";

const PaymentPage = () => {
  const handlePayment = async () => {
    const { redirectUrl } = await initiatePayment(39); // ₹39 Entry fee
    window.location.href = redirectUrl;
  };

  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl">💳 Complete Your Payment</h2>
      <button onClick={handlePayment} className="bg-yellow-500 px-6 py-3 rounded mt-6">Pay Now</button>
    </div>
  );
};

export default PaymentPage;
