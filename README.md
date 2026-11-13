# **Lab 2 — MVC (Model–View–Controller) ด้วย Express.js**

💻 Coding Lab — ทำใน VS Code

Lab ต่อไปเราจะเรียน **MVC** โดยอ้างอิงจากสไลด์เรื่อง Model View Controller และตัวอย่าง Product List ที่คุณอัปโหลดไว้

เป้าหมายคือเปลี่ยนจากการเขียนทุกอย่างไว้ใน `index.js` ไฟล์เดียว มาเป็นการแยกหน้าที่ตามโครงสร้าง MVC

## **1. MVC คืออะไร?**

| ส่วน           | หน้าที่                            | ไฟล์ตัวอย่าง           |
| -------------- | ---------------------------------- | ---------------------- |
| **Model**      | จัดการข้อมูล เช่น อ่านข้อมูลสินค้า | `productModel.js`      |
| **View**       | แสดงหน้าเว็บให้ผู้ใช้              | `index.ejs`            |
| **Controller** | รับ Request ประมวลผล และเลือก View | `productController.js` |
| **Routes**     | กำหนด URL ว่าจะเรียก Controller ใด | `webRoutes.js`         |

เราจะเริ่มจาก Product List ที่ใช้ข้อมูลจำลองก่อน เพื่อให้เข้าใจการแยกไฟล์ MVC โดยไม่ต้องตั้งค่า MySQL หรือ Docker ทันที จากนั้นจึงค่อยต่อยอดเป็นเวอร์ชันฐานข้อมูลตามตัวอย่างที่คุณส่งมา

## **2. สร้างโปรเจกต์ใหม่**

ทำใน VS Code → Terminal (PowerShell)

ไม่ต้องลบ `cookie-lab` ที่ทำไว้ ให้สร้างโฟลเดอร์ใหม่ชื่อ `mvc-lab`

```

cd C:\Users\Vivobook\Desktop
mkdir mvc-lab
cd mvc-lab

npm.cmd init -y
npm.cmd install express ejs

```

**คำอธิบายคำสั่ง**

- `mkdir mvc-lab` สร้างโฟลเดอร์ Lab ใหม่
- `cd mvc-lab` เข้าโฟลเดอร์
- `npm.cmd init -y` สร้าง `package.json`
- `npm.cmd install express ejs` ติดตั้ง Express และ EJS Template Engine

## **3. สร้างโครงสร้างไฟล์**

ใน VS Code ให้สร้าง Folder และ File ตามนี้

```
mvc-lab/
│
├── app.js
├── models/
│   └── productModel.js
├── controllers/
│   └── productController.js
├── routes/
│   └── webRoutes.js
├── views/
│   └── index.ejs
│
├── package.json
├── package-lock.json
└── node_modules/
```

## **4. เขียน Model**

💻 วางโค้ดใน `models/productModel.js`

```

const products = [
    { id: 1, name: "Keyboard", price: 1500 },
    { id: 2, name: "Mouse", price: 800 },
    { id: 3, name: "Monitor", price: 4500 }
];

function getAllProducts() {
    return products;
}

module.exports = {
    getAllProducts
};

```

**อธิบาย:** Model ทำหน้าที่จัดการข้อมูลสินค้า ในตัวอย่างนี้เราใช้ Array จำลองฐานข้อมูลก่อน

`module.exports` ใช้ส่งออกฟังก์ชัน เพื่อให้ไฟล์อื่นเรียกใช้งานได้

## **5. เขียน Controller**

💻 วางโค้ดใน `controllers/productController.js`

```

const productModel = require("../models/productModel");

function showProducts(req, res) {
    const products = productModel.getAllProducts();

    res.render("index", {
        products: products
    });
}

module.exports = {
    showProducts
};

```

**อธิบาย:** Controller เรียก Model เพื่อดึงข้อมูลสินค้า แล้วส่งข้อมูลไปให้ View ผ่าน `res.render()`

`res.render("index", { products })` หมายถึงให้ Express ใช้ `views/index.ejs` สร้าง HTML โดยส่งตัวแปร `products` ไปให้ Template

## **6. เขียน Routes**

💻 วางโค้ดใน `routes/webRoutes.js`

```

const express = require("express");
const router = express.Router();

const productController =
    require("../controllers/productController");

router.get("/products", productController.showProducts);

module.exports = router;

```

**อธิบาย:** เมื่อมี Request แบบ `GET /products` ระบบจะเรียกฟังก์ชัน `showProducts` ใน Controller

นี่คือการแยก Routing ออกจาก Business Logic ตามแนวทาง MVC

## **7. เขียน View**

💻 วางโค้ดใน `views/index.ejs`

```

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Product List - MVC Lab</title>
</head>
<body>
    <h1>Product List</h1>

    <% products.forEach(product => { %>
        <div>
            <h3><%= product.name %></h3>
            <p>Price: <%= product.price %> Baht</p>
        </div>
        <hr>
    <% }) %>

</body>
</html>

```

**อธิบาย EJS ที่ต้องจำไปสอบ**

- `<% ... %>` ใช้เขียน JavaScript โดยไม่แสดงค่าบนหน้าเว็บ
- `<%= ... %>` ใช้แสดงค่าตัวแปรแบบ HTML-escaped
- `products.forEach()` ใช้วนลูปเพื่อแสดงสินค้าทุกชิ้น

## **8. เขียน app.js**

💻 วางโค้ดใน `app.js`

```

const express = require("express");
const path = require("path");

const webRoutes = require("./routes/webRoutes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", webRoutes);

app.listen(3001, () => {
    console.log("MVC Server running on port 3001");
});

```

**อธิบาย:** `app.set("view engine", "ejs")` กำหนดให้ Express ใช้ EJS เป็น Template Engine

`app.use("/", webRoutes)` เชื่อม Routes เข้ากับ Application

เราใช้ Port `3001` เพื่อไม่ให้ชนกับ Cookie Lab ที่ใช้ Port `3000`

## **9. รันและทดสอบ**

💻 ทำใน Terminal

ตรวจสอบว่าอยู่ในโฟลเดอร์ `mvc-lab` แล้วพิมพ์

```

node app.js

```

ควรเห็น

```
MVC Server running on port 3001
```

จากนั้นเปิด Browser ที่

