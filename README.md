# Bitespeed Identity Reconciliation Service

This service helps identify and link customer contacts across multiple purchases by matching email addresses and phone numbers.

## Features

- Identifies and links customer contacts based on email and phone number
- Maintains primary and secondary contact relationships
- Handles contact consolidation and updates
- RESTful API endpoint for contact identification

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)

## Local Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd bitespeed
```

2. Install dependencies:
```bash
npm install
```

3. Create a PostgreSQL database named `bitespeed`

4. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=bitespeed
NODE_ENV=development
```

5. Build and start the application:
```bash
npm run build
npm start
```

For development:
```bash
npm run dev
```

## Deployment on Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy the application:
```bash
vercel
```

4. Set up environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add the following variables:
     ```
     NODE_ENV=production
     PORT=3000
     DB_HOST=<your-db-host>
     DB_PORT=5432
     DB_USERNAME=<your-db-username>
     DB_PASSWORD=<your-db-password>
     DB_DATABASE=<your-db-name>
     ```

Note: Make sure your PostgreSQL database is accessible from Vercel's servers. You might need to use a cloud-hosted PostgreSQL service like Neon, Supabase, or Railway.

## API Endpoints

### POST /identify

Identifies and links customer contacts based on provided email and/or phone number.

**Request Body:**
```json
{
    "email": "example@email.com",
    "phoneNumber": "1234567890"
}
```

**Response:**
```json
{
    "contact": {
        "primaryContatctId": 1,
        "emails": ["example@email.com"],
        "phoneNumbers": ["1234567890"],
        "secondaryContactIds": []
    }
}
```

### GET /health

Health check endpoint to verify service status.

**Response:**
```json
{
    "status": "ok"
}
```

## Testing

Run tests using:
```bash
npm test
```

## Error Handling

The service returns appropriate HTTP status codes and error messages:
- 400: Bad Request (invalid input)
- 500: Internal Server Error

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 