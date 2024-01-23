const controller = require('./controller.js');

const routes = (express) => {
    const router = express.Router();
    router.get(
        "/v1/getTopStocks",
        controller.getTopStocks
    )
    router.get(
        "/v1/stocks",
        controller.getStock
    )
    router.post(
        "/v1/favorites",
        controller.addFavorites
    )
    router.get(
        "/v1/getfavorites",
        controller.getFavourites
    )
    router.delete(
        "/v1/deletefavorites",
        controller.deleteFavourites
    )
    router.get(
        "/v1/stockPriceHistory",
        controller.stockPriceHistory
    )
    return router;
}
//module.exports = routes
module.exports = routes;