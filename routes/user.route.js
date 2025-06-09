const express = require("express");
const router = express.Router();
const { checkTokenAuthen } = require('../middleware/auth');
const upload = require('../middleware/multer.js');
const { checkRoles } = require('../middleware/checkrole');

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
  deleteUserInterestedBook,
  updateLibraryCardExpiry
} = require("../controllers/user.controller.js");

// Public routes (no authentication required)
router.post("/register", upload.single('image'), createUser);
router.post("/login", loginForUser);
router.get("/logout", Logout);

// Protected routes (authentication required)
// router.use(checkTokenAuthen);

// User profile routes
router.get("/current-user", getCurrentUser);
router.get("/profile", checkTokenAuthen, getUser);
router.put("/profile", checkTokenAuthen, upload.single('image'), updateUser);

// Library card routes
router.get("/libraryCard/:cardNumber", getUserByLibraryCard);
router.post("/libraryCard/:id", checkTokenAuthen, createLibraryCardForUser);
router.put("/libraryCard/:id", checkTokenAuthen, updateLibraryCardExpiry);

// Admin routes
router.get("/", getAllUsers);
router.get("/:id", getUser);
router.put("/:id", checkTokenAuthen, upload.single('image'), updateUser);
router.delete("/:id", checkTokenAuthen, deleteUser);
router.get("/status/:status", getUserByStatus);

// Library rules routes
router.post("/:id/rules", checkTokenAuthen, checkRoles(['680a42aa89f73ba902c99b5d']), addRule);
router.delete("/:id/rules/:ruleId", checkTokenAuthen, checkRoles(['680a42aa89f73ba902c99b5d']), deleteRuleById);
router.put("/:id/rules/:ruleId", checkTokenAuthen, checkRoles(['680a42aa89f73ba902c99b5d']), updateRuleById);

// Library info routes
router.post("/:id/abouts", checkTokenAuthen, checkRoles(['680a42aa89f73ba902c99b5d']), upload.single('image'), addLibInfo);
router.delete("/:id/abouts/:libInfoId", checkTokenAuthen, checkRoles(['680a42aa89f73ba902c99b5d']), deleteLibInfoById);
router.put("/:id/abouts/:libInfoId", checkTokenAuthen, checkRoles(['680a42aa89f73ba902c99b5d']), upload.single('image'), updateLibInfoById);

// Library services routes
router.post("/:id/services", checkTokenAuthen, checkRoles(['680a42aa89f73ba902c99b5d']), addService);
router.delete("/:id/services/:serviceId", checkTokenAuthen, checkRoles(['680a42aa89f73ba902c99b5d']), deleteServiceById);
router.put("/:id/services/:serviceId", checkTokenAuthen, checkRoles(['680a42aa89f73ba902c99b5d']), updateServiceById);

// User interested book routes
router.post("/:id/interested-books", checkTokenAuthen, updateUserInterestedBook);
router.delete("/:id/interested-books/:bookId", checkTokenAuthen, deleteUserInterestedBook);
module.exports = router;
