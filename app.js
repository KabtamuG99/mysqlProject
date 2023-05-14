
const express = require("express");
const mysql = require("mysql2");
const app = express();
let cors = require("cors");


 app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const firstsql = mysql.createConnection({
  user: "myDBuser",
  password: "myDBuser",
  host: "localhost",
  database: "myDB",
});

firstsql.connect((err) => {
  console.log("connected");
});

app.get("/install", (req, res) => {
  let product = `CREATE TABLE if not exists products(
    product_id int auto_increment,
    product_URL VARCHAR(255) not null,
    product_Name VARCHAR(255) not null,
    PRIMARY KEY(product_id))`;
  firstsql.query(product, (err, results, fields) => {
    if (err) console.log(`${err}`);
  });
 let productDiscription = `CREATE TABLE if not exists ProductDescription(
        description_id int auto_increment,
        product_id int(11) not null,
        product_brief_description VARCHAR(255) not null,
        product_description TEXT not null,
        product_img varchar(255) not null,
        product_link varchar(255) not null,
        PRIMARY KEY (description_id),
        FOREIGN KEY (product_id) REFERENCES products(product_id))`;
firstsql.query(productDiscription, (err, results, fields) => {
    if (err) console.log(`${err}`);
  });

let ProductPrice = `CREATE TABLE if not exists ProductPrice(
        price_id int auto_increment,
        product_id int ,
        starting_price VARCHAR(255) not null,
        price_range VARCHAR(255) not null,
        PRIMARY KEY (price_id),
        FOREIGN KEY (product_id) REFERENCES products(product_id))`;
firstsql.query(ProductPrice, (err, results, fields) => {
    if (err) console.log(`${err}`);
  });
  let User = `CREATE TABLE if not exists Users(
            user_id int auto_increment,
            User_name VARCHAR(255) not null, 
            User_password VARCHAR(255) not null,
            PRIMARY KEY (user_id))`;
           
firstsql.query(User, (err, results, fields) => {
    if (err) console.log(`${err}`);
});
  
  
 let Orders = `CREATE TABLE if not exists Orders(
                Order_id int auto_increment,
                product_id int not NULL,
                user_id int not NULL,
                PRIMARY KEY ( Order_id),
                FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id))`;
firstsql.query(Orders, (err, results, fields) => {
    if (err) console.log(`${err}`);
});
   
  res.end("Table Created");
 console.log("Table Created");
});   




app.post("/addiphones", (req, res) => {
  

  const { product_url, product_name, product_brief_description, product_description, product_img, product_link, starting_price, price_range, User_name, User_password } = req.body; // OBJECT DISTRACTURE 
  
  const productName = `INSERT INTO Products (product_name,product_url) VALUES(?,?)`
  const pDiscription = `INSERT INTO  ProductDescription (product_id,product_brief_description,product_description,product_img,product_link) VALUES(?,?,?,?,?)`
  const pPrice = `INSERT INTO ProductPrice (product_id,starting_price,price_range) VALUES(?,?,?)`
  const pUser = `INSERT INTO Users (User_name,User_password) VALUES(?,?)`
  const pOrder = `INSERT INTO Orders (product_id,User_id) VALUES(?,?)`

  firstsql.query(productName,
    [product_url, product_name],
    (err, results, fields) => {
      if (err) console.log(`Error: ${err}`);
      console.log(results);

  
      const pd = results.insertId;

      firstsql.query(pDiscription,
        [pd, product_brief_description, product_description, product_img, product_link],
        (err, results, fields) => {
          if (err) console.log(`Error: ${err}`);
          console.log(results);
        
        })
      firstsql.query(pPrice,
        [pd, starting_price, price_range],
        (err, results, fields) => {
          if (err) console.log(`Error: ${err}`);
          console.log(results);

        })
      
      firstsql.query(pUser,
        [User_name, User_password],
        (err, results, fields) => {
          if (err) console.log(`Error: ${err}`);
          console.log(results);

          const od = results.insertId;
      
          firstsql.query(pOrder,
            [pd, od],
            (err, results, fields) => {
              if (err) console.log(`Error: ${err}`);
              console.log(results);
            })
        })
     
      res.end("Data inserted successfully!");
      console.log("Data inserted successfully!");
    })
})
  app.listen(1216, function () {
    console.log("listening");
  });





