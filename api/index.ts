import express from 'express';
import cors from 'cors';
import { identifyRouter } from '../src/routes/identify';
import { healthRouter } from '../src/routes/health';
import { getDatabaseConnection } from '../src/data-source';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database connection
getDatabaseConnection()
    .then(() => {
        console.log("Database connection established in API handler");
    })
    .catch((error) => {
        console.error("Error connecting to database in API handler:", error);
    });

// Root route
app.get('/', (req, res) => {
    res.json({
        service: "Bitespeed Identity Reconciliation Service",
        version: "1.0.0",
        endpoints: {
            identify: "/api/identify",
            health: "/api/health"
        }
    });
});

// API routes
app.use('/api/identify', identifyRouter);
app.use('/api/health', healthRouter);

// Start server only if not in production (Vercel handles this)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app; 