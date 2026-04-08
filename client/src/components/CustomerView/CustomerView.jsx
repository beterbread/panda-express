import "./styles/CustomerView.css";
import { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import Header from "./CustomerHeader";
import Chat from "./Chat";

export const CustomerIdContext = createContext();
export const CartContext = createContext();
export const MealTypeContext = createContext();
export const PageContext = createContext();

export const TotalContext = createContext;
export const ExtraContext = createContext;

function CustomerView() {
  const [customerId, setCustomerId] = useState(-1);
  const [cart, setCart] = useState([]);
  const [mealType, setMealType] = useState("");
  const [page, setPage] = useState("Log In / Sign Up");
  const [chatVisible, setChatVisible] = useState(false); // Track chat visibility

  const toggleChat = () => setChatVisible(!chatVisible); // Function to toggle chat visibility

  return (
    <>
      {page !== "Registration" && page !== "Payment" && page !== "Complete" && (
        <PageContext.Provider value={{ page, setPage }}>
          <CustomerIdContext.Provider value={{ customerId, setCustomerId }}>
            <Header />
          </CustomerIdContext.Provider>
        </PageContext.Provider>
      )}
      <main>
        <PageContext.Provider value={{ page, setPage }}>
          <MealTypeContext.Provider value={{ mealType, setMealType }}>
            <CartContext.Provider value={{ cart, setCart }}>
              <CustomerIdContext.Provider value={{ customerId, setCustomerId }}>
                <Outlet />
              </CustomerIdContext.Provider>
            </CartContext.Provider>
          </MealTypeContext.Provider>
        </PageContext.Provider>
      </main>

      {/* Chat toggle button with accessibility features */}
      {page !== "Payment" && page !== "Complete" && (
        <button
          className="chat-toggle"
          onClick={toggleChat} // Toggle visibility on click
          aria-label={chatVisible ? "Close chat" : "Open chat"}
          tabIndex="0"
        >
          {chatVisible ? "Close Chat" : "Open Chat"}
        </button>
      )}

      {/* Display Chat only if visible */}
      {chatVisible && <Chat />}
    </>
  );
}

export default CustomerView;
