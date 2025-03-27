# Gjimnazi "Abdulla Keta" Website

A modern web application for the "Abdulla Keta" high school in Tirana, Albania. Built with React, TypeScript, and Express.

## Project Structure

- **Frontend**: React with TypeScript, styled with Tailwind CSS
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM

## Running on Replit

The project is pre-configured to run on Replit with all necessary database connections.

## Running Locally

### Prerequisites

1. Node.js (version 16 or higher)
2. PostgreSQL database (local or cloud)

### Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory based on `.env.example`
   - Add your PostgreSQL database connection URL:
   ```
   DATABASE_URL=postgres://username:password@hostname:port/database
   ```

   You can set up a free PostgreSQL database on services like:
   - [Neon](https://neon.tech) (Free tier available)
   - [Supabase](https://supabase.com) (Free tier available)
   - Or use a local PostgreSQL installation

4. Run the database migrations:
   ```
   npm run db:push
   ```

5. Start the development server:
   ```
   npm run dev
   ```

## Features

- Modern school website with responsive design
- News section for school announcements
- School calendar and schedule
- Information about various departments and programs
- Contact form for inquiries
- Admin section for staff

## Technologies Used

- React
- TypeScript
- Express.js
- PostgreSQL
- Drizzle ORM
- Tailwind CSS
- Framer Motion
- Wouter (Routing)