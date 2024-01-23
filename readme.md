# Project Title

Stock Price Analysis Application.

### Prerequisites

- Node.js and npm installed on your machine
- MongoDB server

### Installing

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/tanmax22end/hypergro-assessment
    ```

2. Install project dependencies:

    ```bash
    cd hypergro-assessment
    npm install
    ```

3. Set up environment variables:

    Create a `.env` file in the root directory and provide the required environment variables:

    ```env
    MONGODB_USERNAME=your-mongodb-username
    MONGODB_PASSWORD=your-mongodb-password
    ```

4. Start the server:

    ```bash
    npm start
    ```

## API Endpoints

### 1. Get Top Stocks

- **Endpoint:** `/api/v1/getTopStocks`
- **Method:** `GET`
- **Description:** Fetches the top 10 performing stocks based on percent gain.
- **Query Parameters:** None

### 2. Get Stocks by Name

- **Endpoint:** `/api/v1/stocks`
- **Method:** `GET`
- **Description:** Fetches stocks by name. The name should be alphanumeric and between 2 to 20 characters.
- **Query Parameters:**
  - `name` (string): Alphanumeric stock name (2 to 20 characters).

### 3. Add Favorites

- **Endpoint:** `/api/v1/favorites`
- **Method:** `POST`
- **Description:** Adds a stock to the user's favorites list.
- **Request Body:**
  - `userId` (number): User ID (1 to 1 billion).
  - `stockId` (number): Stock ID (1 to 1 billion).

### 4. Get User's Favorite Stocks

- **Endpoint:** `/api/v1/getfavorites`
- **Method:** `GET`
- **Description:** Fetches the list of favorite stocks for a given user.
- **Query Parameters:**
  - `userId` (number): User ID (1 to 1 billion).

### 5. Delete User's Favorite Stock

- **Endpoint:** `/api/v1/deletefavorites`
- **Method:** `DELETE`
- **Description:** Deletes a stock from the user's favorites list.
- **Query Parameters:**
  - `userId` (number): User ID (1 to 1 billion).
  - `stockId` (number): Stock ID (1 to 1 billion).

### 6. Stock Price History

- **Endpoint:** `/api/v1/stockPriceHistory`
- **Method:** `GET`
- **Description:** Fetches the price history of a stock.
- **Query Parameters:**
  - `SC_CODE` (number): Stock code (1 to 1 billion).

## Authors

- Author - [GitHub](https://github.com/tanmax22end)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- etc.
