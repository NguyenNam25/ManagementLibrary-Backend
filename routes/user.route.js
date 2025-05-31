const express = require("express");
const router = express.Router();
const { checkTokenAuthen } = require('../middleware/auth');
const upload = require('../middleware/multer.js');

const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByLibraryCard,
  loginForUser,
  getUserByStatus,
  createLibraryCardForUser,
  addRule,
  deleteRuleById,
  updateRuleById,
  addLibInfo,
  deleteLibInfoById,
  updateLibInfoById,
  Logout,
  getCurrentUser,
  addService,
  deleteServiceById,
  updateServiceById,
  updateUserInterestedBook,
  deleteUserInterestedBook
} = require("../controllers/user.controller.js");

// Public routes (no authentication required)
router.post("/register", upload.single('image'), createUser);
router.post("/login", loginForUser);
router.get("/logout", Logout);

// Protected routes (authentication required)
// router.use(checkTokenAuthen);

// User profile routes
router.get("/current-user", getCurrentUser);
router.get("/profile", getUser);
router.put("/profile", upload.single('image'), updateUser);

// Library card routes
router.get("/libraryCard/:cardNumber", getUserByLibraryCard);
router.post("/libraryCard/:id", createLibraryCardForUser);

// Admin routes
router.get("/", getAllUsers);
router.get("/:id", getUser);
router.put("/:id", upload.single('image'), updateUser);
router.delete("/:id", deleteUser);
router.get("/status/:status", getUserByStatus);

// Library rules routes
router.post("/:id/rules", addRule);
router.delete("/:id/rules/:ruleId", deleteRuleById);
router.put("/:id/rules/:ruleId", updateRuleById);

// Library info routes
router.post("/:id/abouts", upload.single('image'), addLibInfo);
router.delete("/:id/abouts/:libInfoId", deleteLibInfoById);
router.put("/:id/abouts/:libInfoId", upload.single('image'), updateLibInfoById);

// Library services routes
router.post("/:id/services", addService);
router.delete("/:id/services/:serviceId", deleteServiceById);
router.put("/:id/services/:serviceId", updateServiceById);

// User interested book routes
router.post("/:id/interested-books", updateUserInterestedBook);
router.delete("/:id/interested-books/:bookId", deleteUserInterestedBook);
module.exports = router;
