import "reflect-metadata";
import { DataSource } from "typeorm";
import { Contact } from "./entities/Contact";
import * as dotenv from "dotenv";

dotenv.config();

// Create a connection pool that can be reused
let dataSource: DataSource | null = null;

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE || "bitespeed",
    synchronize: true,
    logging: process.env.NODE_ENV !== 'production',
    entities: [Contact],
    migrations: [],
    subscribers: [],
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    extra: {
        max: 20,
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
    }
});

// Function to get or create a database connection
export async function getDatabaseConnection(): Promise<DataSource> {
    if (!dataSource) {
        try {
            if (!AppDataSource.isInitialized) {
                dataSource = await AppDataSource.initialize();
                console.log("Database connection established");
            } else {
                dataSource = AppDataSource;
            }
        } catch (error) {
            console.error("Error connecting to database:", error);
            throw error;
        }
    }
    return dataSource;
} 