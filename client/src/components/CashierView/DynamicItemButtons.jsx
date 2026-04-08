import { useContext, useEffect, useState } from 'react';
import {EntreeContext, SideContext, MealTypeContext, CartContext } from './CashierView';
import axios from 'axios';
import './styles/POSDynamicItemButtons.css';

// setItems((prevItems) => [...prevItems, newItem]);

function DynamicItemButtons() {
    const { mealType, setMealType } = useContext(MealTypeContext);
    const {entreeCount, setEntreeCount} = useContext(EntreeContext);
    const {sideCount, setSideCount} = useContext(SideContext);
    const {cart, setCart} = useContext(CartContext);
    
    const [entrees, setEntrees] = useState([]);
    const [sides, setSides] = useState([]);
    const [appetizers, setAppetizers] = useState([]);
    const [alacarte, setAlacarte] = useState([]);
    const [drinks, setDrinks] = useState([]);

    const [mealId, setMealId] = useState(null)
    const [totalPrice, setTotalPrice] = useState(0);
    
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedSingleItem, setSelectedSingleItem] = useState(null);
    const [selectedSides, setSelectedSides] = useState([]);
    const [selectedEntrees, setSelectedEntrees] = useState([]);


    const [ready, setReady] = useState(false);
                                                                                                 


  
    // GET ITEMS FROM DATABASE
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/item`);
                const items = response.data;
                setEntrees(items.filter(item => item.item_category === "Entree"));
                setSides(items.filter(item => item.item_category === "Side"));
                setAppetizers(items.filter(item => item.item_category === "Appetizers"));
                setAlacarte(items.filter(item => item.item_category === "Side" || item.item_category === "Entree"));
                setDrinks(items.filter(item => item.item_category === "Drinks"));
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };
        fetchItems();
    }, []);

    // DETERMINE THE MEAL ID , again we assume meals will not be added, 
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
        const fetchBasePrice = async () => {
            if (mealId) {
                const price = await fetchBasePriceByID(mealId);
                setTotalPrice(price);
            }
        };
        fetchBasePrice();
    }, [mealId]);

    const fetchBasePriceByID = async (meal_id) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/menu/meal-price`, { params: { meal_id } });
            return response.data.price; 
        } catch (error) {
            console.error("Error fetching meal price:", error);
            return 0;
        }
    };




    const handleSideSelection = (event) => {
        const side_id = event.target.dataset.id;
        const side_extra = parseFloat(event.target.dataset.cost) || 0; 
        
        setSideCount(sideCount-1);
        setTotalPrice(totalPrice + side_extra);
        setSelectedSides([...selectedSides, side_id]);

    };
    
    const handleEntreeSelection = (event) => {
        const entree_id = event.target.dataset.id;
        const entree_extra = parseFloat(event.target.dataset.cost) || 0; 

        const newEntreeNum = entreeCount - 1; 
        setEntreeCount(newEntreeNum);
        // why all of this? state sync issues :( 
        const new_price = totalPrice + entree_extra;
        setTotalPrice(new_price);
    
        const new_entree_ary = [...selectedEntrees, entree_id]
           setSelectedEntrees(new_entree_ary);
    
            if (newEntreeNum === 0) {
                setMealType('');
                handleAddToOrder(new_entree_ary, null, new_price);//local vars to again deal with state issues
            }

    };

    const handleSizeSelection = (event) => {
        const selectedSizeValue = event.target.dataset.sz;
        setSideCount(0);

        setSelectedSize((prevSize) => {
            if (prevSize === selectedSizeValue) {
                return null; 
            }
            return selectedSizeValue; 
        });
    };
    

    const handleSingleItemSelection = (event) => {
        const item_id = event.target.dataset.id;
        const single_extra = parseFloat(event.target.dataset.cost) || 0;

        const new_price = totalPrice + single_extra;
        setTotalPrice(new_price);

        setMealType('')
        handleAddToOrder(selectedEntrees, item_id, new_price)
       
    };

    // THIS IS ONLY DONE WHEN CALLED
    const handleAddToOrder = (entreeidsary, singleItem, newtot ) => { // accept local variables to deal with state issues
        const newOrder = {
            meal_id: mealId,
            side_ids: selectedSides,
            entree_ids: entreeidsary,
            single_item_id: singleItem,
            size: selectedSize,
            total_price: newtot
        };
        setCart((prevCart) => [...prevCart, newOrder]);

        setSelectedSides([]);
        setSelectedEntrees([]);
        setSelectedSingleItem(null);
        setSelectedSize(null);
 
    };



    return (
        
        <div className="all-buttons POS-all-buttons">
            {sideCount === 1 ? (
                <>
                    <h2 className='subTitle'>Side</h2>
                    <div className="side-buttons" id='POS-side-buttons'>
                        {sides.map((item) => (
                            <div key={item.item_id}>
                            <button
                                key={item.item_id}
                                data-id={item.item_id}
                                data-cost={item.extra_charge}
                                onClick={handleSideSelection}>

                                {item.item_name}
                            </button>
                            
                            </div>
                        ))}
                    </div>

                </>
            ) : sideCount === 0 && entreeCount >= 1 ? (
                <>
                <h2 className='subTitle'>Entree</h2>
                    <div className="entree-buttons">
                        {entrees.map((item) => (
                            <div key={item.item_id}>
                            <button
                                key={item.item_id}
                                data-id={item.item_id}
                                data-cost={item.extra_charge}
                                onClick={handleEntreeSelection}>
                                {item.item_name}
                            </button>
                            </div>
                        ))}
                    </div>


                </>
            ) : entreeCount === -1 && sideCount === 0 ? (
                <>
                    <h2 className='subTitle'>A La Carte</h2>
                    <div className="alacarte-buttons">
                        {alacarte.map((item) => (
                            <div key={item.item_id}>
                            <button
                                key={item.item_id}
                                data-id={item.item_id}
                                data-cost={item.extra_charge}
                                onClick={handleSingleItemSelection}>
                                {item.item_name}
                            </button>
                            </div>
                        ))}
                        </div>
                </>
            ) : entreeCount === -2 && sideCount === 0 ? (
                <>
                <h2 className='subTitle'>Appetizers</h2>
                    <div className="appetizer-buttons">
                        {appetizers.map((item) => (
                            <div key={item.item_id}>
                            <button
                                key={item.item_id}
                                data-id={item.item_id}
                                onClick={handleSingleItemSelection}>
                                {item.item_name}
                            </button>
                            </div>
                        ))}
                        </div>
                </>
                  ) : entreeCount === -3 && sideCount === 0 ? (
                    <>
                     <h2 className='subTitle'>Drinks</h2>
                        <div className="drinks-buttons">
                            {drinks.map((item) => (
                                <div key={item.item_id}>
                                <button
                                key={item.item_id}
                                data-id={item.item_id}
                                data-cost={item.extra_charge}
                                onClick={handleSingleItemSelection}>
                                {item.item_name}
                            </button>
                            </div>
                        ))}
                        </div>
                    
                    
                    </>
                    ) : entreeCount < 0 && sideCount < 0 && mealType !== "Appetizers" ? ( 
                        <>
                        <h3 className='subTitle'>Sizes</h3>
                        <div className= 'size-buttons'>
                        <button 
                            onClick={handleSizeSelection} 
                            data-sz="Small"
                            className={selectedSize === "Small" ? "selected-size" : ""}
                        >
                            Small
                        </button>
                        <button 
                            onClick={handleSizeSelection} 
                            data-sz="Medium"
                            className={selectedSize === "Medium" ? "selected-size" : ""}
                        >
                            Medium
                        </button>
                        <button 
                            onClick={handleSizeSelection} 
                            data-sz="Large"
                            className={selectedSize === "Large" ? "selected-size" : ""}
                        >
                            Large
                        </button>
                        </div>
                        
                        </>
                    ) : entreeCount < 0 && sideCount < 0 && mealType === "Appetizers" ? ( 
                        <>
                        <h3 className='subTitle'>Sizes</h3>
                        <div className= 'size-buttons'>
                        <button 
                            onClick={handleSizeSelection} 
                            data-sz="Small"
                            className={selectedSize === "Small" ? "selected-size" : ""}
                        >
                            Small  
                        </button>

                        <button 
                            onClick={handleSizeSelection} 
                            data-sz="Large"
                            className={selectedSize === "Large" ? "selected-size" : ""}
                        >
                            Large
                        </button>
                        </div>
                        
                        </>
            ) : null}
        </div>

        



    );
}


export default DynamicItemButtons;