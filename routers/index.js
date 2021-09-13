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

router.post("/createorder", createOrder);

router.post("/createorderdetail", createOrderDetail);



module.exports = router;
