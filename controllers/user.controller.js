const { User, LibraryCard } = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const cloudinary = require("../middleware/cloudinary.js");

const maxAge = 3 * 24 * 60 * 60;
const createToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: maxAge });
};

const bcrypt = require("bcrypt");

const comparePassword = async (password, hashPass) => {
  return await bcrypt.compare(password, hashPass);
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res, next) => {
  try {
    const user = await User(req.body);
    if (req.file) {
      try {
        console.log(req.file);
        const upload = await cloudinary.uploader.upload(req.file.path, {
          folder: "User",
        });
        user.image = upload.secure_url;
      } catch (err) {
        console.log(err);
      }
    }
    const saltRounds = 10;
    const hash = bcrypt.hashSync(user.password, saltRounds);
    user.password = hash;
    await user.save();

    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      try {
        const upload = await cloudinary.uploader.upload(req.file.path, {
          folder: "User",
        });
        updateData.image = upload.secure_url;
      } catch (err) {
        console.error("Upload image error:", err);
        return res.status(500).json({ message: "Failed to upload image" });
      }
    }

    if (updateData.password) {
      const saltRounds = 10;
      const hash = bcrypt.hashSync(updateData.password, saltRounds);
      updateData.password = hash;
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(user);
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: error.message });
  }
};


const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// export const updateUser = async (req, res, next) => {
//   try {
//     const userId = req.user._id;
//     const findUser = await account.findOne({ _id: userId });
//     if (!findUser) {
//       const response = await apiResponse.notFound("Not found your account");
//       return res.status(response.status).json(response.body);
//     }
//     let avatarUploadError = null;
//     if (req.file) {
//       const uploadResult = await uploadImage(req.file);
//       if (uploadResult.error) {
//         avatarUploadError = uploadResult.error;
//       } else {
//         findUser.avatar = uploadResult.url;
//       }
//     }
//   } catch (err) {
//     next(err);
//   }
// };

const addRule = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, detail } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra xem rule đã tồn tại chưa (theo name)
    const ruleExists = user.rules.some(rule => rule.name === name);
    if (ruleExists) {
      return res.status(400).json({ message: "Rule with this name already exists" });
    }

    // Thêm rule nếu chưa tồn tại
    user.rules.push({ name, detail });
    await user.save();

    res.status(200).json({ message: "Rule added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addLibInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const {type, name} = req.body; 
    let detail = req.body.detail;

    if (req.file) {
      console.log(req.file);
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "LibraryInfo",
      });
      detail = result.secure_url;
    }
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const libInfoExists = user.abouts.some(about => about.name === name);
    if (libInfoExists) {
      return res.status(400).json({ message: "Library information with this name already exists" });
    }

    user.abouts.push({ type, name, detail });
    await user.save();

    res.status(200).json({ message: "Library information added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, detail } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra xem rule đã tồn tại chưa (theo name)
    const serviceExists = user.services.some(service => service.name === name);
    if (serviceExists) {
      return res.status(400).json({ message: "Service with this name already exists" });
    }

    // Thêm rule nếu chưa tồn tại
    user.services.push({ name, detail });
    await user.save();

    res.status(200).json({ message: "Service added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const deleteRuleById = async (req, res) => {
  try {
    const { id, ruleId } = req.params;

    const result = await User.updateOne(
      { _id: id },
      { $pull: { rules: { _id: ruleId } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Rule not found or already deleted" });
    }

    res.status(200).json({ message: "Rule deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteLibInfoById = async (req, res) => {
  try {
    const { id, libInfoId } = req.params;

    const result = await User.updateOne(
      { _id: id },
      { $pull: { abouts: { _id: libInfoId } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Library information not found or already deleted" });
    }

    res.status(200).json({ message: "Library information deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteServiceById = async (req, res) => {
  try {
    const { id, serviceId } = req.params;

    const result = await User.updateOne(
      { _id: id },
      { $pull: { services: { _id: serviceId } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Service not found or already deleted" });
    }

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const updateRuleById = async (req, res) => {
  try {
    const { id, ruleId } = req.params;
    const { name, detail } = req.body;
    const result = await User.updateOne( 
      { _id: id, "rules._id": ruleId },
      { $set: { "rules.$.name": name, "rules.$.detail": detail } }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Rule not found or not updated" });
    }
    res.status(200).json({ message: "Rule updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}   

const updateLibInfoById = async (req, res) => {
  try {
    const { id, libInfoId } = req.params;
    let { type, name, detail } = req.body;

    if (req.file) {
      try {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "LibraryInfo",
        });
        detail = uploadResult.secure_url;
      } catch (err) {
        console.error("Image upload failed:", err);
        return res.status(500).json({ message: "Failed to upload image" });
      }
    }

    const result = await User.updateOne(
      { _id: id, "abouts._id": libInfoId },
      {
        $set: {
          "abouts.$.type": type,
          "abouts.$.name": name,
          "abouts.$.detail": detail,
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Library information not found or not updated" });
    }

    res.status(200).json({ message: "Library information updated successfully" });
  } catch (error) {
    console.error("Update library info error:", error);
    res.status(500).json({ message: error.message });
  }
}  

const updateServiceById = async (req, res) => {
  try {
    const { id, serviceId } = req.params;
    const { name, detail } = req.body;
    const result = await User.updateOne( 
      { _id: id, "services._id": serviceId },
      { $set: { "services.$.name": name, "services.$.detail": detail } }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Service not found or not updated" });
    }
    res.status(200).json({ message: "Service updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getUserByLibraryCard = async (req, res) => {
  try {
    const { cardNumber } = req.params;
    const user = await User.findOne({ "libraryCard.cardNumber": cardNumber });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const blockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.status = "blocked";
    await user.save();
    res.status(200).json({ message: "User blocked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const users = await User.find({ status });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createLibraryCardForUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { cardNumber, registrationDate, expirationDate } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.libraryCard && user.libraryCard.cardNumber) {
      return res.status(400).json({ message: "User already has a library card" });
    }

    user.libraryCard = {
      cardNumber,
      registrationDate,
      expirationDate
    };

    await user.save();

    res.status(200).json({ message: "Library card created successfully", user });
  } catch (error) {
    console.error("Error creating library card:", error);
    res.status(500).json({ message: error.message });
  }
};

const loginForUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.status !== "active") {
      return res.status(401).json({ message: "User is not active" });
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = createToken(user);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * maxAge });

    res.status(200).json({message: "Login successful"});
  } catch (error) {
    next(error);
  }
};

const Logout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
};

const getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user._id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const updateUserInterestedBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookId } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.interestedBook.push(bookId);
    await user.save();
    res.status(200).json({ message: "User interested book updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUserInterestedBook = async (req, res) => {
  try {
    const { id, bookId } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const initialLength = user.interestedBook.length;
    user.interestedBook = user.interestedBook.filter(bid => bid.toString() !== bookId);

    if (user.interestedBook.length === initialLength) {
      return res.status(404).json({ message: "Book not found in user's interested list" });
    }

    await user.save();
    res.status(200).json({ message: "User interested book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByLibraryCard,
  loginForUser,
  blockUser,
  getUserByStatus,
  createLibraryCardForUser,
  addRule,
  deleteRuleById,
  updateRuleById,
  addLibInfo,
  deleteLibInfoById,
  updateLibInfoById,
  addService,
  deleteServiceById,
  updateServiceById,
  Logout,
  getCurrentUser,
  updateUserInterestedBook,
  deleteUserInterestedBook
};
