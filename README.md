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

## Deployment on Render.com

1. Fork this repository to your GitHub account

2. Sign up for a free account on [Render.com](https://render.com)

3. Create a new PostgreSQL database on Render:
   - Go to Dashboard > New > PostgreSQL
   - Choose a name for your database
   - Note down the database credentials

4. Create a new Web Service:
   - Go to Dashboard > New > Web Service
   - Connect your GitHub repository
   - Choose the repository
   - Configure the service:
     - Name: bitespeed-identity-service
     - Environment: Node
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`
   - Add the following environment variables:
     ```
     NODE_ENV=production
     PORT=3000
     DB_HOST=<your-render-db-host>
     DB_PORT=5432
     DB_USERNAME=<your-render-db-username>
     DB_PASSWORD=<your-render-db-password>
     DB_DATABASE=<your-render-db-name>
     ```

5. Click "Create Web Service"

Your service will be automatically deployed and available at `https://bitespeed-identity-service.onrender.com`

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