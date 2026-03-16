require('dotenv').config();
const app = require("./src/app")
const connectDB = require("./src/db/db")


const PORT = process.env.PORT || 5000

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
});