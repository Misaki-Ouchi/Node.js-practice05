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
app.get("/", (req, res) => {
  // デフォルト
  const goods = "SELECT * from goods;";
  const reviews = "SELECT * from reviews;";

  // ソート
  // 商品価格高い順
  const goodsPriceDesc = "SELECT * from goods ORDER BY price DESC;";
  // 商品価格低い順
  const goodsPriceAsc = "SELECT * from goods ORDER BY price ASC;";
  // 商品名50音
  const goodsName = "SELECT * from goods ORDER BY name;";
  // アイテムごとのレビュー評価配列 [[4, 3, 4...], [5, 4, 5...], ...]
  const revPerItem = [];
  let len = goods.length;
  for (let i = 0; i < len; i++) {
    let rev = `SELECT * from reviews WHERE ${i} = itemId;`;
    revPerItem.push(rev)
    // エラーになる
  }


  con.query(
    goods + reviews + goodsPriceDesc + goodsPriceAsc + goodsName + revPerItem ,
    function (err, results, fields) {
      if (err) throw err;
      res.render("index", {
        goods: results[0],
        reviews: results[1],
        goodsPriceDesc: results[2],
        goodsPriceAsc: results[3],
        goodsName: results[4],
        revPerItem: results[5],
      });
    }
  );
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
