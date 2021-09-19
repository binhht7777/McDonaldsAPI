const Pool = require("pg").Pool;
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(
  "sk_test_51JZGEzFvYniupeojDLYgjRj06eDMfEiKbwAdkLKVnhUXarlaoEIYVGiYExsaWgI0DoD8ZeAryRqrzZxGSmA27gB900LB8mGxF6"
);
var API_KEY = "1234";

const pool = new Pool({
  host: "postgresql-49202-0.cloudclusters.net",
  user: "admin",
  password: "123@Admin",
  database: "mcdonald",
  port: 11240,
  trustServerCertificate: true,
  trustedConnection: true,
});

var crypto = require("crypto"), algorithm = "sha-256-ctr", keyHascode = "d6F3Efeq";

function encrypt(text) {
  var cipher = crypto.createCipher(algorithm, password);
  var crypted = cipher.update(text, "utf8", "hex");
  crypted += cipher.final("hex");
  return crypted;
}

function decrypt(text) {
  var decipher = crypto.createDecipher(algorithm, password);
  var dec = decipher.update(text, "hex", "utf8");
  dec += decipher.final("utf8");
  return dec;
}

const encryptPass = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  if (req.body.key != API_KEY) {
    res.end(JSON.stringify({ success: false, message: "Wrong API Key" }));
  } else {
    try {
      console.log("encrypt password");
      const passWord = req.body.passWord;
      const passWordHash = crypto
        .createHmac("sha256", keyHascode)
        .update(passWord)
        .digest("hex");

      if (passWordHash != "") {
        res.end(JSON.stringify({ success: true, result: passWordHash }));
      } else {
        res.end(JSON.stringify({ success: false, message: "Empty" }));
      }
    } catch (err) {
      res.status(500);
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
  }
};

const getUsers = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  if (req.query.key != API_KEY) {
    res.end(JSON.stringify({ success: false, message: "Wrong API Key" }));
  } else {
    try {
      const response = await pool.query(
        "Select u.Imei, u.UserPhone, u.Name, u.Address, u.IsCustomerYN From Users u"
      );
      if (response.rows.length > 0) {
        res.end(JSON.stringify({ success: true, result: response.rows }));
      } else {
        res.end(JSON.stringify({ success: false, message: "Empty" }));
      }
    } catch (err) {
      res.status(500);
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
  }
};

const getUserByImei = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  if (req.query.key != API_KEY) {
    res.end(JSON.stringify({ success: false, message: "Wrong API Key" }));
  } else {
    try {
      var imei = req.query.imei;
      const response = await pool.query(
        "Select u.Imei, u.UserPhone, u.Name, u.Address, u.IsCustomerYN From Users u Where u.Imei = $1",
        [imei]
      );
      if (response.rows.length > 0) {
        console.log(response.rows);
        res.end(JSON.stringify({ success: true, result: response.rows }));
      } else {
        res.end(JSON.stringify({ success: false, message: "Empty" }));
      }
    } catch (err) {
      res.status(500);
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
  }
};

const getUserByPhone = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  if (req.query.key != API_KEY) {
    res.end(JSON.stringify({ success: false, message: "Wrong API Key" }));
  } else {
    try {
      var userPhone = req.query.userPhone;
      var passWord = req.query.passWord;
      var passWordHash = crypto
        .createHmac("sha256", keyHascode)
        .update(passWord)
        .digest("hex");
      console.log(passWordHash);
      const response = await pool.query(
        "Select u.Imei, u.UserPhone, u.Name, u.Address, u.IsCustomerYN From Users u Where u.UserPhone = $1 And u.Password = $2",
        [userPhone, passWordHash]
      );
      if (response.rows.length > 0) {
        res.end(JSON.stringify({ success: true, result: response.rows }));
      } else {
        res.end(JSON.stringify({ success: false, message: "Empty" }));
      }
    } catch (err) {
      res.status(500);
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
  }
};

const createUser = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  if (req.body.key != API_KEY) {
    res.end(JSON.stringify({ success: false, message: "Wrong API Key" }));
  } else {
    try {
      const date = new Date();
      const currentDate =
        date.getFullYear() + "-0" + date.getMonth() + "-0" + date.getDate();
      const { imei, userPhone, passWord, name, address, isCustomerYN } =
        req.body;
      console.log("Begin");
       const passWordHash = crypto
        .createHmac("sha256", keyHascode)
        .update(passWord)
        .digest("hex");
      console.log(passWordHash);

      const response = await pool.query(
        "Insert Into Users(Imei, UserPhone, Password, Name, Address, IsCustomerYN, CreateDate) Values($1, $2, $3, $4, $5, $6, $7)",
        [
          imei,
          userPhone,
          passWordHash,
          name,
          address,
          isCustomerYN,
          currentDate,
        ]
      );
      if (response.rows != null) {
        res.send(JSON.stringify({ success: true, message: "Success" }));
      }
    } catch (err) {
      res.status(500);
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
  }
};

