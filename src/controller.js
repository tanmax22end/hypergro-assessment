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
    async getStock(req, res) {
        try {
            const { name } = req.query;
            const response = await Service.getStocksService(name);
            res.status(200).send(response);
        } catch (error) {
            res.status(500).send({ error: 'Internal Server Error' });
        }
    }
    async addFavorites(req, res) {
        try {
            const { userId, stockId } = req.body;
            if (!userId  || !stockId) {
                res.status(400).send({ error: 'Invalid Request. Provide valid stock details' });
                return;
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
            if (!userId) {
                res.status(400).send({ error: 'Invalid Request. Provide valid UserId' });
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
            if (!userId || !stockId) {
                res.status(400).send({ error: 'Invalid Request. Provide valid stock details' });
                return;
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
            if (!SC_CODE) {
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
}
module.exports = new Controller();