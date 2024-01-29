//const { userSchema, spamSchema, queryPhoneSchema, queryNameSchema } = require('./Validations/validationSchema.js');
const Service = require('./service.js');

class Controller {

    async getTopStocks(req, res) {
        try {
            const response = await Service.getTopStocksService();
            res.status(200).send(response);
        } catch (error) {
            res.status(400).send({ error: error });
        }
    }
    async getTodayTopStock(req, res) {
        try {
            const response = await Service.getTodayTopStockService();
            res.status(200).send(response);
        } catch (error) {
            res.status(400).send({ error: error });
        }
    }

    async getStock(req, res) {
        try {
            const { name } = req.query;
            if (!name || !/^[a-zA-Z0-9]{2,20}$/.test(name)) {
                return res.status(400).json({ error: 'Invalid stock name. It should be alphanumeric and between 2 to 20 characters.' });
            }
            const response = await Service.getStocksService(name);
            res.status(200).send(response);
        } catch (error) {
            res.status(500).send({ error: 'Internal Server Error' });
        }
    }
    async addFavorites(req, res) {
        try {
            const { userId, stockId } = req.body;
            if (!userId || !(/^[1-9]\d{0,8}$/.test(userId))) {
                return res.status(400).json({ error: 'Invalid User ID. It should be a number between 1 and 1 billion.' });
            }

            if (!stockId || (!/^[1-9]\d{0,8}$/.test(stockId))) {
                return res.status(400).json({ error: 'Invalid Stock ID. It should be a number between 1 and 1 billion.' });
            }
            const validatedInput = { userId, stockId };
            const response = await Service.updateFavouriteStock(validatedInput);
            res.status(200).send(response);
        } catch (error) {
            res.status(500).send({ error: 'Internal Server Error' });
        }
    }
    async getFavourites(req, res) {
        try {
            const { userId } = req.query;
            if (!userId || (!/^[1-9]\d{0,8}$/.test(userId))) {
                return res.status(400).json({ error: 'Invalid User ID. It should be a number between 1 and 1 billion.' });
            }
            console.log(req.query);
            const response = await Service.getFavouriteStock(req.query);
            res.status(200).send(response);
        } catch (error) {
            res.status(400).send({ message: 'Unable to fetch favourite stock', error });
        }
    }
    async deleteFavourites(req, res) {
        try {
            const { userId, stockId } = req.query;
            if (!userId || !/^[1-9]\d{0,8}$/.test(userId)) {
                return res.status(400).json({ error: 'Invalid User ID. It should be a number between 1 and 1 billion.' });
            }
            if (!stockId || !/^[1-9]\d{0,8}$/.test(stockId)) {
                return res.status(400).json({ error: 'Invalid Stock ID. It should be a number between 1 and 1 billion.' });
            }
            const validatedInput = req.query;
            const response = await Service.deleteFavouriteStock(validatedInput);
            res.status(200).send(response);
        } catch (error) {
            res.status(400).send({ message: 'Unable to fetch favourite stock', error });
        }
    }
    async stockPriceHistory(req, res) {
        try {
            const { SC_CODE } = req.query;
            if (!SC_CODE || !/^[1-9]\d{0,8}$/.test(SC_CODE)) {
                res.status(400).send({ error: 'Invalid Request. Provide valid stock details' });
                return;
            }
            const validatedInput = req.query;
            const response = await Service.getStockPriceHistory(validatedInput);
            res.status(200).send(response);
        } catch (error) {
            res.status(400).send({ message: 'Unable to fetch stock history stock' });
        }
    }
    async fetchDataFromBSE(date) {
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
        const excelFilePath = path.join(__dirname, `EQ${date}_Data.CSV`);
        fs.writeFileSync(excelFilePath, zip.readAsText(excelEntry));
        console.log(`Data for ${date} saved successfully.`);
    } catch (error) {
        console.error(`Error fetching data for ${date}:`, error.message);
    }
    }
    async fetchDataFromBSE(date) {
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
    async refreshDataController(req, res) {
        try {
            console.log("Server started successfully");
            const currentDate = new Date();
            let date = currentDate
                .toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })
                .replace(/\//g, ''); // Format: DDMMYY
            await fetchDataFromBSE(date);
            const filepath = path.join(__dirname, `./scripts/EQ${date}_Data.CSV`);
            console.log(filepath)
            await insertDataFromExcel(filepath);
            res.status(200).send({ message: 'latest data has been successfully uploaded' });
        } catch (error) {
            res.status(400).send({ message: 'Unable to fetch latest data' }, error);
        }
    }
}
module.exports = new Controller();