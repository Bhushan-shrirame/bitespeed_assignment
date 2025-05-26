import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { AppDataSource } from "./data-source";
import { ContactService } from "./services/ContactService";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Initialize database connection
AppDataSource.initialize()
    .then(() => {
        console.log("Database connection established");
    })
    .catch((error) => {
        console.error("Error connecting to database:", error);
        process.exit(1);
    });

// Routes
app.post("/identify", async (req: Request, res: Response) => {
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
app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 