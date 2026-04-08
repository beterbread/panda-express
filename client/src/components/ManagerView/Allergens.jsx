import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import './styles/Allergens.css'; // Ensure you have appropriate styles
import { PageContext } from './ManagerView';
import { Translate } from '../Translation/TranslationWrapper';

function Allergens() {
  const { setPage } = useContext(PageContext);
  useEffect(() => {
    setPage("allergens");
  }, []);

  const [allergens, setAllergens] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newAllergen, setNewAllergen] = useState({
    allergen_name: ""
  });

  // State for editing
  const [editAllergenId, setEditAllergenId] = useState(null);
  const [updatedAllergen, setUpdatedAllergen] = useState({
    allergen_id: "",
    allergen_name: ""
  });

  // State for linking allergens to items
  const [isLinkModalVisible, setIsLinkModalVisible] = useState(false);
  const [currentAllergenId, setCurrentAllergenId] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});

  useEffect(() => {
    // Fetch allergens when the component mounts
    async function fetchAllergens() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/manager/allergens/get`);
        setAllergens(response.data);
      } catch (error) {
        console.error("Error fetching allergens:", error);
      }
    }
    fetchAllergens();
  }, []);

  // Fetch items and existing links when the link modal is opened
  useEffect(() => {
    if (isLinkModalVisible && currentAllergenId !== null) {
      async function fetchItems() {
        try {
          // Fetch all items
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/manager/item/get`);
          setItems(response.data);

          // Fetch existing links for the allergen
          const linksResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/manager/allergen/${currentAllergenId}/items`);
          const linkedItems = linksResponse.data;

          // Initialize selectedItems based on existing links
          const selected = {};
          linkedItems.forEach(link => {
            selected[link.item_id] = true;
          });
          setSelectedItems(selected);
        } catch (error) {
          console.error("Error fetching items or linked items:", error);
        }
      }
      fetchItems();
    }
  }, [isLinkModalVisible, currentAllergenId]);

  // Handle input changes for adding a new allergen
  const handleNewInputChange = (e) => {
    const { name, value } = e.target;
    setNewAllergen((prevAllergen) => ({ ...prevAllergen, [name]: value }));
  };

  // Handle adding a new allergen
  const handleAddAllergen = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/manager/allergens/add`, newAllergen);
      setAllergens((prevAllergens) => [...prevAllergens, response.data]);
      setNewAllergen({ allergen_name: "" });
      setIsFormVisible(false); // Hide the form after adding the allergen
    } catch (error) {
      console.error("Error adding allergen:", error);
    }
  };

  // Toggle the visibility of the add new allergen form
  const toggleFormVisibility = () => {
    setIsFormVisible((prevVisibility) => !prevVisibility);
  };

  // Handle clicking the "Edit" button
  const handleEditClick = (allergen) => {
    setEditAllergenId(allergen.allergen_id);
    setUpdatedAllergen({ ...allergen });
  };

  // Handle input changes when editing an allergen
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedAllergen((prevAllergen) => ({ ...prevAllergen, [name]: value }));
  };

  // Handle saving the edited allergen
  const handleSaveClick = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/manager/allergens/update`, updatedAllergen);
      setAllergens((prevAllergens) =>
        prevAllergens.map((allergen) =>
          allergen.allergen_id === updatedAllergen.allergen_id ? updatedAllergen : allergen
        )
      );
      setEditAllergenId(null);
    } catch (error) {
      console.error("Error updating allergen:", error);
    }
  };

  // Handle canceling the edit
  const handleCancelClick = () => {
    setEditAllergenId(null);
  };

  // Handle clicking the "Link" button
  const handleLinkClick = (allergen) => {
    setCurrentAllergenId(allergen.allergen_id);
    setIsLinkModalVisible(true);
  };

  // Handle item selection in the modal
  const handleItemSelection = (itemId) => {
    setSelectedItems((prevSelected) => {
      const newSelected = { ...prevSelected };
      if (newSelected[itemId]) {
        delete newSelected[itemId];
      } else {
        newSelected[itemId] = true;
      }
      return newSelected;
    });
  };

  // Handle submitting the link form
  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    try {
      const linkedItemIds = Object.keys(selectedItems).map((itemId) => parseInt(itemId));
      await axios.post(`${import.meta.env.VITE_API_URL}/api/manager/allergen/${currentAllergenId}/link-items`, {
        item_ids: linkedItemIds
      });
      setIsLinkModalVisible(false);
      alert("Items linked successfully!");
    } catch (error) {
      console.error("Error linking items:", error);
      alert("Failed to link items.");
    }
  };

  return (
    <div className="allergens">
      <h1 className='pageTitle'><Translate>Allergens</Translate></h1>

      <div className="table-container">
        <table className="allergens-table">
            <thead className='table-header'>
              <tr>
                  <th><Translate>Allergen ID</Translate></th>
                  <th><Translate>Allergen Name</Translate></th>
                  <th><Translate>Actions</Translate></th>
              </tr>
            </thead>
            <tbody>
            {allergens.map((allergen, index) => (
                <tr key={index}>
                {editAllergenId === allergen.allergen_id ? (
                    // Render input fields for editing
                    <>
                    <td>{allergen.allergen_id}</td>
                    <td>
                        <input
                        type="text"
                        name="allergen_name"
                        value={updatedAllergen.allergen_name}
                        onChange={handleEditInputChange}
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
                    <td>{allergen.allergen_id}</td>
                    <td><Translate>{allergen.allergen_name}</Translate></td>
                    <td>
                        <button className='smaller-buttons-black' onClick={() => handleEditClick(allergen)}><Translate>Edit</Translate></button>
                        <button className='smaller-buttons-black' onClick={() => handleLinkClick(allergen)}><Translate>Link</Translate></button>
                    </td>
                    </>
                )}
                </tr>
            ))}
            {isFormVisible && (
                <tr>
                  <td colSpan="3">
                      <form onSubmit={handleAddAllergen} className="allergens-form">
                        <input
                            type="text"
                            name="allergen_name"
                            placeholder="Allergen Name"
                            value={newAllergen.allergen_name}
                            onChange={handleNewInputChange}
                            required
                        />
                      <button className='smaller-buttons-black' type="submit"><Translate>Add</Translate></button>
                      </form>
                      
                  </td>
                </tr>
            )}
            </tbody>
        </table>

      <button onClick={toggleFormVisibility} className="default-button-black" id='add-allergen-button'>
        <Translate>{isFormVisible ? "Cancel" : "Add New Allergen"}</Translate>
      </button>

      </div>      
      {isLinkModalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h3 className='subTitle'><Translate>Link Allergen to Items</Translate></h3>
            <p className='smaller-subTitile'><Translate>Allergen ID:</Translate> {currentAllergenId}</p>
            <form onSubmit={handleLinkSubmit}>
              <table className="link-table">
                <thead>
                  <tr>
                    <th><Translate>Select</Translate></th>
                    <th><Translate>Item ID</Translate></th>
                    <th><Translate>Item Name</Translate></th>
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

export default Allergens;