[http://localhost:3001/products](http://localhost:3001/products?utm_source=chatgpt.com)

หน้าเว็บควรแสดงข้อมูลดังนี้

## **Product List**

Keyboard

Price: 1500 Baht

Mouse

Price: 800 Baht

Monitor

Price: 4500 Baht

ตัวอย่างผลลัพธ์ที่ควรปรากฏใน Browser

## **10. ตรวจสอบผล Lab 2**

เมื่อรัน `node app.js` แล้วเปิด `/products` ได้ผลอย่างไร?

สำเร็จ — แสดง Keyboard, Mouse และ Monitor

ขึ้น Error: Cannot find module

ขึ้น Error: Failed to lookup view

เกิด Error อื่น หรือยังไม่สำเร็จ

ส่งผลการทดสอบ&#x20;

เมื่อผ่านขั้นตอนนี้ เราจะต่อยอดเป็น **MVC + MySQL + Product CRUD** โดยใช้ไฟล์ตัวอย่างที่คุณอัปโหลดไว้ เพื่อฝึกการแยก Model, Controller, Routes และ View ให้ครบตามแนวข้อสอบครับ

# **MVC Lab 2 — Step 2: ค้นหาสินค้าและเชื่อมต่อ MySQL**

💻 Coding Lab — ทำใน VS Code

เราจะต่อยอดจาก `mvc-lab` ที่คุณทำสำเร็จแล้ว โดยใช้ตัวอย่าง Product API และการตั้งค่า MySQL ผ่าน Docker Compose จากไฟล์ Lab ที่คุณอัปโหลด

เป้าหมายรอบนี้คือเปลี่ยนข้อมูลสินค้าจาก Array จำลองให้เป็นข้อมูลจริงใน MySQL พร้อมเพิ่มระบบค้นหาสินค้า

| สิ่งที่ทำ  | ก่อนหน้านี้         | หลังทำ Step 2       |
| ---------- | ------------------- | ------------------- |
| Model      | อ่านข้อมูลจาก Array | อ่านข้อมูลจาก MySQL |
| Controller | แสดงสินค้าทั้งหมด   | แสดงและค้นหาสินค้า  |
| View       | แสดง Product List   | มีช่องค้นหาสินค้า   |
| Database   | ไม่มี               | MySQL ผ่าน Docker   |

## **Step 2.1 — ติดตั้ง Library เพิ่ม**

เปิด Terminal ของ VS Code ในโฟลเดอร์ `mvc-lab`

```

cd C:\Users\Vivobook\Desktop\mvc-lab
npm.cmd install mysql2 dotenv

```

- `mysql2` ใช้เชื่อมต่อและสั่ง SQL ไปยัง MySQL
- `dotenv` ใช้อ่านค่าการตั้งค่าจากไฟล์ `.env`

เราจะใช้ Docker เพื่อรัน MySQL ตามแนวทางในไฟล์ตัวอย่างของคุณ

## **Step 2.2 — สร้างไฟล์ .env**

💻 สร้างไฟล์ `.env` ในโฟลเดอร์ `mvc-lab`

```

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=p@ssword
DB_NAME=myDatabase
DB_CONTAINER=myDatabase

```

ค่าชุดนี้อ้างอิงจาก `.env` ที่คุณอัปโหลด และใช้สำหรับเครื่องฝึก Lab ในเครื่องตัวเอง ไม่ควรนำรหัสผ่านตัวอย่างนี้ไปใช้กับระบบจริง

## **Step 2.3 — สร้าง Docker Compose**

💻 สร้างไฟล์ `docker-compose.yml`

```

services:
  mysql:
    image: mysql:8.4
    container_name: ${DB_CONTAINER}
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
    ports:
      - "${DB_PORT}:3306"
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:

```

ไฟล์ที่อัปโหลดเดิมใช้ `mysql:latest` ส่วนตัวอย่างนี้เลือก `mysql:8.4` เพื่อให้เวอร์ชันคงที่มากขึ้น

เปิด Docker Desktop ให้ทำงาน แล้วพิมพ์ใน Terminal

```

docker compose up -d
docker compose ps

```

ถ้าสำเร็จควรเห็น Container `myDatabase` อยู่ในสถานะ Running หรือ Up

**หมายเหตุ:** ถ้าเครื่องคุณมี MySQL ใช้งาน Port `3306` อยู่แล้ว อาจต้องเปลี่ยน `DB_PORT` ใน `.env` เป็น `3307` ก่อนรัน Container และใช้ Port เดียวกันในการเชื่อมต่อจาก Node.js

## **Step 2.4 — สร้างตาราง products ใน MySQL**

💻 ทำใน Terminal

เมื่อ Container ทำงานแล้ว ให้เข้า MySQL ด้วยคำสั่ง

```

docker exec -it myDatabase mysql -u root -p

```

เมื่อขึ้น `Enter password:` ให้พิมพ์รหัสผ่านจาก `.env`

```
p@ssword
```

จากนั้นพิมพ์ SQL ต่อไปนี้ใน MySQL

```

USE myDatabase;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    discount DECIMAL(5,2) DEFAULT 0,
    review_count INT DEFAULT 0,
    image_url VARCHAR(500),
    is_deleted TINYINT DEFAULT 0
);

INSERT INTO products
(name, price, discount, review_count, image_url)
VALUES
('Keyboard', 1500, 0, 12, ''),
('Mouse', 800, 10, 20, ''),
('Monitor', 4500, 5, 8, '');

SELECT * FROM products;

```

ตารางนี้เป็น Schema สำหรับฝึกที่ผมจัดให้สอดคล้องกับชื่อฟิลด์ใน Product API ที่คุณอัปโหลด ไม่ใช่การยืนยันว่าไฟล์ต้นฉบับมีคำสั่งสร้างตารางแบบเดียวกันทุกบรรทัด

หาก `SELECT * FROM products;` แสดงสินค้า 3 รายการ แสดงว่าสร้างข้อมูลสำเร็จ

พิมพ์ `exit` เพื่อออกจาก MySQL

## **Step 2.5 — ปรับโครงสร้างโปรเจกต์**

ตอนนี้โฟลเดอร์ควรเป็นดังนี้

```
mvc-lab/
├── app.js
├── .env
├── docker-compose.yml
├── config/
│   └── db.js
├── models/
│   └── productModel.js
├── controllers/
│   └── productController.js
├── routes/
│   └── webRoutes.js
├── views/
│   └── index.ejs
├── package.json
└── node_modules/
```

สร้างโฟลเดอร์ `config` และไฟล์ `db.js` เพิ่มอีกหนึ่งไฟล์

## **Step 2.6 — เชื่อมต่อฐานข้อมูล**

💻 คัดลอกลง `config/db.js`

```

require("dotenv").config();

const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

module.exports = db;

```

**คำอธิบาย**

- `dotenv.config()` โหลดค่าจาก `.env`
- `mysql.createPool()` สร้าง Connection Pool สำหรับเชื่อมต่อฐานข้อมูล
- `module.exports = db` ส่งตัวเชื่อมต่อไปให้ Model ใช้งาน

## **Step 2.7 — แก้ไข Model**

💻 แทนที่โค้ดเดิมทั้งหมดใน `models/productModel.js`

```

const db = require("../config/db");

async function getAllProducts() {
    const [rows] = await db.query(
        "SELECT * FROM products WHERE is_deleted = 0"
    );

    return rows;
}

async function searchProducts(keyword) {
    const [rows] = await db.query(
        `SELECT * FROM products
         WHERE name LIKE ?
         AND is_deleted = 0`,
        [`%${keyword}%`]
    );

    return rows;
}

module.exports = {
    getAllProducts,
    searchProducts
};

```

**คำอธิบาย**

`getAllProducts()` ดึงสินค้าทั้งหมดที่ยังไม่ถูกลบ ส่วน `searchProducts(keyword)` ใช้ SQL `LIKE` เพื่อค้นหาชื่อสินค้าที่มีคำค้นอยู่ภายใน

เครื่องหมาย `?` เป็น Parameter Placeholder ช่วยป้องกัน SQL Injection จากการนำข้อมูลผู้ใช้ไปต่อเป็น SQL โดยตรง

## **Step 2.8 — แก้ไข Controller**

💻 แทนที่โค้ดเดิมทั้งหมดใน `controllers/productController.js`

```

const productModel = require("../models/productModel");

async function showProducts(req, res) {
    try {
        const keyword = (req.query.keyword || "").trim();

        let products;

        if (keyword) {
            products = await productModel.searchProducts(keyword);
        } else {
            products = await productModel.getAllProducts();
        }

        res.render("index", {
            products,
            keyword
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Database error");
    }
}

module.exports = {
    showProducts
};

```

**คำอธิบาย**

- `req.query.keyword` อ่านคำค้นจาก URL เช่น `/products?keyword=Mouse`
- `await` รอผลลัพธ์จากฐานข้อมูล
- `res.render()` ส่งสินค้าและคำค้นไปแสดงใน EJS
- `try...catch` จัดการข้อผิดพลาดจากฐานข้อมูล

## **Step 2.9 — แก้ไข View**

💻 แทนที่โค้ดเดิมทั้งหมดใน `views/index.ejs`

```

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Product Search</title>
</head>
<body>
    <h1>Product List</h1>

    <form action="/products" method="GET">
        <input
            type="text"
            name="keyword"
            placeholder="Search products"
            value="<%= keyword %>"
        >
        <button type="submit">Search</button>
    </form>

    <hr>

    <% if (products.length === 0) { %>
        <p>No products found.</p>
    <% } %>

    <% products.forEach(product => { %>
        <div>
            <h3><%= product.name %></h3>
            <p>
                Price: <%= product.price %> Baht
            </p>
        </div>
        <hr>
    <% }) %>

</body>
</html>

```

**คำอธิบาย**

เมื่อกด Search Browser จะส่ง GET Request ไปยัง `/products` พร้อม Query Parameter `keyword`

ตัวอย่าง:

```
http://localhost:3001/products?keyword=Mouse
```

EJS จะแสดงเฉพาะสินค้าที่ Model ค้นพบ

## **Step 2.10 — ตรวจสอบ Routes และ app.js**

สองไฟล์นี้ยังใช้ของเดิมได้ ไม่ต้องแก้ไข หากตรงกับตัวอย่างด้านล่าง

`routes/webRoutes.js`

```

const express = require("express");
const router = express.Router();

const productController =
    require("../controllers/productController");

router.get("/products", productController.showProducts);

module.exports = router;

```

`app.js`

```

const express = require("express");
const path = require("path");

const webRoutes = require("./routes/webRoutes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", webRoutes);

app.listen(3001, () => {
    console.log("MVC Server running on port 3001");
});

```

## **Step 2.11 — รันและทดสอบ**

💻 ทำใน Terminal

หาก Server เดิมยังทำงานอยู่ กด `Ctrl + C` ก่อน จากนั้นรัน

```

node app.js

```

เปิด Browser ที่ [http://localhost:3001/products](http://localhost:3001/products?utm_source=chatgpt.com)

ตัวอย่างผลลัพธ์ที่ควรเห็น

## **Product List**

Search products

Search

**Keyboard**

Price: 1500.00 Baht

**Mouse**

Price: 800.00 Baht

**Monitor**

Price: 4500.00 Baht

ตัวอย่างหน้าเว็บจากข้อมูลที่เพิ่มไว้ใน MySQL

ลองค้นหา `Mouse` แล้วตรวจสอบว่าหน้าเว็บแสดงเฉพาะสินค้า Mouse

## **Step 2.12 — ตรวจสอบผลการทดลอง**

ทำถึงขั้นตอนไหนแล้ว?

สำเร็จ — เชื่อม MySQL และค้นหาสินค้าได้

Docker หรือ MySQL มี Error

เชื่อมฐานข้อมูลไม่ได้ (ECONNREFUSED / Access denied)

Node.js หรือ EJS มี Error

ยังทำไม่ครบทุกขั้นตอน

ส่งผลการทดสอบ&#x20;

เมื่อผ่านขั้นตอนนี้ เราจะไป **Step 3: Product CRUD** ได้แก่ Create, Read, Update, Delete และ Restore โดยแยก Model, Controller และ Routes ตาม MVC ให้ครบเหมือนแนวทาง Product API ในไฟล์ Lab ที่คุณส่งมาครับ

# **MVC Lab 2 — Step 3: Product CRUD + Restore**

💻 Coding Lab — ลงมือทำใน VS Code

รอบนี้เราจะต่อยอดจาก MVC Lab Step 2 ที่คุณทำสำเร็จแล้ว โดยเพิ่มระบบจัดการสินค้าครบตาม Product API ที่คุณอัปโหลดไว้ ได้แก่ **Create, Read, Update, Delete และ Restore**

เราจะยังใช้โปรเจกต์ `mvc-lab` เดิม ไม่ต้องสร้างโปรเจกต์ใหม่ ไม่ต้องติดตั้ง MySQL ใหม่ และไม่ต้องลบข้อมูลสินค้าที่มีอยู่

## **1. สิ่งที่เราจะทำ**

| ฟังก์ชัน                | HTTP Method | Endpoint                    |
| ----------------------- | ----------- | --------------------------- |
| แสดงสินค้าทั้งหมด       | GET         | `/products`                 |
| ดูสินค้าตาม ID          | GET         | `/api/products/:id`         |
| ค้นหาสินค้า             | GET         | `/products?keyword=Mouse`   |
| เพิ่มสินค้า             | POST        | `/api/products`             |
| แก้ไขสินค้า             | PUT         | `/api/products/:id`         |
| ลบสินค้าแบบ Soft Delete | DELETE      | `/api/products/:id`         |
| กู้คืนสินค้า            | PUT         | `/api/products/restore/:id` |

ในไฟล์ตัวอย่างเดิม Product API ใช้เส้นทาง `/products` เป็นหลัก ส่วน Lab ที่เรากำลังต่อยอดนี้จะใช้ `/api/products` สำหรับ JSON API เพื่อไม่ให้ชนกับ `/products` ที่ใช้แสดงหน้า EJS

## **2. เข้าใจ CRUD ก่อนเขียนโค้ด**

CRUD เป็นคำย่อของการจัดการข้อมูลพื้นฐาน

- **Create** — เพิ่มสินค้าใหม่ลงฐานข้อมูลด้วย `INSERT`
- **Read** — อ่านข้อมูลสินค้าด้วย `SELECT`
- **Update** — แก้ไขข้อมูลด้วย `UPDATE`
- **Delete** — ลบข้อมูลด้วย `DELETE` หรือทำ Soft Delete

ใน Lab ต้นฉบับมีการใช้ **Soft Delete** ซึ่งหมายถึงการทำเครื่องหมายว่าลบแล้ว แทนการลบแถวออกจากฐานข้อมูลจริง

ตัวอย่าง:

```
UPDATE products
SET is_deleted = 1
WHERE id = 1;
```

หากต้องการกู้คืน:

```
UPDATE products
SET is_deleted = 0
WHERE id = 1;
```

ดังนั้นสินค้าไม่ได้หายไปจาก MySQL เพียงแต่ระบบซ่อนสินค้าที่มี `is_deleted = 1`

## **3. โครงสร้างไฟล์หลังทำ Step 3**

```
mvc-lab/
├── app.js
├── .env
├── docker-compose.yml
├── config/
│   └── db.js
├── models/
│   └── productModel.js       ← แก้ไข
├── controllers/
│   ├── productController.js  ← แก้ไข
│   └── productApiController.js ← สร้างใหม่
├── routes/
│   ├── webRoutes.js
│   └── productApiRoutes.js   ← สร้างใหม่
├── views/
│   └── index.ejs
└── package.json
```

เราจะแยก Controller สำหรับหน้าเว็บและ JSON API ออกจากกัน เพื่อให้เห็นหน้าที่ของ MVC ชัดเจนขึ้น

## **4. แก้ไข Model ให้รองรับ CRUD**

💻 แทนที่โค้ดทั้งหมดใน `models/productModel.js`

โค้ดนี้เก็บฟังก์ชันอ่าน ค้นหา เพิ่ม แก้ไข ลบ และกู้คืนข้อมูลสินค้าไว้ใน Model

```

const db = require("../config/db");

async function getAllProducts() {
    const [rows] = await db.query(
        "SELECT * FROM products WHERE is_deleted = 0"
    );
    return rows;
}

async function searchProducts(keyword) {
    const [rows] = await db.query(
        `SELECT * FROM products
         WHERE name LIKE ? AND is_deleted = 0`,
        [`%${keyword}%`]
    );
    return rows;
}

async function getProductById(id) {
    const [rows] = await db.query(
        "SELECT * FROM products WHERE id = ? AND is_deleted = 0",
        [id]
    );
    return rows[0] || null;
}

async function createProduct(product) {
    const { name, price, discount, review_count, image_url } = product;

    const [result] = await db.query(
        `INSERT INTO products
         (name, price, discount, review_count, image_url)
         VALUES (?, ?, ?, ?, ?)`,
        [name, price, discount, review_count, image_url]
    );

    return result.insertId;
}

async function updateProduct(id, product) {
    const { name, price, discount, review_count, image_url } = product;

    const [result] = await db.query(
        `UPDATE products
         SET name = ?, price = ?, discount = ?,
             review_count = ?, image_url = ?
         WHERE id = ? AND is_deleted = 0`,
        [name, price, discount, review_count, image_url, id]
    );

    return result.affectedRows;
}

async function deleteProduct(id) {
    const [result] = await db.query(
        "UPDATE products SET is_deleted = 1 WHERE id = ? AND is_deleted = 0",
        [id]
    );

    return result.affectedRows;
}

async function restoreProduct(id) {
    const [result] = await db.query(
        "UPDATE products SET is_deleted = 0 WHERE id = ? AND is_deleted = 1",
        [id]
    );

    return result.affectedRows;
}

module.exports = {
    getAllProducts,
    searchProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    restoreProduct
};

```

### **อธิบาย Model**

| ฟังก์ชัน           | SQL ที่ใช้     | ผลลัพธ์                    |
| ------------------ | -------------- | -------------------------- |
| `getAllProducts()` | SELECT         | Array ของสินค้า            |
| `searchProducts()` | SELECT + LIKE  | สินค้าที่ตรงคำค้น          |
| `getProductById()` | SELECT + WHERE | สินค้าหนึ่งรายการ          |
| `createProduct()`  | INSERT         | ID ของสินค้าใหม่           |
| `updateProduct()`  | UPDATE         | จำนวนแถวที่ถูกแก้ไข        |
| `deleteProduct()`  | UPDATE         | จำนวนแถวที่ถูก Soft Delete |
| `restoreProduct()` | UPDATE         | จำนวนแถวที่ถูกกู้คืน       |

**จำไปสอบ:** Model เป็นส่วนที่ติดต่อฐานข้อมูล ส่วน Controller ไม่ควรต้องเขียน SQL เอง

## **5. สร้าง Product API Controller**

💻 สร้างไฟล์ `controllers/productApiController.js` แล้ววางโค้ดทั้งหมด

```

const productModel = require("../models/productModel");

function validId(id) {
    return /^[1-9]\d*$/.test(String(id)) &&
        Number.isSafeInteger(Number(id));
}

function parseProduct(body) {
    const name = body?.name;
    const price = body?.price;
    const discount = body?.discount ?? 0;
    const review_count = body?.review_count ?? 0;
    const image_url = body?.image_url ?? "";

    if (
        typeof name !== "string" ||
        !name.trim() ||
        name.length > 100 ||
        !Number.isFinite(price) ||
        price < 0 ||
        !Number.isFinite(discount) ||
        discount < 0 ||
        discount > 100 ||
        !Number.isInteger(review_count) ||
        review_count < 0 ||
        typeof image_url !== "string" ||
        image_url.length > 500
    ) {
        return null;
    }

    return {
        name: name.trim(),
        price,
        discount,
        review_count,
        image_url
    };
}

// READ ALL
async function getAll(req, res) {
    try {
        const products = await productModel.getAllProducts();
        return res.json(products);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Database error" });
    }
}

// READ BY ID
async function getById(req, res) {
    if (!validId(req.params.id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    try {
        const product = await productModel.getProductById(req.params.id);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        return res.json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Database error" });
    }
}

// SEARCH
async function search(req, res) {
    try {
        const keyword = req.params.keyword;
        const products = await productModel.searchProducts(keyword);
        return res.json(products);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Database error" });
    }
}

// CREATE
async function create(req, res) {
    const product = parseProduct(req.body);

    if (!product) {
        return res.status(400).json({ error: "Invalid product data" });
    }

    try {
        const id = await productModel.createProduct(product);

        return res.status(201).json({
            id,
            message: "Product created"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Database error" });
    }
}

// UPDATE
async function update(req, res) {
    if (!validId(req.params.id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    const product = parseProduct(req.body);

    if (!product) {
        return res.status(400).json({ error: "Invalid product data" });
    }

    try {
        const affectedRows = await productModel.updateProduct(
            req.params.id,
            product
        );

        if (affectedRows === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        return res.json({ message: "Product updated" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Database error" });
    }
}

// SOFT DELETE
async function remove(req, res) {
    if (!validId(req.params.id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    try {
        const affectedRows = await productModel.deleteProduct(req.params.id);

        if (affectedRows === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        return res.json({ message: "Product soft-deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Database error" });
    }
}

// RESTORE
async function restore(req, res) {
    if (!validId(req.params.id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    try {
        const affectedRows = await productModel.restoreProduct(req.params.id);

        if (affectedRows === 0) {
            return res.status(404).json({
                error: "Deleted product not found"
            });
        }

        return res.json({ message: "Product restored" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Database error" });
    }
}

module.exports = {
    getAll,
    getById,
    search,
    create,
    update,
    remove,
    restore
};

```

### **อธิบาย Controller**

Controller มีหน้าที่รับ Request จาก Routes ตรวจสอบข้อมูล เรียก Model และส่ง Response กลับ

ตัวอย่างคำสั่งที่ต้องจำ:

```
const product = req.body;
```

`req.body` ใช้รับข้อมูล JSON จาก Client โดยต้องเปิด `express.json()` ก่อน

```
const id = req.params.id;
```

`req.params.id` ใช้รับค่า ID จาก URL เช่น `/api/products/4`

```
res.status(201).json({ message: "Product created" });
```

`201 Created` เป็น HTTP Status ที่เหมาะกับการสร้างข้อมูลใหม่สำเร็จ

ส่วนการตรวจสอบข้อมูลใน `parseProduct()` เป็นส่วนที่ผมเพิ่มจากตัวอย่างต้นฉบับ เพื่อให้ Lab จัดการข้อมูลที่ผิดรูปแบบได้ดีขึ้น

## **6. สร้าง Routes สำหรับ Product API**

💻 สร้างไฟล์ `routes/productApiRoutes.js`

```

const express = require("express");
const router = express.Router();

const controller = require("../controllers/productApiController");

router.get("/", controller.getAll);
router.get("/search/:keyword", controller.search);
router.get("/:id", controller.getById);

router.post("/", controller.create);
router.put("/restore/:id", controller.restore);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;

```

**อธิบาย:** Routes ไม่ได้ติดต่อ MySQL เอง แต่ส่ง Request ไปยัง Controller

สังเกตว่า `/search/:keyword` อยู่ก่อน `/:id` เพื่อไม่ให้คำว่า `search` ถูกตีความเป็นค่า ID

## **7. แก้ไข app.js**

💻 แทนที่โค้ดทั้งหมดใน `app.js`

```

const express = require("express");
const path = require("path");

const webRoutes = require("./routes/webRoutes");
const productApiRoutes = require("./routes/productApiRoutes");

const app = express();

app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", webRoutes);
app.use("/api/products", productApiRoutes);

app.listen(3001, () => {
    console.log("MVC Server running on port 3001");
});

```

ไฟล์ `config/db.js`, `controllers/productController.js`, `routes/webRoutes.js` และ `views/index.ejs` จาก Step 2 **ยังใช้เหมือนเดิม ไม่ต้องแก้ไข**

## **8. Restart Server**

เปิด Terminal ในโฟลเดอร์ `mvc-lab`

หาก Server เดิมยังทำงานอยู่ ให้กด `Ctrl + C` แล้วพิมพ์

```

cd C:\Users\Vivobook\Desktop\mvc-lab
docker compose ps
node app.js

```

ควรเห็นข้อความ

```
MVC Server running on port 3001
```

## **9. ทดสอบ CRUD ด้วย PowerShell**

💻 เปิด Terminal ใหม่ใน VS Code

ปล่อย Terminal ที่รัน `node app.js` ไว้ แล้วเปิดอีก Terminal สำหรับส่ง HTTP Request

### **Test 1 — Read All**

```

Invoke-RestMethod -Uri "http://localhost:3001/api/products" -Method Get

```

ควรได้รายการ Keyboard, Mouse และ Monitor ที่สร้างไว้ใน Step 2

### **Test 2 — Create Product**

```

$body = @{
    name = "Webcam"
    price = 1200
    discount = 5
    review_count = 0
    image_url = ""
} | ConvertTo-Json

$newProduct = Invoke-RestMethod `
    -Uri "http://localhost:3001/api/products" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body

$newProduct
$id = $newProduct.id

```

ตัวอย่าง Response:

```
{
  "id": 4,
  "message": "Product created"
}
```

ID จริงอาจแตกต่างจากตัวอย่าง ขึ้นอยู่กับข้อมูลในฐานข้อมูลของคุณ ตัวแปร `$id` จะเก็บ ID ที่สร้างได้จริง

### **Test 3 — Read By ID**

```

Invoke-RestMethod `
    -Uri "http://localhost:3001/api/products/$id" `
    -Method Get

```

ควรได้ข้อมูล Webcam

### **Test 4 — Search Product**

```

Invoke-RestMethod `
    -Uri "http://localhost:3001/api/products/search/Webcam" `
    -Method Get

```

ควรพบสินค้า Webcam

### **Test 5 — Update Product**

```

$body = @{
    name = "Webcam HD"
    price = 1500
    discount = 10
    review_count = 5
    image_url = ""
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri "http://localhost:3001/api/products/$id" `
    -Method Put `
    -ContentType "application/json" `
    -Body $body

```

ผลลัพธ์ที่คาดหวัง:

```
{
  "message": "Product updated"
}
```

### **Test 6 — Soft Delete**

```

Invoke-RestMethod `
    -Uri "http://localhost:3001/api/products/$id" `
    -Method Delete

```

ควรได้ `Product soft-deleted`

ลองเรียก GET ด้วย ID เดิมอีกครั้ง จะได้ `404 Product not found` เพราะข้อมูลถูกซ่อนแล้ว

### **Test 7 — Restore Product**

```

Invoke-RestMethod `
    -Uri "http://localhost:3001/api/products/restore/$id" `
    -Method Put

```

ควรได้ `Product restored`

จากนั้นเรียก GET ด้วย ID เดิมอีกครั้ง สินค้าควรกลับมาแสดงตามปกติ

## **10. สรุป HTTP Status Code ที่ต้องจำ**

| Status                      | ความหมาย          | กรณีใน Lab                        |
| --------------------------- | ----------------- | --------------------------------- |
| `200 OK`                    | ทำงานสำเร็จ       | Read, Update, Delete, Restore     |
| `201 Created`               | สร้างข้อมูลสำเร็จ | Create                            |
| `400 Bad Request`           | ข้อมูลไม่ถูกต้อง  | ID หรือ Product Data ผิดรูปแบบ    |
| `404 Not Found`             | ไม่พบข้อมูล       | ID สินค้าไม่มีอยู่                |
| `500 Internal Server Error` | Server ผิดพลาด    | เกิดปัญหาระหว่างทำงานกับฐานข้อมูล |

## **11. แบบทดสอบก่อนจบ MVC Lab**

**แบบทดสอบ 5 ข้อ**

เลือกคำตอบแล้วตรวจคะแนน

1\. ถ้าต้องการแก้ไขข้อมูลสินค้า ควรใช้ HTTP Method ใด?

GET

POST

PUT

DELETE

ถูกต้อง

PUT ใช้แทนที่หรืออัปเดตข้อมูลทรัพยากรตามรูปแบบ API ใน Lab นี้

2\. ฟังก์ชันที่สั่ง SQL INSERT ควรอยู่ในส่วนใดของ MVC?

View

Model

Routes

HTML

ถูกต้อง

Model รับผิดชอบการเข้าถึงและจัดการข้อมูล

3\. Soft Delete ต่างจาก DELETE จริงอย่างไร?

ลบ Database ทั้งหมด

เปลี่ยน is_deleted เป็น 1

ลบไฟล์ JavaScript

ปิด Server

ถูกต้อง

Soft Delete เปลี่ยนสถานะข้อมูลโดยไม่ลบแถวออกจากตาราง

4\. req.params.id ใช้รับข้อมูลจากส่วนใด?

JSON Body

Cookie

URL Path

Environment

คำตอบที่ถูก: URL Path

เช่น /api/products/5 จะได้ req.params.id เป็น '5'

5\. หากสร้างสินค้าใหม่สำเร็จ ควรตอบ HTTP Status ใด?

201

401

403

500

ถูกต้อง

201 Created ใช้เมื่อสร้างทรัพยากรใหม่สำเร็จ

## **คะแนน 4 / 5**

ตรวจคำตอบ

## **12. ส่งผลการทดสอบ**

ผลการทดสอบ MVC Lab Step 3 เป็นอย่างไร?

สำเร็จ — CRUD และ Restore ทำงานครบ

มีปัญหากับ MySQL หรือ SQL

API ส่ง Error หรือ Status Code ไม่ตรง

ยังทำไม่ครบ

ส่งผลการทดสอบ&#x20;

เมื่อทำครบแล้ว คุณจะได้ฝึกการแยก Model, View, Controller และ Routes พร้อมระบบ CRUD ที่เชื่อม MySQL จริง ขั้นตอนถัดไปคือ **API Testing** เพื่อทดสอบว่า Endpoint แต่ละตัวตอบ Status Code และข้อมูลได้ถูกต้องตามที่คาดหวัง

# **สรุป MVC Lab และเริ่ม Lab 3: API Testing**

คุณผ่าน MVC Lab ทั้ง 3 ขั้นตอนแล้ว ต่อไปเราจะนำ API ที่คุณสร้างเองมาทดสอบ โดยไม่ต้องสร้าง Backend ใหม่

## **Part 1 — สรุป MVC สำหรับสอบ**

### **1. MVC คืออะไร?**

MVC (Model–View–Controller) คือรูปแบบการออกแบบซอฟต์แวร์ที่แบ่งหน้าที่ของระบบออกเป็น 3 ส่วน เพื่อให้โค้ดเป็นระเบียบ ดูแลรักษาและทดสอบได้ง่ายขึ้น

| ส่วน           | หน้าที่                                      | ตัวอย่างจาก Lab        |
| -------------- | -------------------------------------------- | ---------------------- |
| **Model**      | ติดต่อฐานข้อมูลและจัดการข้อมูล               | `productModel.js`      |
| **View**       | แสดงผลหน้าเว็บ                               | `index.ejs`            |
| **Controller** | รับ Request ประมวลผล และสั่ง Model หรือ View | `productController.js` |
| **Routes**     | จับคู่ URL กับ Controller                    | `webRoutes.js`         |

Routes เป็นส่วนประกอบเพิ่มเติมของ Express ไม่ใช่ตัว M, V หรือ C โดยตรง

### **2. ลำดับการทำงานของ MVC**

ภาพย่อของการไหลของ Request และการแสดงผลใน MVC Lab

### **3. คำสั่งสำคัญที่ต้องจำ**

| คำสั่ง              | ความหมาย                        |
| ------------------- | ------------------------------- |
| `require()`         | นำ Module เข้ามาใช้งาน          |
| `module.exports`    | ส่งออกฟังก์ชันหรือข้อมูลจากไฟล์ |
| `express.Router()`  | สร้างชุด Routes                 |
| `req.params.id`     | รับ ID จาก URL                  |
| `req.query.keyword` | รับ Query String                |
| `req.body`          | รับข้อมูลจาก Request Body       |
| `res.json()`        | ส่ง Response เป็น JSON          |
| `res.render()`      | สร้าง HTML จาก EJS              |
| `async/await`       | ทำงานกับผลลัพธ์แบบ Asynchronous |
| `db.query()`        | สั่ง SQL ไปยังฐานข้อมูล         |

### **4. ความแตกต่างระหว่าง res.render() กับ res.json()**

```
res.render("index", { products });
```

ใช้เมื่อเราต้องการแสดงหน้าเว็บ HTML ผ่าน EJS

```
res.json(products);
```

ใช้เมื่อเราต้องการส่งข้อมูล JSON ให้ Client หรือ API Consumer

**จุดที่ควรจำสำหรับสอบ:** MVC เป็นการแยกความรับผิดชอบ ไม่ใช่การแยกไฟล์ให้เยอะที่สุด และการใช้ `res.json()` ไม่ได้หมายความว่า API นั้นไม่สามารถออกแบบตาม MVC ได้

# **Part 2 — Lab 3: API Testing**

💻 Coding Lab — ทดสอบ API จริง

จากสไลด์ API Testing ที่คุณอัปโหลด เนื้อหาครอบคลุมแนวคิดการทดสอบ API และการเรียก API ผ่าน HTTP รวมถึงการใช้ `Accept` Header เพื่อระบุรูปแบบ Response ที่ต้องการ

เราจะนำแนวคิดนั้นมาฝึกกับ Product API ที่คุณสร้างใน MVC Lab โดยเพิ่มการตรวจสอบผลลัพธ์อัตโนมัติด้วย JavaScript

## **1. API Testing คืออะไร?**

API Testing คือการตรวจสอบว่า API ทำงานตรงตามที่กำหนดหรือไม่ โดยทดสอบ Request และ Response โดยตรง ไม่จำเป็นต้องกดผ่านหน้าเว็บ

ตัวอย่าง:

```
GET http://localhost:3001/api/products
```

สิ่งที่เราควรตรวจสอบมีทั้ง HTTP Status Code, Response Body, ชนิดข้อมูล และกรณีที่ส่งข้อมูลไม่ถูกต้อง

### **ตัวอย่าง Test Cases**

| Test Case               | ผลลัพธ์ที่คาดหวัง   |
| ----------------------- | ------------------- |
| GET สินค้าทั้งหมด       | 200 และ JSON Array  |
| GET สินค้าที่มีอยู่     | 200 และข้อมูลสินค้า |
| GET สินค้าที่ไม่มีอยู่  | 404                 |
| POST เพิ่มสินค้าถูกต้อง | 201 และ ID ใหม่     |
| POST ข้อมูลผิดรูปแบบ    | 400                 |
| PUT แก้ไขสินค้าสำเร็จ   | 200                 |
| DELETE สินค้าสำเร็จ     | 200                 |
| GET หลัง Soft Delete    | 404                 |
| PUT Restore             | 200                 |

API Testing ไม่ได้ตรวจเพียงว่า Server ตอบกลับ แต่ต้องตรวจด้วยว่า **ตอบกลับถูกต้องตามที่เราคาดหวังหรือไม่**

## **2. เริ่มจาก API Testing ด้วย Postman**

สไลด์ของคุณมีตัวอย่างการใช้ `curl` และ Postman ดังนั้นเราจะเริ่มจากการส่ง Request ด้วย Postman ก่อน ส่วนการเขียน Automated Test จะเป็นขั้นต่อไป

### **Step 1 — เปิด Backend ที่สร้างไว้**

💻 ทำใน VS Code Terminal

```

cd C:\Users\Vivobook\Desktop\mvc-lab
docker compose up -d
node app.js

```

ควรเห็น

```
MVC Server running on port 3001
```

ปล่อย Terminal นี้ไว้

### **Step 2 — เปิด Postman**

เปิด [Postman Web](https://web.postman.co/?utm_source=chatgpt.com) หรือใช้ Postman Desktop ถ้าติดตั้งอยู่แล้ว

สำหรับ API ที่รันบน `localhost` การใช้ Postman Desktop จะสะดวกที่สุด หากใช้ Postman Web อาจต้องใช้ Desktop Agent เพื่อให้ส่ง Request ไปยัง Server ในเครื่องได้

### **Step 3 — ทดสอบ GET**

สร้าง HTTP Request ใหม่ใน Postman

GET

[http://localhost:3001/api/products](http://localhost:3001/api/products?utm_source=chatgpt.com)

กด Send แล้วตรวจสอบ Response

```

[
  {
    "id": 1,
    "name": "Keyboard",
    "price": "1500.00",
    "discount": "0.00",
    "review_count": 12,
    "image_url": "",
    "is_deleted": 0
  }
]
  
```

ตัวอย่างเพียงหนึ่งรายการจาก JSON Array — ข้อมูลจริงอาจมีหลายสินค้า และค่า ID หรือราคาต่างออกไป

สิ่งที่ต้องตรวจสอบคือ Status `200 OK`, Response เป็น JSON Array และมีข้อมูลสินค้าอยู่ภายใน

### **Step 4 — ทดสอบ POST**

เปลี่ยน HTTP Method เป็น `POST` แล้วใส่ URL

```
http://localhost:3001/api/products
```

ไปที่แท็บ **Body → raw → JSON** แล้ววาง

```

{
  "name": "Headset",
  "price": 990,
  "discount": 10,
  "review_count": 0,
  "image_url": ""
}

```

กด Send

ผลลัพธ์ที่คาดหวัง:

```
{
  "id": 5,
  "message": "Product created"
}
```

ID อาจไม่ใช่ 5 เพราะ MySQL กำหนด ID ใหม่ตามข้อมูลในตาราง

**ตรวจสอบ:** Status ต้องเป็น `201 Created`

### **Step 5 — ทดสอบกรณีผิดพลาด**

ส่ง POST ไปยัง URL เดิม แต่เปลี่ยน Body เป็น

```

{
  "name": "",
  "price": -100
}

```

ผลลัพธ์ที่คาดหวัง:

```
{
  "error": "Invalid product data"
}
```

Status ควรเป็น `400 Bad Request` เพราะ Controller ที่เราเขียนใน MVC Lab มีการตรวจสอบชื่อสินค้าและราคา

## **3. แบบฝึกหัด API Testing**

ให้ลองทำทั้ง 5 กรณีนี้ใน Postman แล้วตรวจสอบว่า Status Code ตรงกับที่คาดหวังหรือไม่

**รายการทดสอบ**

0/5 สำเร็จ

GET /api/products

Expected: 200 OK

POST /api/products (ข้อมูลถูกต้อง)

Expected: 201 Created

POST /api/products (ข้อมูลผิด)

Expected: 400 Bad Request

GET /api/products/99999999

Expected: 404 Not Found

GET /api/products/search/Mouse

Expected: 200 OK

## **4. ความรู้ที่ต้องจำไปสอบ**

**HTTP Request ประกอบด้วย** Method, URL, Headers และอาจมี Body

**HTTP Response ประกอบด้วย** Status Code, Headers และ Response Body

**Accept กับ Content-Type ต่างกันอย่างไร?**

- `Accept: application/json` หมายถึง Client ต้องการรับ Response เป็น JSON
- `Content-Type: application/json` หมายถึง Body ที่กำลังส่งมีรูปแบบ JSON

**Positive Testing** คือทดสอบข้อมูลที่ถูกต้อง เช่น POST สินค้าที่มีชื่อและราคาเหมาะสม

**Negative Testing** คือทดสอบข้อมูลที่ไม่ถูกต้อง เช่น ราคาติดลบ หรือ ID ที่ไม่มีอยู่

## **5. ส่งผลการทดลอง**

API Testing Step 1 ผ่านหรือยัง?

ผ่านแล้ว — ทดสอบ GET, POST และ Error Cases ได้

มีปัญหาเชื่อม Postman กับ localhost

Status Code หรือ Response ไม่ตรง

ยังทำไม่ครบ

ส่งผลการทดลอง&#x20;

เมื่อผ่านแล้ว เราจะไป **API Testing Step 2** โดยทดสอบ PUT, DELETE และ Restore จากนั้นฝึกเขียน Assertions ให้ Postman ตรวจสอบผลลัพธ์ให้อัตโนมัติ ซึ่งเป็นการต่อยอดจากการส่ง Request ด้วยตนเองครับ

# **Lab 3 — API Testing Step 2: PUT, DELETE, Restore และ Automated Tests**

💻 ปฏิบัติใน Postman — ไม่ต้องแก้โค้ด VS Code

รอบนี้เราจะใช้ Product API จาก MVC Lab เดิม ทดสอบการแก้ไข ลบ และกู้คืนสินค้า พร้อมเขียน **Automated Tests ด้วย&#x20;**`pm.test()` เพื่อให้ Postman ตรวจสอบผลลัพธ์โดยอัตโนมัติ

ในสไลด์ API Testing ที่คุณอัปโหลด มีการฝึกส่ง HTTP Request ด้วย GET, POST และ PUT รวมถึงการใช้ Postman ส่วนการเขียน Assertions ด้วย `pm.test()` ด้านล่างเป็นแบบฝึกเพิ่มเติมที่ผมจัดให้ใช้กับ Product API ของคุณโดยเฉพาะ

## **1. สิ่งที่ต้องทำให้สำเร็จ**

| ลำดับ | Method | Endpoint                    | Expected Status |
| ----- | ------ | --------------------------- | --------------- |
| 1     | POST   | `/api/products`             | 201             |
| 2     | PUT    | `/api/products/:id`         | 200             |
| 3     | GET    | `/api/products/:id`         | 200             |
| 4     | DELETE | `/api/products/:id`         | 200             |
| 5     | GET    | `/api/products/:id`         | 404             |
| 6     | PUT    | `/api/products/restore/:id` | 200             |
| 7     | GET    | `/api/products/:id`         | 200             |

เราจะใช้สินค้าใหม่สำหรับการทดสอบ เพื่อไม่ให้เผลอลบสินค้า Keyboard, Mouse หรือ Monitor ที่มีอยู่เดิม

## **2. เตรียม Server**

เปิด VS Code → Terminal

```
cd C:\Users\Vivobook\Desktop\mvc-lab
docker compose up -d
node app.js
```

ถ้า Server เดิมยังทำงานอยู่ ไม่ต้องรันซ้ำ

จากนั้นเปิด Postman

## **3. สร้าง Collection และ Variable**

ใน Postman:

1. กด **New → Collection**
2. ตั้งชื่อ `MVC Product API Tests`
3. เปิด Collection → Variables
4. เพิ่มตัวแปรสองตัวตามตาราง

| Variable    | Value                   |
| ----------- | ----------------------- |
| `baseUrl`   | `http://localhost:3001` |
| `productId` | เว้นว่างไว้             |

บันทึก Collection

ต่อไปเราจะใช้ URL ในรูปแบบ

```
{{baseUrl}}/api/products
```

และ

```
{{baseUrl}}/api/products/{{productId}}
```

`{{productId}}` จะถูกแทนด้วย ID ของสินค้าที่สร้างขึ้นจริง

## **4. Test 1 — POST สร้างสินค้าสำหรับทดสอบ**

สร้าง Request ใน Collection ชื่อ `01 Create Product`

POST

{{baseUrl}}/api/products

ไปที่ **Body → raw → JSON** แล้ววางข้อมูลนี้

```

{
  "name": "Test Keyboard",
  "price": 1000,
  "discount": 0,
  "review_count": 0,
  "image_url": ""
}

```

### **เพิ่ม Automated Test**

ไปที่แท็บ **Scripts → Post-response** (บางเวอร์ชันใช้ชื่อ Tests) แล้ววางโค้ดนี้

💻 วางใน Postman ไม่ใช่ VS Code

```

pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Product created successfully", function () {
    const data = pm.response.json();

    pm.expect(data.message).to.eql("Product created");
    pm.expect(data.id).to.be.a("number");
});

if (pm.response.code === 201) {
    const data = pm.response.json();

    pm.collectionVariables.set("productId", data.id);
}

```

กด **Send**

หากสำเร็จ Postman จะรายงานว่าการทดสอบผ่าน และบันทึก ID ของสินค้าที่เพิ่งสร้างลงใน `productId`

### **อธิบายโค้ด**

```
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});
```

- `pm.test()` ใช้สร้าง Test Case
- `pm.response` คือ Response ที่ API ส่งกลับ
- `.to.have.status(201)` ตรวจว่า HTTP Status Code เท่ากับ 201

```
pm.collectionVariables.set("productId", data.id);
```

คำสั่งนี้เก็บ ID เพื่อให้ Request ถัดไปใช้งานได้ โดยไม่ต้องคัดลอก ID ด้วยตนเอง

## **5. Test 2 — PUT แก้ไขสินค้า**

สร้าง Request ชื่อ `02 Update Product`

PUT

{{baseUrl}}/api/products/{{productId}}

**Body → raw → JSON**

```

{
  "name": "Test Keyboard Pro",
  "price": 1800,
  "discount": 10,
  "review_count": 5,
  "image_url": ""
}

```

**Scripts → Post-response**

```

pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Product updated successfully", function () {
    const data = pm.response.json();

    pm.expect(data.message).to.eql("Product updated");
});

```

กด Send

ผลลัพธ์ที่คาดหวัง:

```
{
  "message": "Product updated"
}
```

สิ่งสำคัญคือ Test นี้ตรวจว่า API รายงานการแก้ไขสำเร็จ แต่ยังไม่ได้พิสูจน์ว่าข้อมูลในฐานข้อมูลเปลี่ยนจริง เราจึงต้องทำ Test 3 ต่อ

## **6. Test 3 — GET ตรวจสอบข้อมูลหลัง Update**

สร้าง Request ชื่อ `03 Verify Update`

GET

{{baseUrl}}/api/products/{{productId}}

**Scripts → Post-response**

```

pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Product data was updated", function () {
    const data = pm.response.json();

    pm.expect(data.name).to.eql("Test Keyboard Pro");
    pm.expect(Number(data.price)).to.eql(1800);
    pm.expect(Number(data.discount)).to.eql(10);
    pm.expect(data.review_count).to.eql(5);
});

```

กด Send

ถ้าผ่าน แสดงว่าเราไม่ได้ตรวจแค่ข้อความตอบกลับ แต่ตรวจข้อมูลจริงที่ API อ่านกลับมาจาก MySQL ด้วย

**ข้อควรจำ:** MySQL อาจส่งข้อมูลชนิด `DECIMAL` กลับมาเป็น String เช่น `"1800.00"` เราจึงใช้ `Number(data.price)` ก่อนเปรียบเทียบ

## **7. Test 4 — DELETE สินค้า**

สร้าง Request ชื่อ `04 Delete Product`

DELETE

{{baseUrl}}/api/products/{{productId}}

ไม่ต้องใส่ Body

**Scripts → Post-response**

```

pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Product soft-deleted successfully", function () {
    const data = pm.response.json();

    pm.expect(data.message).to.eql("Product soft-deleted");
});

```

กด Send

ผลลัพธ์ที่คาดหวัง:

```
{
  "message": "Product soft-deleted"
}
```

**สิ่งที่เกิดขึ้นในฐานข้อมูล**

```
UPDATE products
SET is_deleted = 1
WHERE id = ?;
```

สินค้ายังอยู่ใน MySQL แต่จะไม่ปรากฏในรายการสินค้าปกติ

## **8. Test 5 — ตรวจสอบว่าลบแล้วจริงหรือไม่**

สร้าง Request ชื่อ `05 Verify Delete`

GET

{{baseUrl}}/api/products/{{productId}}

**Scripts → Post-response**

```

pm.test("Deleted product returns 404", function () {
    pm.response.to.have.status(404);
});

pm.test("Product not found message", function () {
    const data = pm.response.json();

    pm.expect(data.error).to.eql("Product not found");
});

```

กด Send

ผลลัพธ์ที่คาดหวัง:

```
{
  "error": "Product not found"
}
```

สังเกตว่า **HTTP 404 ไม่ได้แปลว่า Test ล้มเหลวเสมอไป** เพราะในกรณีนี้เราตั้งใจทดสอบว่าสินค้าที่ถูกลบจะไม่สามารถอ่านผ่าน API ปกติได้

ถ้าได้ 404 ตามที่คาดไว้ Test จะผ่าน

## **9. Test 6 — Restore สินค้า**

สร้าง Request ชื่อ `06 Restore Product`

PUT

{{baseUrl}}/api/products/restore/{{productId}}

ไม่ต้องใส่ Body

**Scripts → Post-response**

```

pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Product restored successfully", function () {
    const data = pm.response.json();

    pm.expect(data.message).to.eql("Product restored");
});

```

กด Send

ผลลัพธ์ที่คาดหวัง:

```
{
  "message": "Product restored"
}
```

## **10. Test 7 — ตรวจสอบข้อมูลหลัง Restore**

สร้าง Request ชื่อ `07 Verify Restore`

GET

{{baseUrl}}/api/products/{{productId}}

**Scripts → Post-response**

```

pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Restored product is accessible", function () {
    const data = pm.response.json();

    pm.expect(data.name).to.eql("Test Keyboard Pro");
    pm.expect(Number(data.price)).to.eql(1800);
    pm.expect(data.is_deleted).to.eql(0);
});

```

กด Send

ถ้าผ่าน แสดงว่าสินค้าถูกกู้คืนและสามารถอ่านข้อมูลผ่าน API ได้อีกครั้ง

## **11. รัน Automated Tests ทั้ง Collection**

เมื่อสร้าง Request ทั้ง 7 รายการแล้ว ให้บันทึกทุก Request ไว้ใน Collection เดียวกัน โดยเรียงลำดับตามที่สอน

จากนั้นเปิด Collection แล้วเลือก **Run** หรือ **Run Collection** ตามหน้าตา Postman เวอร์ชันที่ใช้งาน

ตั้ง Iterations เป็น `1` แล้วเริ่มรัน

ตัวอย่างผลลัพธ์ที่ควรได้

01 Create Product

PASS

02 Update Product

PASS

03 Verify Update

PASS

04 Delete Product

PASS

05 Verify Delete

PASS

06 Restore Product

PASS

07 Verify Restore

PASS

**Expected Result**

## **14/14 Tests**

ผลลัพธ์ที่คาดหวังเมื่อรันตามลำดับครบ 7 Requests โดยไม่มีปัญหาจาก Server หรือฐานข้อมูล

ในแต่ละ Request เราเขียน Assertions 2 ข้อ จึงรวมเป็น 14 Tests

หากรัน Collection ซ้ำ ระบบจะสร้างสินค้าใหม่อีกหนึ่งรายการทุกครั้ง เพราะ Request แรกเป็น POST และสินค้าที่สร้างขึ้นจะยังอยู่ในฐานข้อมูลหลัง Restore

## **12. สรุป Automated API Testing สำหรับสอบ**

| คำสั่ง                            | หน้าที่                        |
| --------------------------------- | ------------------------------ |
| `pm.test()`                       | ประกาศ Test Case               |
| `pm.response.to.have.status(200)` | ตรวจ HTTP Status Code          |
| `pm.response.json()`              | แปลง Response JSON เป็น Object |
| `pm.expect()`                     | ตรวจค่าที่คาดหวัง              |
| `.to.eql()`                       | เปรียบเทียบค่าแบบเท่ากัน       |
| `.to.be.a("number")`              | ตรวจชนิดข้อมูล                 |
| `pm.collectionVariables.set()`    | เก็บค่าตัวแปรใน Collection     |
| `pm.collectionVariables.get()`    | อ่านค่าตัวแปรจาก Collection    |

### **Manual Testing vs Automated Testing**

**Manual Testing:** ผู้ทดสอบส่ง Request และตรวจผลลัพธ์ด้วยตนเอง

**Automated Testing:** เขียน Assertions ให้เครื่องมือตรวจผลลัพธ์ตามเงื่อนไขที่กำหนด

ทั้งสองแบบยังต้องมีการออกแบบ Test Case ที่ดี เพราะการที่ Test ผ่านไม่ได้รับประกันว่าระบบไม่มีข้อผิดพลาดอื่น

## **13. แบบทดสอบสั้น ๆ**

1\. pm.test() มีหน้าที่อะไร?

สร้างตาราง MySQL

กำหนด Test Case

เริ่ม Express Server

ถูกต้อง — pm.test() ใช้ประกาศ Test Case ใน Postman

2\. DELETE แล้ว GET ได้ 404 ถือว่า Test ผ่านได้หรือไม่?

ได้ ถ้าคาดหวัง 404

ไม่ได้ เพราะต้องเป็น 200 เสมอ

ได้เฉพาะ POST

ถูกต้อง — ผลการทดสอบขึ้นกับ Expected Result ไม่ใช่ว่าทุก Response ต้องเป็น 200

3\. เหตุใดจึงต้อง GET หลัง PUT?

เพื่อ Restart Server

เพื่อตรวจว่าข้อมูลถูกแก้ไขจริง

เพื่อสร้างสินค้าใหม่

ถูกต้อง — Response ของ PUT เพียงอย่างเดียวไม่ได้ยืนยันว่าค่าที่อ่านกลับมาเปลี่ยนตรงตามต้องการ

## **คะแนน 3/3**

ตรวจคำตอบ

## **14. ส่งผล Lab**

ผลการรัน Postman Collection เป็นอย่างไร?

ผ่านครบ 14/14 Tests

ผ่านบางส่วน มี Test Failed

มีปัญหากับตัวแปร productId

ยังทำไม่ครบ

ส่งผลการทดสอบ&#x20;

เมื่อผ่าน Lab นี้แล้ว หัวข้อถัดไปคือ **Unit Testing with Jest** ซึ่งจะเปลี่ยนจากการส่ง HTTP Request เพื่อทดสอบ API มาเป็นการเขียนโค้ดทดสอบฟังก์ชันแต่ละส่วนโดยตรง
