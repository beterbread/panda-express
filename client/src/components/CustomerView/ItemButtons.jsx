import { useContext, useEffect, useState, useRef } from 'react';
import { MealTypeContext } from './CustomerView';
import './styles/ItemButtons.css';
import axios from 'axios';
import infoIcon from '../../assets/items/info.png'
import NutritionPopup from './NutritionPopup';
import MealConfig from '/src/components/CustomerView/MealConfig.jsx'; 
import './styles/MealType.css';
import { Translate } from '../Translation/TranslationWrapper';


function ItemButtons({
    selectedSides,
    setSelectedSides,
    selectedEntrees,
    setSelectedEntrees,
    selectedSingleItem,
    setSelectedSingleItem,
    selectedSize, 
    setSelectedSize,
}) {
    const { mealType } = useContext(MealTypeContext);
    const [entrees, setEntrees] = useState([]);
    const [sides, setSides] = useState([]);
    const [appetizers, setAppetizers] = useState([]);
    const [alacarte, setAlacarte] = useState([]);
    const [drinks, setDrinks] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupItemID, setPopupItemID] = useState(null);
    
    const [selectedItems, setSelectedItems] = useState({});

    // ref for red outline
    const sizeRefs = useRef({
        Small: null,
        Medium: null,
        Large: null,
    });
    const sideRefs = useRef({});
    const entreeRefs = useRef({});
    const singleItemRefs = useRef({});
  
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

                // FOR BADGES
                const initialSelectedItems = items.reduce((acc, item) => {
                    acc[item.item_id] = 0; 
                    return acc;
                }, {});
                setSelectedItems(initialSelectedItems)
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };
        fetchItems();
    }, []);




    const { maxSides = 0, maxEntrees = 0, isSingleItem = false } = MealConfig[mealType] || {};

    const [images, setImages] = useState({});
    useEffect(() => {
        const loadImages = async () => {
            const imageImports = {};
            imageImports[0] = await import(`../../assets/items/0.png`); // default image set first
            for (let i = 1; i <= 24; i++) {
                try {
                    imageImports[i] = await import(`../../assets/items/${i}.png`);
                } catch (error) {
                    console.warn(`Image for item ${i} not found. Using default.`);
                    imageImports[i] = imageImports[0]; 
                }
            }
            setImages(imageImports);
        };
    
        loadImages();
    }, []);

  //OUTLINE ON PRESS WILL REMOVE WHEN PRESSED AGAIN
    useEffect(() => {
        Object.keys(sideRefs.current).forEach((id) => {
            if (sideRefs.current[id]) {
                sideRefs.current[id].style.outline = selectedSides.includes(id) ? '2px solid red' : '';
            }
        });
        Object.keys(entreeRefs.current).forEach((id) => {
            if (entreeRefs.current[id]) {
                entreeRefs.current[id].style.outline = selectedEntrees.includes(id) ? '2px solid red' : '';
            }
        });
  
        Object.keys(singleItemRefs.current).forEach((id) => { // Declare id properly here
            if (singleItemRefs.current[id]) {
                singleItemRefs.current[id].style.outline = id === selectedSingleItem ? '2px solid red' : '';
        }
    });
    }, [selectedSides, selectedEntrees, selectedSingleItem]);

    const handleSideSelection = (event) => {
        console.log(selectedItems);
        const side_id = event.target.dataset.id;


        if (selectedSides.includes(side_id)) {
            setSelectedSides(selectedSides.filter(id => id !== side_id));
            selectedItems[side_id] =  selectedItems[side_id] - 1;
        } 
        
        
        else if (selectedSides.length < maxSides) {
            setSelectedSides([...selectedSides, side_id]);
            selectedItems[side_id] =  selectedItems[side_id] + 1;
        }
    };
    
    const handleEntreeSelection = (event) => {

        const entree_id = event.target.dataset.id;

    
        if (selectedEntrees.includes(entree_id) && selectedEntrees.length === maxEntrees) {
            setSelectedEntrees(selectedEntrees.filter(id => id !== entree_id));
            selectedItems[entree_id] =  0;
        } 

        else if (selectedEntrees.length < maxEntrees) {
            setSelectedEntrees([...selectedEntrees, entree_id]);
            selectedItems[entree_id] =  selectedItems[entree_id] + 1;
            
        }


    };
    

    const handleSizeSelection = (event) => {
        const selectedSizeValue = event.target.dataset.sz;
        
        if (selectedSize == selectedSizeValue){
            setSelectedSize(null)
        }
        else{
            setSelectedSize(selectedSizeValue)
        }
       
    };
    

    const handleSingleItemSelection = (event) => {
        const item_id = event.target.dataset.id;
    
        if (selectedSingleItem === item_id) {
            setSelectedSingleItem(null);
            selectedItems[item_id] = 0;
        } 
        
        else if (selectedSingleItem === null) {
            setSelectedSingleItem(item_id);
            selectedItems[item_id] = 1;
        }

        else{
            selectedItems[selectedSingleItem] = 0;
            setSelectedSingleItem(item_id);
            selectedItems[item_id] = 1;
        }
    };


    const handleNutritionInfo = (event) => {
        event.stopPropagation(); // this stops the triggering of nutrition info from also triggering outside button. small detail but cool 
        const item_id = event.target.dataset.id;
        setPopupItemID(item_id); 
        setIsPopupOpen(true); 
    };
    

    return (
        <div className='items-main-container'>

    <div className="all-buttons">
        {isPopupOpen && (
            <NutritionPopup
                item_id={popupItemID}
                onClose={() => setIsPopupOpen(false)} // Ensure close button is accessible
                aria-label="Close nutritional information"
            />
        )}
        {mealType === 'Bowl' || mealType === 'Plate' || mealType === 'Bigger Plate' ? (
            <>
                <h2 className='subTitle'><Translate>Side: Pick</Translate> {maxSides}. </h2>
                <div className="side-buttons">
                    {sides.map((item) => (
                        <div key={item.item_id}>
                            <button
                                key={item.item_id}
                                data-id={item.item_id}
                                data-cost={item.extra_charge}
                                onClick={handleSideSelection}
                                ref={el => sideRefs.current[item.item_id] = el}
                                aria-label={`Select ${item.item_name} for an additional ${item.extra_charge}`}
                                aria-describedby={`info-${item.item_id}`} // Description link to nutrition info
                            >
                                <div className='nutrition-icon'>
                                    <button
                                        className='info-button'
                                        data-id={item.item_id}
                                        onClick={handleNutritionInfo}
                                        aria-label={`Show nutritional information for ${item.item_name}`}
                                    >
                                        <img src={infoIcon} alt="Nutritional Information Icon" />
                                    </button>
                                </div>
                                <img
                                    src={images && images[item.item_id]?.default
                                        ? images[item.item_id]?.default
                                        : images[0]?.default || "../../assets/items/0.png"}
                                    alt={`Image of ${item.item_name}`}
                                    aria-hidden="true"
                                />
                                <Translate>{item.item_name}</Translate> {parseFloat(item.extra_charge) ? `+${item.extra_charge}` : ""}
                                {selectedItems[item.item_id] > 0 && (
                                    <div className='badge' aria-live="polite">
                                        {selectedItems[item.item_id]}
                                    </div>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
                <h2 className='subTitle'><Translate>Entree: Pick</Translate> {maxEntrees}</h2>
                <div className="entree-buttons">
                    {entrees.map((item) => (
                        <div key={item.item_id}>
                            <button
                                key={item.item_id}
                                data-id={item.item_id}
                                data-cost={item.extra_charge}
                                onClick={handleEntreeSelection}
                                ref={el => entreeRefs.current[item.item_id] = el}
                                aria-label={`Select ${item.item_name} for an additional ${item.extra_charge}`}
                                aria-describedby={`info-${item.item_id}`}
                            >
                                <div className='nutrition-icon'>
                                    <button
                                        className='info-button'
                                        data-id={item.item_id}
                                        onClick={handleNutritionInfo}
                                        aria-label={`Show nutritional information for ${item.item_name}`}
                                    >
                                        <img src={infoIcon} alt="Nutritional Information Icon" />
                                    </button>
                                </div>
                                <img
                                    src={images && images[item.item_id]?.default
                                        ? images[item.item_id]?.default
                                        : images[0]?.default || "../../assets/items/0.png"}
                                    alt={`Image of ${item.item_name}`}
                                    aria-hidden="true"
                                />
                                <Translate>{item.item_name}</Translate> {parseFloat(item.extra_charge) ? `+${item.extra_charge}` : ""}
                                {selectedItems[item.item_id] > 0 && (
                                    <div className='badge' aria-live="polite">
                                        {selectedItems[item.item_id]}
                                    </div>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </>
        ) : mealType === 'Appetizers' ? (
            <>
                <h2 className='subTitle'><Translate>Appetizers</Translate></h2>
                <div className="appetizer-buttons">
                    {appetizers.map((item) => (
                        <div key={item.item_id}>
                            <button
                                key={item.item_id}
                                data-id={item.item_id}
                                onClick={handleSingleItemSelection}
                                ref={el => singleItemRefs.current[item.item_id] = el}
                                aria-label={`Select ${item.item_name} for an additional ${item.extra_charge}`}
                            >
                                <div className='nutrition-icon'>
                                    <button
                                        className='info-button'
                                        data-id={item.item_id}
                                        onClick={handleNutritionInfo}
                                        aria-label={`Show nutritional information for ${item.item_name}`}
                                    >
                                        <img src={infoIcon} alt="Nutritional Information Icon" />
                                    </button>
                                </div>
                                <img
                                    src={images && images[item.item_id]?.default
                                        ? images[item.item_id]?.default
                                        : images[0]?.default || "../../assets/items/0.png"}
                                    alt={`Image of ${item.item_name}`}
                                    aria-hidden="true"
                                />
                                <Translate>{item.item_name}</Translate> {parseFloat(item.extra_charge) ? `+${item.extra_charge}` : ""}
                                {selectedItems[item.item_id] > 0 && (
                                    <div className='badge' aria-live="polite">
                                        {selectedItems[item.item_id]}
                                    </div>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
                <h3 className='subTitle'><Translate>Size</Translate></h3>
                <div className='size-buttons'>
                    <button
                        onClick={handleSizeSelection}
                        data-sz="Small"
                        className={selectedSize === "Small" ? "selected-size" : ""}
                        aria-pressed={selectedSize === "Small"}
                    >
                        <Translate>Small</Translate>
                    </button>
                    <button
                        onClick={handleSizeSelection}
                        data-sz="Large"
                        className={selectedSize === "Large" ? "selected-size" : ""}
                        aria-pressed={selectedSize === "Large"}
                    >
                        <Translate>Large</Translate>
                    </button>
                </div>
            </>
        ) : mealType === 'A La Carte' ? (
            <>
                <h2 className='subTitle'><Translate>A La Carte</Translate></h2>
                <div className="alacarte-buttons">
                    {alacarte.map((item) => (
                        <div key={item.item_id}>
                            <button
                                key={item.item_id}
                                data-id={item.item_id}
                                data-cost={item.extra_charge}
                                onClick={handleSingleItemSelection}
                                ref={el => singleItemRefs.current[item.item_id] = el}
                                aria-label={`Select ${item.item_name} for an additional ${item.extra_charge}`}
                            >
                                <div className='nutrition-icon'>
                                    <button
                                        className='info-button'
                                        data-id={item.item_id}
                                        onClick={handleNutritionInfo}
                                        aria-label={`Show nutritional information for ${item.item_name}`}
                                    >
                                        <img src={infoIcon} alt="Nutritional Information Icon" />
                                    </button>
                                </div>
                                <img
                                    src={images && images[item.item_id]?.default
                                        ? images[item.item_id]?.default
                                        : images[0]?.default || "../../assets/items/0.png"}
                                    alt={`Image of ${item.item_name}`}
                                    aria-hidden="true"
                                />
                                <Translate>{item.item_name}</Translate> {parseFloat(item.extra_charge) ? `+${item.extra_charge}` : ""}
                                {selectedItems[item.item_id] > 0 && (
                                    <div className='badge' aria-live="polite">
                                        {selectedItems[item.item_id]}
                                    </div>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
                <h3 className='subTitle'><Translate>Size</Translate></h3>
                <div className='size-buttons'>
                    <button
                        onClick={handleSizeSelection}
                        data-sz="Small"
                        className={selectedSize === "Small" ? "selected-size" : ""}
                        aria-pressed={selectedSize === "Small"}
                    >
                        <Translate>Small</Translate>
                    </button>
                    <button
                        onClick={handleSizeSelection}
                        data-sz="Medium"
                        className={selectedSize === "Medium" ? "selected-size" : ""}
                        aria-pressed={selectedSize === "Medium"}
                    >
                        <Translate>Medium</Translate>
                    </button>
                    <button
                        onClick={handleSizeSelection}
                        data-sz="Large"
                        className={selectedSize === "Large" ? "selected-size" : ""}
                        aria-pressed={selectedSize === "Large"}
                    >
                        <Translate>Large</Translate>
                    </button>
                </div>
            </>
        ) : mealType === 'Drinks' ? (
            <>
                <h2 className='subTitle'><Translate>Drinks</Translate></h2>
                <div className="drinks-buttons">
                    {drinks.map((item) => (
                        <div key={item.item_id}>
                            <button
                                key={item.item_id}
                                data-id={item.item_id}
                                data-cost={item.extra_charge}
                                onClick={handleSingleItemSelection}
                                ref={el => singleItemRefs.current[item.item_id] = el}
                                aria-label={`Select ${item.item_name} for an additional ${item.extra_charge}`}
                            >
                                <div className='nutrition-icon'>
                                    <button
                                        className='info-button'
                                        data-id={item.item_id}
                                        onClick={handleNutritionInfo}
                                        aria-label={`Show nutritional information for ${item.item_name}`}
                                    >
                                        <img src={infoIcon} alt="Nutritional Information Icon" />
                                    </button>
                                </div>
                                <img
                                    src={images && images[item.item_id]?.default
                                        ? images[item.item_id]?.default
                                        : images[0]?.default || "../../assets/items/0.png"}
                                    alt={`Image of ${item.item_name}`}
                                    aria-hidden="true"
                                />
                                <Translate>{item.item_name}</Translate> {parseFloat(item.extra_charge) ? `+${item.extra_charge}` : ""}
                                {selectedItems[item.item_id] > 0 && (
                                    <div className='badge' aria-live="polite">
                                        {selectedItems[item.item_id]}
                                    </div>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
                <h3 className='subTitle'><Translate>Size</Translate></h3>
                <div className='size-buttons'>
                    <button
                        onClick={handleSizeSelection}
                        data-sz="Small"
                        className={selectedSize === "Small" ? "selected-size" : ""}
                        aria-pressed={selectedSize === "Small"}
                    >
                        <Translate>Small</Translate>
                    </button>
                    <button
                        onClick={handleSizeSelection}
                        data-sz="Medium"
                        className={selectedSize === "Medium" ? "selected-size" : ""}
                        aria-pressed={selectedSize === "Medium"}
                    >
                        <Translate>Medium</Translate>
                    </button>
                    <button
                        onClick={handleSizeSelection}
                        data-sz="Large"
                        className={selectedSize === "Large" ? "selected-size" : ""}
                        aria-pressed={selectedSize === "Large"}
                    >
                        <Translate>Large</Translate>
                    </button>
                </div>
            </>
        ) : null}
    </div>

</div>

    );
}
export default ItemButtons;