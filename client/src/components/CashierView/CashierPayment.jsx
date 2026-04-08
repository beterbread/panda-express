import { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext, CashierIdContext, PageContext } from './CashierView';
import axios from 'axios';

function CashierPayment() {
    const { page, setPage } = useContext(PageContext);
    const { cart, setCart } = useContext(CartContext);
    const { cashierId } = useContext(CashierIdContext);
    const navigate = useNavigate(); // Initialize navigate

    const [selectedPaymentType, setSelectedPaymentType] = useState(null);
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
  
      try {
          const orderData = {
              cashier_id: cashierId,
              cart, // Send the cart data
              total_price: total, // Total price calculated
              payment_type: selectedPaymentType,
          };
          console.log(cashierId);
  
          // Send a POST request to your server to create a new order
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/order/create`, orderData);
          if (response.data.success) {
              navigate('/cashier/order'); // Redirect to the complete screen
              setCart([]);
          } 
      } catch (error) {
          console.error("Error placing order:", error);
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
                'selected-payment',
                selectedPaymentType === key
            );
        });
    }, [selectedPaymentType]);

    return (
        <>
            <Link to="/cashier/order">
                <button className='default-button-black' id='back-button'>Back</button>
            </Link>
            <div className='main-container' id='payment-container'>
                <h1 className='subTitle'>Total:</h1>
                <div className='text-container' id='payment-cost-text'>
                    <div className='cost-text'>
                        <p>Subtotal:</p><p>${subtotal.toFixed(2)}</p>
                    </div>
                    <div className='cost-text'>
                        <p>Estimated Tax:</p><p>${tax.toFixed(2)}</p>
                    </div>
                    <div className='cost-text'>
                        <p>Order Total:</p><p>${total.toFixed(2)}</p>
                    </div>
                </div>

                <div className="payment-options">
                    <button className='default-button-black payment-type-button'
                        ref={(el) => (paymentRefs.current.credit = el)}
                        onClick={() => handlePaymentSelection('credit')}
                    >
                        Credit
                    </button>
                    <button className='default-button-black payment-type-button'
                        ref={(el) => (paymentRefs.current.debit = el)}
                        onClick={() => handlePaymentSelection('debit')}
                    >
                        Debit
                    </button>
                    <button className='default-button-black payment-type-button'
                        ref={(el) => (paymentRefs.current.mealSwipe = el)}
                        onClick={() => handlePaymentSelection('mealSwipe')}
                    >
                        Meal Swipe
                    </button>
                    <button className='default-button-black payment-type-button'
                        ref={(el) => (paymentRefs.current.giftCard = el)}
                        onClick={() => handlePaymentSelection('giftCard')}
                    >
                        Gift Card
                    </button>
                </div>

                <button
                    className='default-button-black'
                    id='pay-now-button'
                    onClick={handlePayNow}
                >
                    PAY NOW
                </button>
            </div>
        </>
    );
}

export default CashierPayment;
