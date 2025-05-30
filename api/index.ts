import app from '../src/index';
import { getDatabaseConnection } from '../src/data-source';

// Initialize database connection
getDatabaseConnection()
    .then(() => {
        console.log("Database connection established in API handler");
    })
    .catch((error) => {
        console.error("Error connecting to database in API handler:", error);
    });

export default app; 