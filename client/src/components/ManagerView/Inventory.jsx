import './styles/Inventory.css';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import './styles/Inventory.css'; // Ensure you have appropriate styles
import { PageContext } from './ManagerView';
import { Translate } from '../Translation/TranslationWrapper';

function Inventory() {
    const { setPage } = useContext(PageContext);
    useEffect(() => {
        setPage("inventory");
      }, []);
    const [inventoryItems, setInventoryItems] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [newItem, setNewItem] = useState({
        ingredient_name: "",
        quantity: "",
        unit_of_measure: "",
        reorder_level: "",
        unit_price: ""
    });

    // State for editing
    const [editItemId, setEditItemId] = useState(null);
    const [updatedItem, setUpdatedItem] = useState({
        ingredient_id: "",
        ingredient_name: "",
        quantity: "",
        unit_of_measure: "",
        reorder_level: "",
        unit_price: ""
    });

    // State for linking ingredients to items
    const [isLinkModalVisible, setIsLinkModalVisible] = useState(false);
    const [currentIngredientId, setCurrentIngredientId] = useState(null);
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});
    const [servingSizes, setServingSizes] = useState({});

    useEffect(() => {
        // Fetch inventory items when the component mounts
        async function fetchInventoryItems() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/manager/inventory/get`);
                setInventoryItems(response.data);
            } catch (error) {
                console.error("Error fetching inventory items:", error);
            }
        }
        fetchInventoryItems();
    }, []);

    // Fetch items and existing links when the link modal is opened
    useEffect(() => {
        if (isLinkModalVisible && currentIngredientId !== null) {
            async function fetchItems() {
                try {
                    // Fetch all items
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/manager/item/get`);
                    setItems(response.data);

                    // Fetch existing links for the ingredient
                    const linksResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/manager/ingredient/${currentIngredientId}/items`);
                    const linkedItems = linksResponse.data;

                    // Initialize selectedItems and servingSizes based on existing links
                    const selected = {};
                    const servings = {};
                    linkedItems.forEach(link => {
                        selected[link.item_id] = true;
                        servings[link.item_id] = link.serving_size;
                    });
                    setSelectedItems(selected);
                    setServingSizes(servings);
                } catch (error) {
                    console.error("Error fetching items or linked items:", error);
                }
            }
            fetchItems();
        }
    }, [isLinkModalVisible, currentIngredientId]);

    // Handle input changes for adding a new item
    const handleNewInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem((prevItem) => ({ ...prevItem, [name]: value }));
    };

    // Handle adding a new item
    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/manager/inventory/add`, newItem);
            setInventoryItems((prevItems) => [...prevItems, response.data]);
            setNewItem({ ingredient_name: "", quantity: "", unit_of_measure: "", reorder_level: "", unit_price: "" });
            setIsFormVisible(false); // Hide the form after adding the item
        } catch (error) {
            console.error("Error adding inventory item:", error);
        }
    };

    // Toggle the visibility of the add new item form
    const toggleFormVisibility = () => {
        setIsFormVisible((prevVisibility) => !prevVisibility);
    };

    // Handle clicking the "Edit" button
    const handleEditClick = (item) => {
        setEditItemId(item.ingredient_id);
        setUpdatedItem({ ...item });
    };

    // Handle input changes when editing an item
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedItem((prevItem) => ({ ...prevItem, [name]: value }));
    };

    // Handle saving the edited item
    const handleSaveClick = async () => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/manager/inventory/update`, updatedItem);
            setInventoryItems((prevItems) =>
                prevItems.map((item) =>
                    item.ingredient_id === updatedItem.ingredient_id ? updatedItem : item
                )
            );
            setEditItemId(null);
        } catch (error) {
            console.error("Error updating inventory item:", error);
        }
    };

    // Handle canceling the edit
    const handleCancelClick = () => {
        setEditItemId(null);
    };

    // Handle clicking the "Link" button
    const handleLinkClick = (item) => {
        setCurrentIngredientId(item.ingredient_id);
        setIsLinkModalVisible(true);
    };

    // Handle item selection in the modal
    const handleItemSelection = (itemId) => {
        setSelectedItems((prevSelected) => {
            const newSelected = { ...prevSelected };
            if (newSelected[itemId]) {
                delete newSelected[itemId];
                setServingSizes((prevSizes) => {
                    const newSizes = { ...prevSizes };
                    delete newSizes[itemId];
                    return newSizes;
                });
            } else {
                newSelected[itemId] = true;
                setServingSizes((prevSizes) => ({
                    ...prevSizes,
                    [itemId]: ""
                }));
            }
            return newSelected;
        });
    };

    // Handle serving size input change
    const handleServingSizeChange = (itemId, value) => {
        if (selectedItems[itemId]) {
            setServingSizes((prevSizes) => ({
                ...prevSizes,
                [itemId]: value
            }));
        }
    };

    // Handle submitting the link form
    const handleLinkSubmit = async (e) => {
        e.preventDefault();
        try {
            const linkedItems = Object.keys(selectedItems).map((itemId) => ({
                item_id: itemId,
                serving_size: servingSizes[itemId] || 0
            }));
            await axios.post(`${import.meta.env.VITE_API_URL}/api/manager/ingredient/${currentIngredientId}/link-items`, {
                linkedItems
            });
            setIsLinkModalVisible(false);
            alert("Items linked successfully!");
        } catch (error) {
            console.error("Error linking items:", error);
            alert("Failed to link items.");
        }
    };

    return (
        <div className="container" id="inventory-container">
            <h3 className='pageTitle'><Translate>Inventory</Translate></h3>

            <table className='table-container' id='inventory-table'>
                <tbody>
                    <tr className='table-header'>
                            <th><Translate>Ingredient ID</Translate></th>
                            <th><Translate>Ingredient Name</Translate></th>
                            <th><Translate>Quantity</Translate></th>
                            <th><Translate>Unit Of Measure</Translate></th>
                            <th><Translate>Reorder Level</Translate></th>
                            <th><Translate>Unit Price</Translate></th>
                            <th><Translate>Actions</Translate></th>
                        </tr>
                    {inventoryItems.map((item, index) => (
                        <tr key={index}>
                            {editItemId === item.ingredient_id ? (
                                // Render input fields for editing
                                <>
                                    <td>{item.ingredient_id}</td>
                                    <td>
                                        <input
                                            type="text"
                                            name="ingredient_name"
                                            value={updatedItem.ingredient_name}
                                            onChange={handleEditInputChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={updatedItem.quantity}
                                            onChange={handleEditInputChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="unit_of_measure"
                                            value={updatedItem.unit_of_measure}
                                            onChange={handleEditInputChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            name="reorder_level"
                                            value={updatedItem.reorder_level}
                                            onChange={handleEditInputChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            name="unit_price"
                                            value={updatedItem.unit_price}
                                            onChange={handleEditInputChange}
                                        />
                                    </td>
                                    <td>
                                        <button className='smaller-buttons-black' onClick={handleSaveClick}>Save</button>
                                        <button className='smaller-buttons-black' onClick={handleCancelClick}>Cancel</button>
                                    </td>
                                </>
                            ) : (
                                // Render regular row
                                <>
                                    <td>{item.ingredient_id}</td>
                                    <td><Translate>{item.ingredient_name}</Translate></td>
                                    <td>{item.quantity}</td>
                                    <td>{item.unit_of_measure}</td>
                                    <td>{item.reorder_level}</td>
                                    <td>${item.unit_price}</td>
                                    <td>
                                        <button className='smaller-buttons-black' onClick={() => handleEditClick(item)}><Translate>Edit</Translate></button>
                                        <button className='smaller-buttons-black' onClick={() => handleLinkClick(item)}><Translate>Link</Translate></button>
                                    </td>
                                </>
                            )}
                        </tr>

                    ))}
                </tbody>
                    
                
                {isFormVisible && (
                    <tr>
                        <td colSpan="7">
                            <form onSubmit={handleAddItem} className="inventory-form">
                                <input
                                    type="text"
                                    name="ingredient_name"
                                    placeholder="Ingredient Name"
                                    value={newItem.ingredient_name}
                                    onChange={handleNewInputChange}
                                    required
                                />
                                <input
                                    type="number"
                                    name="quantity"
                                    placeholder="Quantity"
                                    value={newItem.quantity}
                                    onChange={handleNewInputChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="unit_of_measure"
                                    placeholder="Unit of Measure"
                                    value={newItem.unit_of_measure}
                                    onChange={handleNewInputChange}
                                    required
                                />
                                <input
                                    type="number"
                                    name="reorder_level"
                                    placeholder="Reorder Level"
                                    value={newItem.reorder_level}
                                    onChange={handleNewInputChange}
                                    required
                                />
                                <input
                                    type="number"
                                    name="unit_price"
                                    placeholder="Unit Price"
                                    value={newItem.unit_price}
                                    onChange={handleNewInputChange}
                                    required
                                />
                                <button className='smaller-buttons-black' type="submit"><Translate>Add</Translate></button>
                            </form>
                        </td>
                    </tr>
                )}
            </table>
            <button onClick={toggleFormVisibility} className="default-button-black" id='add-item-button'>
                <Translate>{isFormVisible ? "Cancel" : "Add New Item"}</Translate>
            </button>

            {isLinkModalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <h3 className="pageTitle"><Translate>Link Ingredient to Items</Translate></h3>
                        <p className='subTitle'><Translate>Ingredient ID: </Translate>{currentIngredientId}</p>
                        <form onSubmit={handleLinkSubmit}>
                            <table className="link-table">
                                <thead>
                                    <tr>
                                        <th><Translate>Select</Translate></th>
                                        <th><Translate>Item ID</Translate></th>
                                        <th><Translate>Item Name</Translate></th>
                                        <th><Translate>Serving Size</Translate></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
                                        <tr key={item.item_id}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems[item.item_id] || false}
                                                    onChange={() => handleItemSelection(item.item_id)}
                                                />
                                            </td>
                                            <td>{item.item_id}</td>
                                            <td><Translate>{item.item_name}</Translate></td>
                                            <td>
                                                <input
                                                    type="number"
                                                    name={`serving_size_${item.item_id}`}
                                                    value={servingSizes[item.item_id] || ''}
                                                    onChange={(e) => handleServingSizeChange(item.item_id, e.target.value)}
                                                    required
                                                    disabled={!selectedItems[item.item_id]}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button className='smaller-buttons-black' type="submit"><Translate>Save Links</Translate></button>
                            <button className='smaller-buttons-black' type="button" onClick={() => setIsLinkModalVisible(false)}><Translate>Close</Translate></button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Inventory;
