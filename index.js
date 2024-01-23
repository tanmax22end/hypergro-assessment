const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./src/routes.js');
const path = require('path');
const axios = require('axios');
const AdmZip = require('adm-zip');
const StockDetails = require('./src/models/stock-info.js');
const xlsx = require('xlsx');
const fs = require('fs');
const router = routes(express);
const app = express();
require('dotenv').config();
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
app.use(bodyParser.json());
app.use('/api', router);
const PORT = 8080;

async function insertDataFromExcel(filepath) {
    try {
        // Load Excel workbook
        const workbook = xlsx.readFile(filepath);
        // Assume the data is present in the first sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        // Convert Excel data to an array of objects
        const excelData = xlsx.utils.sheet_to_json(sheet);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        await StockDetails.insertMany(excelData);
        console.log('Data inserted successfully.');
        try {
            fs.unlinkSync(filepath);
            console.log(`File deleted: ${filepath}`);
        } catch (error) {
            console.log("File Deletion failed due to the some error", error);
        }
    } catch (error) {
        console.error('Error inserting data:', error);
    }
}

async function fetchDataFromBSE(date) {
    try {
        const bseUrl = `https://www.bseindia.com/download/BhavCopy/Equity/EQ${date}_CSV.ZIP`;
        const response = await axios.get(bseUrl, { responseType: 'arraybuffer' });
        const zip = new AdmZip(response.data);
        const zipEntries = zip.getEntries();
        // Assume the Excel file is present in the ZIP
        const excelEntry = zipEntries.find(entry => entry.entryName.endsWith('.CSV'));
        if (!excelEntry) {
            throw new Error('Excel file not found in the ZIP.');
        }
        // Save the Excel file in the current directory
        const excelFilePath = path.join(__dirname, `./scripts/EQ${date}_Data.CSV`);
        fs.writeFileSync(excelFilePath, zip.readAsText(excelEntry));
        console.log(`Data for ${date} saved successfully.`);
    } catch (error) {
        console.error(`Error fetching data for ${date}:`, error.message);
    }
}

app.listen(PORT, async () => {
    const db = await mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.pqaih.mongodb.net/hypergro?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log("Server started successfully");
    const currentDate = new Date();
    let date = currentDate
        .toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })
        .replace(/\//g, ''); // Format: DDMMYY
    await fetchDataFromBSE(date);
    const filepath = path.join(__dirname, `./scripts/EQ${date}_Data.CSV`);
    console.log(filepath)
    await insertDataFromExcel(filepath);
})