// GET STORE
const getStore = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  if (req.query.key != API_KEY) {
    res.end(JSON.stringify({ success: false, message: "Wrong API Key" }));
  } else {
    try {
      const response = await pool.query(
        "Select s.StoreId, s.StoreName, s.StoreAddress From Store s"
      );
      if (response.rows.length > 0) {
        res.end(JSON.stringify({ success: true, result: response.rows }));
      } else {
        res.end(JSON.stringify({ success: false, message: "Empty" }));
      }
    } catch (err) {
      res.status(500);
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
  }
};

// GET BACKGROUND
const getBackground = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  if (req.query.key != API_KEY) {
    res.end(JSON.stringify({ success: false, message: "Wrong API Key" }));
  } else {
    try {
      const response = await pool.query(
        "Select bg.BackgroundId, bg.BackgroundImg From public.background bg"
      );
      if (response.rows.length > 0) {
        console.log(response.rows);
        res.end(JSON.stringify({ success: true, result: response.rows }));
      } else {
        res.end(JSON.stringify({ success: false, message: "Empty" }));
      }
    } catch (err) {
      res.status(500);
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
  }
};

// GET CATEGORY
const getCategory = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  if (req.query.key != API_KEY) {
    res.end(JSON.stringify({ success: false, message: "Wrong API Key" }));
  } else {
    try {
      const response = await pool.query(
        "Select c.CategoryId, c.CategoryName, c.Description, c.CategoryImg From Category c"
      );
      if (response.rows.length > 0) {
        res.end(JSON.stringify({ success: true, result: response.rows }));
      } else {
        res.end(JSON.stringify({ success: false, message: "Empty" }));
      }
    } catch (err) {
      res.status(500);
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
  }
};

// GET FOOR BY CATEGORY
const getFoodByCategory = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  if (req.query.key != API_KEY) {
    res.end(JSON.stringify({ success: false, message: "Wrong API Key" }));
  } else {
    try {
      var categoryId = req.query.categoryId;
      const response = await pool.query(
        "Select p.CategoryId, p.FoodId, p.FoodName, p.Price, p.FoodImg From Food p Where p.CategoryId = $1",
        [categoryId]
      );
      if (response.rows.length > 0) {
        res.end(JSON.stringify({ success: true, result: response.rows }));
      } else {
        res.end(JSON.stringify({ success: false, message: "Empty" }));
      }
    } catch (err) {
      res.status(500);
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
  }
};

// GET FAVORITE
const getFavorite = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  if (req.query.key != API_KEY) {
    res.end(JSON.stringify({ success: false, message: "Wrong API Key" }));
  } else {
    try {
      const response = await pool.query(
        "Select f.FoodId, f.FoodName, f.FoodImg, f.Count From Favorite f Where f.Count >=10 "
      );
      if (response.rows.length > 0) {
        res.end(JSON.stringify({ success: true, result: response.rows }));
      } else {
        res.end(JSON.stringify({ success: false, message: "Empty" }));
      }
    } catch (err) {
      res.status(500);
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
  }
};

const createFavorite = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  if (req.body.key != API_KEY) {
    res.end(JSON.stringify({ success: false, message: "Wrong API Key" }));
  } else {
    try {
      const { foodId, foodName, foodImg, count } = req.body;
      var countFav = 0;

      // kiem tra xem co ton tai favorite khong

      const response = await pool.query(
        "Select f.Count From Favorite f Where f.FoodId = $1",
        [foodId]
      );
      console.log(response.rows);
      if (response.rows != "") {
        console.log("2------------");
        if (parseInt(response.rows[0]["count"]) > 0) {
          countFav = parseInt(response.rows[0]["count"]) + count;
          console.log(countFav);
          const response1 = await pool.query(
            "Update Favorite Set Count = $1 Where foodId = $2",
            [countFav, foodId]
          );
          if (response1.rows != null) {
            res.send(JSON.stringify({ success: true, message: "Success" }));
          }
        }
      } else {
        console.log("Insert Favorite");
        const response2 = await pool.query(
          "Insert Into Favorite(FoodId, FoodName, FoodImg, Count) Values($1, $2, $3, $4)",
          [foodId, foodName, foodImg, count]
        );
        if (response2.rows != null) {
          res.send(JSON.stringify({ success: true, message: "Success" }));
        }
      }
    } catch (err) {
      res.status(500);
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
  }
};

