import express from "express";
import {
    deleteCustomerById,
    getCustomeraccountbyId,
    updateCustomerById,
} from "../controllers/Customer_account_controller.js";

const Customerdetails = express.Router();

Customerdetails.get("/:id", getCustomeraccountbyId);
Customerdetails.put("/:id", updateCustomerById);
Customerdetails.delete("/:id", deleteCustomerById);

export default Customerdetails;
