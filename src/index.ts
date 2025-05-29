import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { getDatabaseConnection } from "./data-source";
import { ContactService } from "./services/ContactService";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Initialize database connection
getDatabaseConnection()
    .then(() => {
        console.log("Database connection established");
    })
    .catch((error) => {
        console.error("Error connecting to database:", error);
        // Don't exit in production, let the serverless function handle the error
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    });

// Root route
app.get("/api", (_req: Request, res: Response) => {
    res.json({
        name: "Bitespeed Identity Reconciliation Service",
        version: "1.0.0",
        endpoints: {
            identify: {
                path: "/api/identify",
                method: "POST",
                description: "Identify and link customer contacts"
            },
            health: {
                path: "/api/health",
                method: "GET",
                description: "Health check endpoint"
            }
        }
    });
});

// Routes
app.post("/api/identify", async (req: Request, res: Response) => {
    try {
        const { email, phoneNumber } = req.body;
        const contactService = new ContactService();
        const result = await contactService.identifyContact(email, phoneNumber);
        res.json(result);
    } catch (error) {
        console.error("Error in /identify endpoint:", error);
        res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
});

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
});

// Start server only if not in serverless environment
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

export default app; 