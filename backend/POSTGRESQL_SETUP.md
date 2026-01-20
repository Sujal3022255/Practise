# PostgreSQL Setup Guide

## Database Configuration

Your application is already configured to connect to PostgreSQL with the following settings:

- **Database Name:** dentalcare
- **User:** postgres
- **Password:** sujal@123
- **Host:** localhost
- **Port:** 5432

## Steps to Set Up in pgAdmin

### 1. Open pgAdmin
Launch pgAdmin 4 on your system.

### 2. Create the Database
1. Right-click on "Databases" under your PostgreSQL server
2. Select **Create > Database**
3. Enter database name: `dentalcare`
4. Click **Save**

### 3. Verify Connection
Your application will automatically:
- Connect to the database
- Create tables based on your models (User, Product)
- Use Sequelize ORM for all database operations

### 4. Tables Created Automatically
When you start the server, Sequelize will create these tables:
- `user` - Stores user information (id, username, email, password, role)
- `Product` - Stores product information

## Starting the Server

```bash
cd backend
npm start
```

The server will:
1. Connect to PostgreSQL
2. Sync models (create tables)
3. Start listening on http://localhost:3000

## Verifying Database in pgAdmin

After starting the server:
1. In pgAdmin, refresh the database
2. Navigate to: dentalcare > Schemas > public > Tables
3. You should see your tables (user, Product)

## Common Issues

### Connection Refused
- Ensure PostgreSQL server is running
- Check if port 5432 is available
- Verify PostgreSQL is accepting connections on localhost

### Authentication Failed
- Verify password in .env file matches your PostgreSQL user password
- Check if 'postgres' user has proper permissions

### Database Doesn't Exist
- Create the 'dentalcare' database manually in pgAdmin before starting the server
