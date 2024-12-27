import SellerAuthenticationModel from "../models/Seller_authentication_platform.js";

// Get seller by ID
export const getSelleraccountbyId = async (req, res) => {
  try {
    const { id } = req.params;
    const selleraccount = await SellerAuthenticationModel.findById(id);

    if (!selleraccount) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json(selleraccount);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving account data", error });
  }
};

// Update seller by ID
export const updateSelleraccount = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (req.file) {
      updates.LogoImageFile = req.file.filename;
    }

    const updatedSeller = await SellerAuthenticationModel.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    if (!updatedSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json(updatedSeller);
  } catch (error) {
    res.status(500).json({ message: "Error updating seller account", error });
  }
};

// Delete seller by ID
export const deleteSelleraccount = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSeller = await SellerAuthenticationModel.findByIdAndDelete(id);

    if (!deletedSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json({ message: "Seller account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting seller account", error });
  }
};
