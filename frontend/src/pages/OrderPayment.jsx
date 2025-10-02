import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    CreditCard,
    Banknote,
    ArrowLeft,
    Receipt,
    Gift,
    Calculator,
    CheckCircle,
} from "lucide-react";

const OrderPayment = () => {
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [cardDetails, setCardDetails] = useState({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardholderName: "",
    });
    const [cashAmount, setCashAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Get order data from sessionStorage
        const storedOrderData = sessionStorage.getItem("orderData");
        if (!storedOrderData) {
            navigate("/shop");
            return;
        }
        setOrderData(JSON.parse(storedOrderData));
    }, [navigate]);

    const handleCardInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Format card number with spaces
        if (name === "cardNumber") {
            formattedValue = value
                .replace(/\s/g, "")
                .replace(/(\d{4})/g, "$1 ")
                .trim();
            if (formattedValue.length > 19)
                formattedValue = formattedValue.substring(0, 19);
        }

        // Format expiry date
        if (name === "expiryDate") {
            formattedValue = value
                .replace(/\D/g, "")
                .replace(/(\d{2})(\d{2})/, "$1/$2");
            if (formattedValue.length > 5)
                formattedValue = formattedValue.substring(0, 5);
        }

        // Format CVV
        if (name === "cvv") {
            formattedValue = value.replace(/\D/g, "");
            if (formattedValue.length > 3)
                formattedValue = formattedValue.substring(0, 3);
        }

        setCardDetails({
            ...cardDetails,
            [name]: formattedValue,
        });
    };

    const processOrder = async () => {
        if (!orderData) return;

        setLoading(true);
        setError("");

        try {
            // Validate payment method specific fields
            if (paymentMethod === "card") {
                if (
                    !cardDetails.cardNumber ||
                    !cardDetails.expiryDate ||
                    !cardDetails.cvv ||
                    !cardDetails.cardholderName
                ) {
                    setError("Please fill in all card details");
                    setLoading(false);
                    return;
                }
            } else if (paymentMethod === "cash") {
                const cashAmountNum = parseFloat(cashAmount);
                if (!cashAmount || cashAmountNum < orderData.finalTotal) {
                    setError(
                        `Cash amount must be at least LKR ${orderData.finalTotal.toFixed(
                            2
                        )}`
                    );
                    setLoading(false);
                    return;
                }
            }

            // Step 1: Create Order with retry logic
            let orderResponse;
            let retryCount = 0;
            const maxRetries = 3;

            while (retryCount < maxRetries) {
                try {
                    orderResponse = await fetch("http://localhost:4000/api/orders", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            customerID: orderData.customer?._id || null,
                            totalAmount: orderData.finalTotal,
                            paymentMethod: paymentMethod.toUpperCase(),
                            loyaltyPointsUsed: orderData.pointsToRedeem || 0,
                            loyaltyDiscount: orderData.loyaltyDiscount || 0,
                            // Add timestamp to make each request unique
                            timestamp: Date.now(),
                        }),
                    });

                    if (orderResponse.ok) {
                        break; // Success, exit retry loop
                    }

                    const errorData = await orderResponse.json();

                    if (
                        errorData.message?.includes("Duplicate") ||
                        errorData.message?.includes("duplicate")
                    ) {
                        retryCount++;
                        if (retryCount < maxRetries) {
                            console.log(
                                `Retry attempt ${retryCount} for duplicate order`
                            );
                            // Wait a bit before retrying
                            await new Promise((resolve) =>
                                setTimeout(resolve, 1000)
                            );
                            continue;
                        }
                    }

                    throw new Error(errorData.message || "Failed to create order");
                } catch (fetchError) {
                    if (retryCount < maxRetries - 1) {
                        retryCount++;
                        console.log(
                            `Retry attempt ${retryCount} due to error:`,

                            fetchError.message
                        );
                        await new Promise((resolve) =>
                            setTimeout(resolve, 1000)
                        );
                        continue;
                    }
                    throw fetchError;
                }
            }

            if (!orderResponse.ok) {
                const errorData = await orderResponse.json();
                throw new Error(
                    errorData.message || "Failed to create order after retries"
                );
            }

            const orderResult = await orderResponse.json();
            const orderId = orderResult.order._id;

            // Step 2: Create Order Items
            const orderItemsPromises = orderData.cartItems.map((item) =>
                fetch("http://localhost:4000/api/order-items", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        orderID: orderId,
                        productID: item._id,
                        quantity: item.quantity,
                        subtotal: item.price * item.quantity,
                    }),
                })
            );

            const orderItemsResults = await Promise.all(orderItemsPromises);

            // Check if all order items were created successfully
            for (const result of orderItemsResults) {
                if (!result.ok) {
                    const errorData = await result.json();
                    throw new Error(
                        errorData.message || "Failed to create order items"
                    );
                }
            }

            // Step 3: Process Loyalty Transaction (if customer exists)
            if (orderData.customer) {
                const token = localStorage.getItem("token");
                const loyaltyResponse = await fetch(
                    "http://localhost:4000/api/loyalty/purchase",
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            customerID: orderData.customer._id,
                            orderID: orderId,
                            totalAmount: orderData.finalTotal,
                            pointsRedeemed: orderData.pointsToRedeem || 0,
                        }),
                    }
                );

                if (!loyaltyResponse.ok) {
                    console.warn(
                        "Loyalty transaction failed, but order was successful"
                    );
                }
            }

            // Success
            setSuccess(true);

            // Clear session storage
            sessionStorage.removeItem("orderData");

            // Show success message
            setTimeout(() => {
                navigate("/shop");
            }, 3000);
        } catch (error) {
            console.error("Order processing error:", error);
            setError(error.message || "Payment processing failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!orderData) {
        return <div>Loading...</div>;
    }

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-lg">
                    <CheckCircle size={64} className="mx-auto mb-4 text-green-500" />
                    <h2 className="mb-2 text-2xl font-bold text-gray-800">
                        Payment Successful!
                    </h2>
                    <p className="mb-4 text-gray-600">
                        Your order has been processed successfully.
                    </p>
                    <p className="text-sm text-gray-500">
                        Redirecting to dashboard in 3 seconds...
                    </p>
                </div>
            </div>
        );
    }

    const change =
        paymentMethod === "cash" && cashAmount
            ? Math.max(0, parseFloat(cashAmount) - orderData.finalTotal)
            : 0;

    return (
        <div className="min-h-screen p-4 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate("/shop")}
                        className="flex items-center px-4 py-2 text-gray-600 transition-colors rounded-lg hover:bg-white hover:shadow-sm"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Dashboard
                    </button>
                    <h1 className="ml-4 text-3xl font-bold text-primary1">
                        Order Payment
                    </h1>
                </div>

                {error && (
                    <div className="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Order Summary */}
                    <div className="p-6 bg-white rounded-lg shadow-sm">
                        <h2 className="flex items-center mb-4 text-xl font-semibold text-gray-800">
                            <Receipt className="mr-2" size={20} />
                            Order Summary
                        </h2>

                        {/* Customer Info */}
                        {orderData.customer && (
                            <div className="p-3 mb-4 border rounded-lg bg-primary4/20 border-primary3">
                                <h3 className="flex items-center mb-2 font-medium text-primary1">
                                    <Gift className="mr-2" size={16} />
                                    Loyalty Customer
                                </h3>
                                <p className="text-sm text-gray-700">
                                    {orderData.customer.customerName}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Phone: {orderData.customer.phone}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Points: {orderData.customer.loyaltyPoints}
                                </p>
                            </div>
                        )}

                        {/* Items */}
                        <div className="mb-4 space-y-3">
                            {orderData.cartItems.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex items-center justify-between py-2 border-b"
                                >
                                    <div>
                                        <h4 className="font-medium">{item.productName}</h4>
                                        <p className="text-sm text-gray-600">
                                            {item.quantity} × LKR {item.price.toFixed(2)}
                                        </p>
                                    </div>
                                    <p className="font-medium">
                                        LKR {(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="pt-4 space-y-2 border-t">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>LKR {orderData.subtotal.toFixed(2)}</span>
                            </div>

                            {orderData.loyaltyDiscount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Loyalty Discount:</span>
                                    <span>-LKR {orderData.loyaltyDiscount.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="flex justify-between pt-2 border-t">
                                <span className="flex items-center text-lg font-semibold">
                                    <Calculator className="mr-2" size={18} />
                                    Total:
                                </span>
                                <span className="text-xl font-bold text-primary1">
                                    LKR {orderData.finalTotal.toFixed(2)}
                                </span>
                            </div>

                            {orderData.customer && (
                                <p className="text-sm text-gray-600">
                                    Points to earn: {orderData.pointsToEarn}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="p-6 bg-white rounded-lg shadow-sm">
                        <h2 className="mb-4 text-xl font-semibold text-gray-800">
                            Payment Method
                        </h2>

                        {/* Payment Method Selection */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button
                                onClick={() => setPaymentMethod("cash")}
                                className={`p-4 border-2 rounded-lg transition-colors ${paymentMethod === "cash"
                                        ? "border-primary1 bg-primary4/20"
                                        : "border-gray-300 hover:border-primary3"
                                    }`}
                            >
                                <Banknote
                                    size={24}
                                    className={`mx-auto mb-2 ${paymentMethod === "cash" ? "text-primary1" : "text-gray-400"
                                        }`}
                                />
                                <p className="font-medium">Cash</p>
                            </button>

                            <button
                                onClick={() => setPaymentMethod("card")}
                                className={`p-4 border-2 rounded-lg transition-colors ${paymentMethod === "card"
                                        ? "border-primary1 bg-primary4/20"
                                        : "border-gray-300 hover:border-primary3"
                                    }`}
                            >
                                <CreditCard
                                    size={24}
                                    className={`mx-auto mb-2 ${paymentMethod === "card" ? "text-primary1" : "text-gray-400"
                                        }`}
                                />
                                <p className="font-medium">Card</p>
                            </button>
                        </div>

                        {/* Payment Details */}
                        {paymentMethod === "cash" && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Cash Amount Received
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min={orderData.finalTotal}
                                        value={cashAmount}
                                        onChange={(e) => setCashAmount(e.target.value)}
                                        placeholder={`Minimum: ${orderData.finalTotal.toFixed(2)}`}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary1"
                                    />
                                </div>

                                {cashAmount && change > 0 && (
                                    <div className="p-3 rounded-lg bg-blue-50">
                                        <p className="font-medium text-blue-800">
                                            Change to return: LKR {change.toFixed(2)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {paymentMethod === "card" && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Card Number
                                    </label>
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        value={cardDetails.cardNumber}
                                        onChange={handleCardInputChange}
                                        placeholder="1234 5678 9012 3456"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary1"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Cardholder Name
                                    </label>
                                    <input
                                        type="text"
                                        name="cardholderName"
                                        value={cardDetails.cardholderName}
                                        onChange={handleCardInputChange}
                                        placeholder="John Doe"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary1"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Expiry Date
                                        </label>
                                        <input
                                            type="text"
                                            name="expiryDate"
                                            value={cardDetails.expiryDate}
                                            onChange={handleCardInputChange}
                                            placeholder="MM/YY"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary1"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            CVV
                                        </label>
                                        <input
                                            type="text"
                                            name="cvv"
                                            value={cardDetails.cvv}
                                            onChange={handleCardInputChange}
                                            placeholder="123"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary1"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pay Button */}
                        <button
                            onClick={processOrder}
                            disabled={loading}
                            className="w-full py-3 mt-6 font-medium text-white transition-colors rounded-lg bg-primary1 hover:bg-primary2 disabled:opacity-50"
                        >
                            {loading
                                ? "Processing Payment..."
                                : `Pay LKR ${orderData.finalTotal.toFixed(2)}`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPayment;

