const StockDetails = require('./models/stock-info.js');
const Favorites = require('./models/favorites.js')
class Service {
    async getTopStocksService() {
        try {
            const top10Stocks = await StockDetails.aggregate([
                {
                    $addFields: {
                        percentGain: {
                            $cond: {
                                if: { $ne: ['$PREVCLOSE', 0] }, // Check if PREVCLOSE is not zero
                                then: {
                                    $multiply: [
                                        { $divide: [{ $subtract: ['$CLOSE', '$PREVCLOSE'] }, '$PREVCLOSE'] },
                                        100
                                    ]
                                },
                                else: 0 // Handle division by zero case
                            }
                        }
                    }
                },
                {
                    $sort: { percentGain: -1 } // Sort in descending order based on percentGain
                },
                {
                    $limit: 10
                }
            ]);
            return { top10Stocks };
        } catch (error) {
            console.error('Error fetching top 10 stocks:', error);
            return { error: 'Internal Server Error' };
        }
    }
    async getStocksService(input) {
        try {
            /*const stocksByName = await StockDetails.find({ SC_NAME: { $regex: new RegExp(input, 'i') } });*/
            console.log(input);
            const stocksByName = await StockDetails.find({ SC_NAME: { $regex: new RegExp(input, 'i') } })
                .limit(10);
            return { stocks: stocksByName };
        } catch (error) {
            console.log('Error fetching stocks by name:', error);
            return { error };
        }
    }
    async updateFavouriteStock(input) {
        try {
            console.log(input);
            const existingFavoriteStock = await Favorites.findOne({
                userId: input.userId,
                stockId: input.stockId
            });
            const existingStock = await StockDetails.findOne({
                SC_CODE: input.stockId,
            })
            if (existingFavoriteStock) {
                console.log('Stock already exists in favorites.');
                return { message: 'Stock already exists in favorites.', existingFavoriteStock };
            }
            if (existingStock) {
                input.stockName = existingStock.SC_NAME;
                const savedStock = await Favorites.create(input);
                return { savedStock };
            } else {
                console.log('No such stock exist in BSE index for now')
                return { message: 'No such stock exist in BSE index for now' };
            }
        } catch (error) {
            console.log('Error fetching stocks by name:', error);
            return { error };
        }
    }
    async getFavouriteStock(input) {
        try {
            const favoriteStock = await Favorites.find(input);
            console.log(favoriteStock);
            if (favoriteStock.length > 0) {
                return favoriteStock;
            } else {
                return { message: "No records found for the requested user" };
            }
        } catch (error) {
            console.log('Error fetching favorite stock', error);
            return { error };
        }
    }
    async deleteFavouriteStock(input) {
        try {
            const deletedStock = await Favorites.findOneAndDelete(input);
            if (deletedStock) {
                return deletedStock;
            } else {
                return { message: "No such Stock Exists in the Favorite list of the User" };
            }
        } catch (error) {
            console.log('Error occured in deleting the stock', error);
            return { message: 'Error occured in deleting the stock', error };
        }
    }
    async getStockPriceHistory(input) {
        try {
            const stocks = await StockDetails.find(input)
            const formattedStocks = stocks.map(stock => {
                // Assuming TIMESTAMP is a Date type field
                const timestamp = stock.TIMESTAMP;

                // Format the timestamp as DD-MM-YYYY
                const formattedTimestamp = `${timestamp.getDate().toString().padStart(2, '0')}-${(timestamp.getMonth() + 1).toString().padStart(2, '0')}-${timestamp.getFullYear()}`;

                // Return the stock data with the formatted timestamp
                return {
                    ...stock._doc,
                    TIMESTAMP: formattedTimestamp,
                };
            });
            return formattedStocks;
        } catch (error) {
            console.log('Error occured in fetching the stock', error);
            return { message: 'Error occured in fetching the stock', error };
        }
    }
}
module.exports = new Service();