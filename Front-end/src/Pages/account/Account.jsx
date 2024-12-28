import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./account.css";

const Account = () => {
  const customerId = localStorage.getItem("customerId");
  const [customer, setCustomer] = useState(null);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    CustomerName: "",
    CustomerEmail: "",
    CustomerAddress: "",
    CustomerPhoneNumber: "",
  });
  const [questions, setQuestions] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/customeraccount/${customerId}`
        );
        setCustomer(response.data);
        setFormData({
          CustomerName: response.data.CustomerName,
          CustomerEmail: response.data.CustomerEmail,
          CustomerAddress: response.data.CustomerAddress,
          CustomerPhoneNumber: response.data.CustomerPhoneNumber,
        });
      } catch (error) {
        console.error("Error fetching customer details:", error);
      }
    };

    if (customerId) {
      fetchCustomerDetails();
    }
  }, [customerId]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/customerreply/reply?customerId=${customerId}`
        );
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    if (customerId) {
      fetchQuestions();
    }
  }, [customerId]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/customerorder/orders?customerId=${customerId}`
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    if (customerId) {
      fetchOrders();
    }
  }, [customerId]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/customeraccount/${customerId}`,
        formData
      );
      setCustomer(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await axios.delete(
          `http://localhost:3000/api/customeraccount/${customerId}`
        );
        localStorage.removeItem("token");
        localStorage.removeItem("customerId");
        navigate("/");
      } catch (error) {
        console.error("Error deleting profile:", error);
      }
    }
  };

  const handleClick = (productId) => {
    navigate(`/Product_details`, { state: { productId } });
  };

  if (!customer) {
    return <p>Loading customer details...</p>;
  }

  return (
    <div>
      <div className="customer-profile-con">
        <img className="customer-profile-image" src="user-logo.png" alt="Profile" />
        <div className="customer-profile-detail-con">
          {isEditing ? (
            <>
              <div className="customer-profile-detail">
                <h5 className="customer-profile-topic">Customer Name:</h5>
                <input
                  type="text"
                  name="CustomerName"
                  value={formData.CustomerName}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              </div>
              <div className="customer-profile-detail">
                <h5 className="customer-profile-topic">Customer Email:</h5>
                <input
                  type="email"
                  name="CustomerEmail"
                  value={formData.CustomerEmail}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              </div>
              <div className="customer-profile-detail">
                <h5 className="customer-profile-topic">Customer Address:</h5>
                <input
                  type="text"
                  name="CustomerAddress"
                  value={formData.CustomerAddress}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              </div>
              <div className="customer-profile-detail">
                <h5 className="customer-profile-topic">Customer Phone Number:</h5>
                <input
                  type="text"
                  name="CustomerPhoneNumber"
                  value={formData.CustomerPhoneNumber}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              </div>
              <div className="profile-button-container">
                <button onClick={handleUpdate} className="profile-save-btn">
                  Save Changes
                </button>
                <button onClick={() => setIsEditing(false)} className="profile-cancel-btn">
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="customer-profile-detail">
                <h5 className="customer-profile-topic">Customer ID:</h5>
                <p className="customer-profile-p">{customer._id}</p>
              </div>
              <div className="customer-profile-detail">
                <h5 className="customer-profile-topic">Customer Name:</h5>
                <p className="customer-profile-p">{customer.CustomerName}</p>
              </div>
              <div className="customer-profile-detail">
                <h5 className="customer-profile-topic">Customer Email:</h5>
                <p className="customer-profile-p">{customer.CustomerEmail}</p>
              </div>
              <div className="customer-profile-detail">
                <h5 className="customer-profile-topic">Customer Address:</h5>
                <p className="customer-profile-p">{customer.CustomerAddress}</p>
              </div>
              <div className="customer-profile-detail">
                <h5 className="customer-profile-topic">Customer Phone Number:</h5>
                <p className="customer-profile-p">{customer.CustomerPhoneNumber}</p>
              </div>
              <div className="profile-button-container">
                <button onClick={() => setIsEditing(true)} className="profile-edit-btn">
                  Edit Profile
                </button>
                <button onClick={handleDelete} className="profile-delete-btn">
                  Delete Account
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="new-customer-order-container">
        <h3 className="customer-chat-head">My Orders</h3>
        <table className="new-customer-order-tbl">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td data-label="Order ID">{order.orderId}</td>
                <td data-label="Product Name">{order.productId?.ProductName}</td>
                <td data-label="Quantity">{order.quantity}</td>
                <td data-label="Price">{order.price}</td>
                <td
                  data-label="Status"
                  className={`new-order-${order.status.toLowerCase()}`}
                >
                  {order.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="customer-chat-container">
        <h3 className="customer-chat-head">My Chat</h3>
        <div className="customer-chat-tbl_content">
          <table className="customer-chat-tbl">
            <thead>
              <tr>
                <th></th>
                <th>Product Name</th>
                <th>Question</th>
                <th>Answer</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => (
                <tr
                  key={question._id}
                  onClick={() => handleClick(question.ProductID._id)}
                >
                  <td>
                    <img
                      className="customer-chat-table-image"
                      src={
                        `http://localhost:3000/uploads/${question.ProductID.ImageFile}` ||
                        "product.png"
                      }
                      alt="product"
                    />
                  </td>
                  <td data-label="Product Name">{question.ProductID.ProductName}</td>
                  <td data-label="Question" className="customer-chat-qa">
                    {question.Question}
                  </td>
                  <td
                    data-label="Answer"
                    className={`customer-chat-qa ${question.Answer}`}
                  >
                    {question.Answer}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Account;