const deleteFavorite = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  if (req.body.key != API_KEY) {
    res.end(JSON.stringify({ success: false, message: "Wrong API Key" }));
  } else {
    try {
      const { foodId, count } = req.body;
      const response = await pool.query(
        "Select f.Count From Favorite f Where f.FoodId = $1",
        [foodId]
      );
      if (response.rows != null) {
        console.log(response.rows);
        countFav = parseInt(response.rows[0]["count"]) - count;
      }

      const response1 = await pool.query(
        "Update Favorite Set Count = $1 Where foodId = $2",
        [countFav, foodId]
      );
      if (response1.rows != null) {
        res.send(JSON.stringify({ success: true, message: "Success" }));
      }
    } catch (err) {
      res.status(500);
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
  }
};

const createOrder = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  if (req.body.key != API_KEY) {
    res.end(JSON.stringify({ success: false, message: "Wrong API Key" }));
  } else {
    try {
      let date = new Date();
      let currentDate =
        date.getFullYear() + "-0" + date.getMonth() + "-0" + date.getDate();

      const { orderId, imei, userPhone, storedId, cash, total, address } =
        req.body;
      const response = await pool.query(
        "Insert Into Orders(OrderId, Imei, UserPhone, StoreId, cash, Total, Address, OrderDate) Values($1, $2, $3, $4, $5, $6, $7, $8)",
        [orderId, imei, userPhone, storedId, cash, total, address, currentDate]
      );
      if (response.rows != null) {
        res.send(JSON.stringify({ success: true, message: "Success" }));
      }
    } catch (err) {
      res.status(500);
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
  }
};

const createOrderDetail = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  if (req.body.key != API_KEY) {
    console.log("Wrong API key");
    res.end(JSON.stringify({ success: false, message: "Wrong API Key" }));
  } else {
    try {
      let orderDetailId = "";
      let date = new Date();
      let currentDate =
        date.getFullYear() + "-0" + date.getMonth() + "-0" + date.getDate();
      var order_detail;
      var orderId;
      var categoryId;
      var foodId;
      var foodPrice;
      var foodQuantity;
      var total;
      var orderId;
      try {
        order_detail = JSON.parse(req.body.orderDetail);
        orderId = req.body.orderId;
        console.log(order_detail);
      } catch (err) {
        res.status(500);
        res.send(JSON.stringify({ success: false, message: "Sai bien" }));
      }

      let rows = 0;

      for (var i = 0; i < order_detail.length; i++) {
        orderDetailId = order_detail[i]["orderDetailId"];
        categoryId = order_detail[i]["categoryId"];
        foodId = order_detail[i]["foodId"];
        foodPrice = parseFloat(order_detail[i]["foodPrice"]);
        foodQuantity = parseInt(order_detail[i]["foodQuantity"]);
        total = foodPrice * foodQuantity;
        const response = await pool.query(
          "Insert Into OrdersDetail(OrderDetailId, OrderId, CategoryId, FoodId, Price, quanlity, total, OrderDate) Values($1, $2, $3, $4, $5, $6, $7, $8)",
          [
            orderDetailId,
            orderId,
            categoryId,
            foodId,
            foodPrice,
            foodQuantity,
            total,
            currentDate,
          ]
        );
        console.log(response);
        rows += 1;
      }
      if (rows > 0) {
        res.send(JSON.stringify({ success: true, message: "Success" }));
      }
    } catch (err) {
      res.status(500);
      res.end(JSON.stringify({ success: false, message: "xay ra loi" }));
    }
  }
};

const calculateOrderAmount = (items) => {
  res.header("Access-Control-Allow-Origin", "*");
  var id;
  var amount;
  var item = JSON.parse(JSON.stringify(items));
  for (var i = 0; i < item.length; i++) {
    id = item[i]["id"];
    amount = parseFloat(item[i]["amount"]);
  }
  return amount;
};

const createPaymentIntent = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { currency, items } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: currency,
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};

const cancelPaymentIntent = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { id } = req.params;
  const paymentIntent = await stripe.paymentIntents.cancel(id);
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};

// app.post("/create-payment-intent", async (req, res) => {
//   const { items } = req.body;
//   // Create a PaymentIntent with the order amount and currency
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: calculateOrderAmount(items),
//     currency: "usd",
//   });
//   res.send({
//     clientSecret: paymentIntent.client_secret,
//   });
// });

module.exports = {
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
};
