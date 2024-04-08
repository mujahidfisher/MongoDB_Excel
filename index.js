const express = require("express");
const app = express();
const excel = require("exceljs");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const fs = require("fs");
require("./config/connectDB");
const PORT = process.env.PORT || 5000;

const url = process.env.MONGODB_URL;
const dbName = "api-server";
const collectionName = "users";

app.use(bodyParser.json());
app.use(express.static("./static"));
app.use(express.json());

app.get("/download", async (req, res) => {
  try {
    const client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const data = await collection.find({}).toArray();

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    worksheet.columns = Object.keys(data[0]).map((key) => ({
      header: key,
      key: key,
    }));
    data.forEach((item) => {
      worksheet.addRow(item);
    });

    const excelFilePath = "data.xlsx";
    await workbook.xlsx.writeFile(excelFilePath);

    res.download(excelFilePath, "data.xlsx", (err) => {
      if (err) console.error(err);
      fs.unlinkSync(excelFilePath);
    });

    await client.close();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}🐱‍💻`);
});
