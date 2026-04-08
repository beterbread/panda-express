import React, { useState, useContext, useEffect } from 'react';
import { CartContext } from './CashierView';
import { Link } from 'react-router-dom';
import './styles/POSCart.css';


function Cart() {
    const { cart, setCart } = useContext(CartContext);
    const [mealMap, setMealMap] = useState({});
    const [itemMap, setItemMap] = useState({});
    const [error, setError] = useState(null);



    // Combined API call to fetch both meals and items
    useEffect(() => {
        const fetchData = async () => {
            try {
                const mealResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/menu_name`);
                const mealData = await mealResponse.json();
                const itemResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/item`);
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

    const handleRemoveItem = (index) => {
        setCart((prevCart) => prevCart.filter((_, i) => i !== index));
    };

    const calculateTotal = () => {
        const subtotal = cart.reduce((total, item) => total + item.total_price, 0);
        const tax = subtotal * 0.08;
        return { subtotal, tax, total: subtotal + tax };
    };

    const { subtotal, tax, total } = calculateTotal();

    return (
        <>
            <div className='POS-main-container'>
                <div className=''>
                    <div className='red-container' id='POS-red-container'>
                        {error ? (
                            <p className="error">{error}</p>
                        ) : (
                            cart.map((orderItem, index) => (
                                <div className='order POS-order' key={index}>
                                    <div className='order-text POS-order-text'>
                                        <p>{mealMap[orderItem.meal_id] || "Unknown Meal"}</p>
                                        <p>Size: {orderItem.size}</p>
                                        <p>Items: {[
                                            ...orderItem.side_ids.map(id => itemMap[id]),
                                            ...orderItem.entree_ids.map(id => itemMap[id]),
                                            orderItem.single_item_id ? itemMap[orderItem.single_item_id] : null
                                        ].filter(Boolean).join(', ')}</p>
                                        <div className='order-buttons'>
                                            {/* <button>EDIT</button> */}
                                            <button id='remove-button' onClick={() => handleRemoveItem(index)}>REMOVE</button>
                                        </div>
                                    </div>
                                    <p>${orderItem.total_price.toFixed(2)}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className=''>
                    <div className='white-container' id='total-container'>
                        <div className='text-container'>
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

                        <Link to={'/cashier/pay'}> {/* TO CASHIER CHECKOUT */}
                            <button className='default-button-black' id='checkout-button'>CHECKOUT</button> 
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Cart;