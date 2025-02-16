import axios from "axios";

export const initiatePayment = async (userId, amount) => {
    try {
        const response = await axios.post(
            "http://localhost:5000/api/payment/initiate-payment",
            //"https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/payment/initiate-payment",
            { userId, amount }
        );

        if (response.data.success) {
            window.location.href = response.data.redirectUrl; // ✅ Redirect to PhonePe payment page
        } else {
            throw new Error("Payment initiation failed.");
        }
    } catch (error) {
        console.error("❌ Error initiating payment:", error);
        alert("Payment failed. Please try again.");
    }
};
