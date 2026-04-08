import React, { useState, useContext, useEffect } from "react";
import { CartContext, PageContext } from "./CustomerView";
import "./styles/Order.css";
import { Link } from "react-router-dom";
import { Translate } from "../Translation/TranslationWrapper";

// Import images
import Error from "../../assets/error.png";
import Plate from "../../assets/meals/plate.png";
import Bowl from "../../assets/meals/bowl.png";
import BiggerPlate from "../../assets/meals/bigger-plate.png";
import Appetizer from "../../assets/meals/appetizers.png";
import ALaCarte from "../../assets/meals/a-la-carte.png";
import Drink from "../../assets/meals/drinks.png";

function Order() {
  const { page, setPage } = useContext(PageContext);
  const { cart, setCart } = useContext(CartContext);

  const [mealMap, setMealMap] = useState({});
  const [itemMap, setItemMap] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    setPage("Your Cart");
  }, [setPage]);

  // Combined API call to fetch both meals and items
  useEffect(() => {
    const fetchData = async () => {
      try {
        const mealResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/menu_name`
        );
        const mealData = await mealResponse.json();
        const itemResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/item`
        );
        const itemData = await itemResponse.json();

        const mealMap = mealData.reduce((map, meal) => {
          map[meal.meal_id] = meal.meal_name;
          return map;
        }, {});

        const itemMap = itemData.reduce((map, item) => {
          map[item.item_id] = item.item_name;
          return map;
        }, {});

        setMealMap(mealMap);
        setItemMap(itemMap);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load items. Please try again later.");
      }
    };
    fetchData();
  }, []);

  // Map meal names to images
  const imageMap = {
    Plate: Plate,
    Bowl: Bowl,
    "Bigger Plate": BiggerPlate,
    Appetizers: Appetizer,
    "A La Carte": ALaCarte,
    Drinks: Drink,
  };

  const handleRemoveItem = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((total, item) => total + item.total_price, 0);
    const tax = subtotal * 0.08;
    return { subtotal, tax, total: subtotal + tax };
  };

  const { subtotal, tax, total } = calculateTotal();

  const isCheckoutDisabled = cart.length === 0 || total <= 0.01;

  const handleCheckoutClick = (e) => {
    if (isCheckoutDisabled) {
      e.preventDefault();
    }
  };

  return (
    <main className="main-container" role="main">
      <div className="container">
        <Link to={"/kiosk/menu"} aria-label="Add more items to your cart">
          <button className="default-button-black" id="add-items-button">
            <Translate>+ ADD MORE ITEMS</Translate>
          </button>
        </Link>

        <div className="red-container">
          {error ? (
            <p className="error" role="alert">{error}</p>
          ) : (
            cart.map((orderItem, index) => (
              <div className="order" key={index} role="listitem">
                <img
                  className="food-img"
                  src={imageMap[mealMap[orderItem.meal_id]] || Error}
                  alt={`Image of ${mealMap[orderItem.meal_id] || "Unknown Meal"}`}
                />
                <div className="order-text">
                  <p id="order-details">
                    <Translate>{mealMap[orderItem.meal_id] || "Unknown Meal"}</Translate>
                  </p>
                  <p id="order-details">
                    <Translate>Size: {orderItem.size}</Translate>
                  </p>
                  <p id="order-details">
                    <Translate>Items:{" "}</Translate>
                    {[...orderItem.side_ids.map((id) => itemMap[id]), ...orderItem.entree_ids.map((id) => itemMap[id]), orderItem.single_item_id ? itemMap[orderItem.single_item_id] : null]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <div className="order-buttons">
                    <button
                      className="default-button-black"
                      id="remove-button"
                      onClick={() => handleRemoveItem(index)}
                      aria-label={`Remove ${mealMap[orderItem.meal_id] || "Unknown Meal"} from cart`}
                    >
                      <Translate>REMOVE</Translate>
                    </button>
                  </div>
                </div>
                <p>${orderItem.total_price.toFixed(2)}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="container">
        <div className="white-container" id="total-container">
          <h1 className="subTitle"><Translate>Total:</Translate></h1>
          <div className="text-container">
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

          <Link to={"/kiosk/payment"} onClick={handleCheckoutClick}>
            <button
              className={`${isCheckoutDisabled ? "disabled-like" : "default-button-black "}`}
              id="checkout-button"
              disabled={isCheckoutDisabled} 
              aria-label="Proceed to checkout"
            >
              <Translate>CHECKOUT</Translate>
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Order;
