import axios from 'axios';
import './styles/Update.css';
import React, { useContext, useEffect, useState } from 'react';
import { PageContext } from './ManagerView';
import { Translate } from '../Translation/TranslationWrapper';

function Update() {
  const { setPage } = useContext(PageContext);
  useEffect(() => {
    setPage("update");
  }, []);
  
  const [items, setItems] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newItem, setNewItem] = useState({
    item_category: "",
    item_name: "",
    extra_charge: "",
    calories: "",
    total_fat: "",
    cholesterol: "",
    sodium: "",
    total_carb: "",
    protein: "",
    serving_size: ""
  });

  const [editItemId, setEditItemId] = useState(null);
  const [updatedItem, setUpdatedItem] = useState({});

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/manager/item/get`);
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    }
    fetchItems();
  }, []);

  const handleNewInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prevItem) => ({ ...prevItem, [name]: value }));
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/manager/item/add`, newItem);
      setItems((prevItems) => [...prevItems, response.data]);
      setNewItem({
        item_category: "",
        item_name: "",
        extra_charge: "",
        calories: "",
        total_fat: "",
        cholesterol: "",
        sodium: "",
        total_carb: "",
        protein: "",
        serving_size: ""
      });
      setIsFormVisible(false); // Hide the form after adding the item
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item.");
    }
  };

  const toggleFormVisibility = () => {
    setIsFormVisible((prevVisibility) => !prevVisibility);
  };

  const handleEditClick = (item) => {
    setEditItemId(item.item_id);
    setUpdatedItem({ ...item });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedItem((prevItem) => ({ ...prevItem, [name]: value }));
  };

  const handleSaveClick = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/manager/item/update`, updatedItem);
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.item_id === updatedItem.item_id ? updatedItem : item
        )
      );
      setEditItemId(null);
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item.");
    }
  };

  const handleCancelClick = () => {
    setEditItemId(null);
  };

  return (
    <div className="update">
      <h3 className='pageTitle'><Translate>Update Items</Translate></h3>
      <div className='table-container'>
        <table className="update-table">
          <thead>
            <tr className='table-header'>
              <th><Translate>Item ID</Translate></th>
              <th><Translate>Item Category</Translate></th>
              <th><Translate>Item Name</Translate></th>
              <th><Translate>Extra Charge</Translate></th>
              <th><Translate>Calories</Translate></th>
              <th><Translate>Total Fat</Translate></th>
              <th><Translate>Cholesterol</Translate></th>
              <th><Translate>Sodium</Translate></th>
              <th><Translate>Total Carb</Translate></th>
              <th><Translate>Protein</Translate></th>
              <th><Translate>Serving Size</Translate></th>
              <th><Translate>Actions</Translate></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.item_id}>
                {editItemId === item.item_id ? (
                  // Render input fields for editing
                  <>
                    <td>{item.item_id}</td>
                    <td>
                      <input
                        className="edit-table-input"
                        type="text"
                        name="item_category"
                        value={updatedItem.item_category}
                        onChange={handleEditInputChange}
                        required
                      />
                    </td>
                    <td>
                      <input
                        className="edit-table-input"
                        type="text"
                        name="item_name"
                        value={updatedItem.item_name}
                        onChange={handleEditInputChange}
                        required
                      />
                    </td>
                    <td>
                      <input
                        className="edit-table-input"
                        type="number"
                        name="extra_charge"
                        value={updatedItem.extra_charge}
                        onChange={handleEditInputChange}
                        required
                      />
                    </td>
                    <td>
                      <input
                        className="edit-table-input"
                        type="number"
                        name="calories"
                        value={updatedItem.calories}
                        onChange={handleEditInputChange}
                        required
                      />
                    </td>
                    <td>
                      <input
                        className="edit-table-input"
                        type="number"
                        name="total_fat"
                        value={updatedItem.total_fat}
                        onChange={handleEditInputChange}
                        required
                      />
                    </td>
                    <td>
                      <input
                        className="edit-table-input"
                        type="number"
                        name="cholesterol" // Corrected from "cholestrol" to "cholesterol"
                        value={updatedItem.cholesterol}
                        onChange={handleEditInputChange}
                        required
                      />
                    </td>
                    <td>
                      <input
                        className="edit-table-input"
                        type="number"
                        name="sodium"
                        value={updatedItem.sodium}
                        onChange={handleEditInputChange}
                        required
                      />
                    </td>
                    <td>
                      <input
                        className="edit-table-input"
                        type="number"
                        name="total_carb"
                        value={updatedItem.total_carb}
                        onChange={handleEditInputChange}
                        required
                      />
                    </td>
                    <td>
                      <input
                        className="edit-table-input"
                        type="number"
                        name="protein"
                        value={updatedItem.protein}
                        onChange={handleEditInputChange}
                        required
                      />
                    </td>
                    <td>
                      <input
                        className="edit-table-input"
                        type="number"
                        name="serving_size"
                        value={updatedItem.serving_size}
                        onChange={handleEditInputChange}
                        required
                      />
                    </td>
                    <td>
                      <button className='smaller-buttons-black' onClick={handleSaveClick}><Translate>Save</Translate></button>
                      <button className='smaller-buttons-black' onClick={handleCancelClick}><Translate>Cancel</Translate></button>
                    </td>
                  </>
                ) : (
                  // Render regular row
                  <>
                    <td>{item.item_id}</td>
                    <td><Translate>{item.item_category}</Translate></td>
                    <td><Translate>{item.item_name}</Translate></td>
                    <td>{item.extra_charge}</td>
                    <td>{item.calories}</td>
                    <td>{item.total_fat}</td>
                    <td>{item.cholesterol}</td>
                    <td>{item.sodium}</td>
                    <td>{item.total_carb}</td>
                    <td>{item.protein}</td>
                    <td>{item.serving_size}</td>
                    <td>
                      <button className='smaller-buttons-black' onClick={() => handleEditClick(item)}><Translate>Edit</Translate></button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {isFormVisible && (
              <tr>
                <td colSpan="12">
                  <form onSubmit={handleAddItem} className="update-form">
                    <input
                      type="text"
                      name="item_category"
                      placeholder="Item Category"
                      value={newItem.item_category}
                      onChange={handleNewInputChange}
                      required
                    />
                    <input
                      type="text"
                      name="item_name"
                      placeholder="Item Name"
                      value={newItem.item_name}
                      onChange={handleNewInputChange}
                      required
                    />
                    <input
                      type="number"
                      name="extra_charge"
                      placeholder="Extra Charge"
                      value={newItem.extra_charge}
                      onChange={handleNewInputChange}
                      required
                    />
                    <input
                      type="number"
                      name="calories"
                      placeholder="Calories"
                      value={newItem.calories}
                      onChange={handleNewInputChange}
                      required
                    />
                    <input
                      type="number"
                      name="total_fat"
                      placeholder="Total Fat"
                      value={newItem.total_fat}
                      onChange={handleNewInputChange}
                      required
                    />
                    <input
                      type="number"
                      name="cholesterol" // Corrected from "cholestrol" to "cholesterol"
                      placeholder="Cholesterol"
                      value={newItem.cholesterol}
                      onChange={handleNewInputChange}
                      required
                    />
                    <input
                      type="number"
                      name="sodium"
                      placeholder="Sodium"
                      value={newItem.sodium}
                      onChange={handleNewInputChange}
                      required
                    />
                    <input
                      type="number"
                      name="total_carb"
                      placeholder="Total Carb"
                      value={newItem.total_carb}
                      onChange={handleNewInputChange}
                      required
                    />
                    <input
                      type="number"
                      name="protein"
                      placeholder="Protein"
                      value={newItem.protein}
                      onChange={handleNewInputChange}
                      required
                    />
                    <input
                      type="number"
                      name="serving_size"
                      placeholder="Serving Size"
                      value={newItem.serving_size}
                      onChange={handleNewInputChange}
                      required
                    />
                    {/* Move the Add button inside the form */}
                    <button className='smaller-buttons-black' type="submit"><Translate>Add</Translate></button>
                  </form>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <button onClick={toggleFormVisibility} className='default-button-black' id="add-item-button">
        <Translate>{isFormVisible ? "Cancel" : "Add New Item"}</Translate>
      </button>
    </div>
  );
}

export default Update;
