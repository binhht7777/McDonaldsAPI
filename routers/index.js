const { Router } = require("express");
const router = Router();

const {
  getUsers,
  createUser,
  getUserByImei,
  getUserByPhone,
  getStore,
  getBackground,
  getCategory,
  getFoodByCategory,
  getFavorite,
  createOrder,
  createOrderDetail,
  createPaymentIntent,
  cancelPaymentIntent,
  createFavorite,
  deleteFavorite,
  encryptPass,
  getAllFavorite,
  getOrder,
  updateOrder,
} = require("../controllers/index.contronller");

router.get("/users", getUsers);
router.get("/userbyimei", getUserByImei);
router.get("/userbyphone", getUserByPhone);
router.post("/users", createUser);

// Store
router.get("/store", getStore);

router.get("/background", getBackground);

router.get("/category", getCategory);

router.get("/foodbycategory", getFoodByCategory);

router.get("/favorite", getFavorite);

router.get("/allfavorite", getAllFavorite);

router.post("/favorite", createFavorite);

router.delete("/favorite", deleteFavorite);

router.get("/order", getOrder);

router.put("/order", updateOrder);

router.post("/createorder", createOrder);

router.post("/encryptpass", encryptPass);

router.post("/createorderdetail", createOrderDetail);

router.post("/create-payment-intent", createPaymentIntent);

router.delete("/payment-intent/:id/cancel", cancelPaymentIntent);

module.exports = router;
