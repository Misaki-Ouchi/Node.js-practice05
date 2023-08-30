const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const port = 3000;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set("view engine", "ejs");

const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "shop_db",
  multipleStatements: true,
});

// cssファイルの取得
app.use(express.static("assets"));


// データ取得

// デフォルト
const goods = "SELECT * from goods;";
const reviews = "SELECT * from reviews;";

// 商品ソート
// 商品価格高い順
const goodsPriceDesc = "SELECT * from goods ORDER BY price DESC;";
// 商品価格低い順
const goodsPriceAsc = "SELECT * from goods ORDER BY price ASC;";
// 商品名50音
const goodsName = "SELECT * from goods ORDER BY name ASC;";

// データ一覧
const data = goods + reviews + goodsPriceDesc + goodsPriceAsc + goodsName;


// ホームページ
app.get("/", (req, res) => {
  con.query(
    data,
    function (err, results, fields) {
      if (err) throw err;
      res.render("index", {
        goods: results[0],
        reviews: results[1],
        goodsPriceDesc: results[2],
        goodsPriceAsc: results[3],
        goodsName: results[4],
      });
    }
  );
});

// 商品ページ
app.get("/itemList/:id", (req, res) => {
  con.query(
    goods, [req.params.id], function (err, result, fields) {
    if (err) throw err;
    res.render("itemList", {
      goods: result,
    });
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
