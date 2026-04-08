import React, { useContext, useEffect, useState } from 'react';
import { CartContext, MealTypeContext, PageContext } from './CustomerView';
import { Link } from 'react-router-dom';
import ItemButtons from './ItemButtons';
import MealConfig from '/src/components/CustomerView/MealConfig.jsx'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Translate } from '../Translation/TranslationWrapper';

/*TODO*/
/*

5. error message to avoid half finished meals to cart

7. add a back button to menu

MORE LATER THIS FIRST

*/

/*DONE*/
/*
1. fix images
3. style a little- > mostly button size. not full style
2. fix single item selection logic
4 . Meal Type amounts Entree  =3? 
8. fix potential image centering issues with item
*/


function MealType() {
    const { setPage } = useContext(PageContext);
    const { mealType } = useContext(MealTypeContext);
    const { cart, setCart } = useContext(CartContext);

    const [selectedSides, setSelectedSides] = useState([]);
    const [selectedEntrees, setSelectedEntrees] = useState([]);
    const [selectedSingleItem, setSelectedSingleItem] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [mealId, setMealId] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalExtra, setTotalExtra] = useState(0);

    const navigate = useNavigate();

    const { maxSides = 0, maxEntrees = 0, isSingleItem = false } = MealConfig[mealType] || {};

    useEffect(() => {
        setPage(mealType);
    }, [setPage, mealType]);

    const isMealComplete =
        (["Bowl", "Plate", "Bigger Plate"].includes(mealType) &&
            selectedSides.length === maxSides &&
            selectedEntrees.length === maxEntrees) ||
        (["Appetizers", "A La Carte", "Drinks"].includes(mealType) &&
            selectedSingleItem !== null && selectedSize != null);

    const fetchBasePriceByID = async (meal_id) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/menu/meal-price`, { params: { meal_id } });
            return response.data.price; 
        } catch (error) {
            console.error("Error fetching meal price:", error);
            return 0;
        }
    };

    const fetchMealIdBySize = async (mealName, size) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/meal-id`, { params: { mealName, size } });
            return response.data.meal_id;
        } catch (error) {
            console.error("Error fetching meal_id:", error);
            return null;
        }
    };

    useEffect(() => {
        const fetchMealId = async () => {
            if (["Appetizers", "A La Carte", "Drinks"].includes(mealType) && selectedSize) {
                const id = await fetchMealIdBySize(mealType, selectedSize);
                setMealId(id);
            } else if (["Bowl", "Plate", "Bigger Plate"].includes(mealType)) {
                const defaultMealIds = { "Bowl": 1, "Plate": 2, "Bigger Plate": 3 };
                setMealId(defaultMealIds[mealType]);
            } else {
                setMealId(null);
            }
        };

        fetchMealId();
    }, [mealType, selectedSize]);

    useEffect(() => {
        const fetchExtra = async () => {
            let total_extra_side = 0;
            let total_extra_entree = 0;
            let total_extra_single = 0;

            if (selectedSides.length > 0) {
                for (let i = 0; i < maxSides && i < selectedSides.length; ++i) {
                    let curr_id = selectedSides[i];
                    try {
                        const { data: { extra_charge } } = await axios.get(`${import.meta.env.VITE_API_URL}/api/item/extra`, {
                            params: { item_id: curr_id },
                        });
                        total_extra_side += parseFloat(extra_charge); 
                    } catch (error) {
                        console.error(`Failed to fetch extra for side ${curr_id}:`, error);
                    }
                }
            }

            if (selectedEntrees.length > 0) {
                for (let j = 0; j < maxEntrees && j < selectedEntrees.length; ++j) {
                    let curr_id = selectedEntrees[j];
                    try {
                        const { data: { extra_charge } } = await axios.get(`${import.meta.env.VITE_API_URL}/api/item/extra`, {
                            params: { item_id: curr_id },
                        });
                        total_extra_entree += parseFloat(extra_charge); 
                    } catch (error) {
                        console.error(`Failed to fetch extra for entree ${curr_id}:`, error);
                    }
                }
            }

            if (selectedSingleItem !== null) {
                try {
                    const { data: { extra_charge } } = await axios.get(`${import.meta.env.VITE_API_URL}/api/item/extra`, {
                        params: { item_id: selectedSingleItem },
                    });
                    total_extra_single += parseFloat(extra_charge); 
                } catch (error) {
                    console.error(`Failed to fetch extra for single item ${selectedSingleItem}:`, error);
                }
            }

            let total_extra = parseFloat(total_extra_side + total_extra_entree + total_extra_single); 

            setTotalExtra(total_extra);
        };

        fetchExtra();
    }, [selectedSides, selectedEntrees, selectedSingleItem, maxSides, maxEntrees]);

    useEffect(() => {
        const fetchBasePrice = async () => {
            if (mealId) {
                const price = await fetchBasePriceByID(mealId);
                setTotalPrice(price);
            }
        };
        fetchBasePrice();
    }, [mealId]);

    const handleAddToOrder = () => {
        const newOrder = {
            meal_id: mealId,
            side_ids: selectedSides,
            entree_ids: selectedEntrees,
            single_item_id: selectedSingleItem,
            size: selectedSize,
            total_price: totalPrice
        };
        setCart((prevCart) => [...prevCart, newOrder]);

        setSelectedSides([]);
        setSelectedEntrees([]);
        setSelectedSingleItem(null);
        setSelectedSize(null);

        navigate("/kiosk/cart");
    };

    return (
        <>
            <Link to="/kiosk/menu">
                <button className='back-button default-button-black' aria-label="Go back to menu">
                    <Translate>CANCEL & BACK TO MENU</Translate>
                </button>
            </Link>

            <div className='container' id='meals-container'>
                <ItemButtons
                    selectedSides={selectedSides}
                    setSelectedSides={setSelectedSides}
                    selectedEntrees={selectedEntrees}
                    setSelectedEntrees={setSelectedEntrees}
                    selectedSingleItem={selectedSingleItem}
                    setSelectedSingleItem={setSelectedSingleItem}
                    selectedSize={selectedSize}
                    setSelectedSize={setSelectedSize}
                    totalPrice={totalPrice}
                    setTotalPrice={setTotalPrice}
                    extraExtra={totalExtra}
                />
                <div className="order-button-div">
                    <button
                        className='order-button'
                        onClick={handleAddToOrder}
                        disabled={!isMealComplete}
                        aria-disabled={!isMealComplete}
                    >   
                        <Translate>ADD TO ORDER</Translate> ${(totalPrice + totalExtra).toFixed(2)}
                    </button> 
                </div>
            </div>
        </>
    );
}

export default MealType;
