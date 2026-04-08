import { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext, CustomerIdContext, PageContext } from "./CustomerView";
import "./styles/Payment.css";
import axios from "axios";
import { Translate } from "../Translation/TranslationWrapper";

// Loading spinner component
function LoadingSpinner() {
  return (
    <div className="loading-screen" aria-live="polite">
      <div className="spinner" aria-hidden="true"></div>
      <p><Translate>Processing payment...</Translate></p>
    </div>
  );
}

function Payment() {
  const { page, setPage } = useContext(PageContext);
  const { cart, setCart } = useContext(CartContext);
  const { customerId } = useContext(CustomerIdContext);
  const navigate = useNavigate(); // Initialize navigate

  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for payment processing

  const paymentRefs = useRef({
    credit: null,
    debit: null,
    mealSwipe: null,
    giftCard: null,
  });

  useEffect(() => {
    setPage("Payment");
  }, [setPage]);

  const handlePayNow = async () => {
    if (!selectedPaymentType) {
      alert("Please select a payment type.");
      return;
    }

    // Make sure to calculate the total first
    const { subtotal, tax, total } = calculateTotal();

    setLoading(true); // Set loading to true when processing starts

    try {
      const orderData = {
        customer_id: customerId,
        cart, // Send the cart data
        total_price: total, // Total price calculated
        payment_type: selectedPaymentType,
      };

      // Send a POST request to your server to create a new order
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/order/create`,
        orderData
      );
      if (response.data.success) {
        // Handle success: navigate to the "complete" screen
        setCart([]);
        navigate("/kiosk/complete"); // Redirect to the complete screen
      } else {
        // Handle failure: show an error message
        alert("There was an error placing the order.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("There was an error placing your order.");
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((total, item) => total + item.total_price, 0);
    const tax = subtotal * 0.08;
    return { subtotal, tax, total: subtotal + tax };
  };

  const { subtotal, tax, total } = calculateTotal();

  const handlePaymentSelection = (type) => {
    setSelectedPaymentType((prevType) => (prevType === type ? null : type));
  };

  useEffect(() => {
    Object.keys(paymentRefs.current).forEach((key) => {
      paymentRefs.current[key].classList.toggle(
        "selected-payment",
        selectedPaymentType === key
      );
    });
  }, [selectedPaymentType]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Link to="/" aria-label="Back to home">
        <button className="default-button-black" id="back-button">
          <Translate>Back</Translate>
        </button>
      </Link>
      <div className="main-container" id="payment-container">
        <h1 className="subTitle"><Translate>Total:</Translate></h1>
        <div className="text-container" id="payment-cost-text">
          <div className="cost-text">
            <p><Translate>Subtotal:</Translate></p>
            <p>${subtotal.toFixed(2)}</p>
          </div>
          <div className="cost-text">
            <p><Translate>Estimated Tax:</Translate></p>
            <p>${tax.toFixed(2)}</p>
          </div>
          <div className="cost-text">
            <p><Translate>Order Total:</Translate></p>
            <p>${total.toFixed(2)}</p>
          </div>
        </div>

        <div className="payment-options">
          <button
            className="default-button-black payment-type-button"
            ref={(el) => (paymentRefs.current.credit = el)}
            onClick={() => handlePaymentSelection("credit")}
            aria-label="Select Credit payment type"
          >
            <Translate>Credit</Translate>
          </button>
          <button
            className="default-button-black payment-type-button"
            ref={(el) => (paymentRefs.current.debit = el)}
            onClick={() => handlePaymentSelection("debit")}
            aria-label="Select Debit payment type"
          >
            <Translate>Debit</Translate>
          </button>
          <button
            className="default-button-black payment-type-button"
            ref={(el) => (paymentRefs.current.mealSwipe = el)}
            onClick={() => handlePaymentSelection("mealSwipe")}
            aria-label="Select Meal Swipe payment type"
          >
            <Translate>Meal Swipe</Translate>
          </button>
          <button
            className="default-button-black payment-type-button"
            ref={(el) => (paymentRefs.current.giftCard = el)}
            onClick={() => handlePaymentSelection("giftCard")}
            aria-label="Select Gift Card payment type"
          >
            <Translate>Gift Card</Translate>
          </button>
        </div>

        <button
          className="default-button-black"
          id="pay-now-button"
          onClick={handlePayNow}
          aria-label="Proceed to pay now"
        >
          <Translate>PAY NOW</Translate>
        </button>
      </div>
    </>
  );
}

export default Payment;
