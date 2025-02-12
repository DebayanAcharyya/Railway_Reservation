#  Railway Reservation System

A **real-time railway booking system** that allows users to:
-  Authenticate via JWT-based login   
-  Add trains between stations (Admin Only)
-  Search for trains between stations  
-  Check available seats  
-  Book seats with **concurrency safety**  
-  Get booking details
 

The system **prevents double bookings** by ensuring only one user can book a seat when multiple users try **simultaneously**.

Admin API endpoints are protected with an **API key** that will be known only to the admin so that no one can add false data to the system.


---

## 🛠️ Features

-  **Train Search** - Find trains between stations  
-  **Seat Availability** - Check available seats in real-time  
-  **User Authentication** - JWT-based login for secure access  
-  **Optimized Seat Booking** - Handles **race conditions** to prevent overbooking  
-  **High Traffic Handling** - Uses **database transactions & row-level locking**  

---

## Tech Stack

- Backend: Node.js, Express.js

- Database: MySQL with Prisma ORM

- Authentication: JWT (JSON Web Token)

- Testing: Jest, Supertest

##  Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/DebayanAcharyya/Railway_Reservation.git
cd Railway_Reservation
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the project root and add:
```ini
DATABASE_URL=mysql://user:password@localhost:3306/railway_db
JWT_SECRET=your_secret_key
ADMIN_API_KEY=your_admin_key
PORT=3000
NODE_ENV=development
```

### 4️⃣ Run Database Migrations
```bash
npx prisma migrate dev --name init
```

### 5️⃣ Start the Server
```bash
npm start
```

---

## 📡 API Endpoints

### 🔑 1. Authentication

**Register a User**

```bash
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "securepassword123",
  "role": "user"
}
```

**Register an Admin**

```bash
POST /api/auth/register
x-api-key: <admin_api_key>
```

**Request Body:**
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "securepassword123",
  "role": "admin"
}
```


**Login**

```bash
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "johndoe@example.com",
  "password": "securepassword123"
}
```

### 2. Train Operations
**Add Trains between stations (Admin only)**

```bash
POST /api/trains/add
Authorization: Bearer <token>
x-api-key: <admin_api_key>
```
**Request Body:**
```json
{
  "name": "Express Train",
  "source": "City A",
  "destination": "City B",
  "totalSeats": 100
}
```

**Search for Trains between stations**  

```bash
GET /api/trains/search?source=CityA&destination=CityB
```

**Check Available Seats**  
```bash
GET /api/bookings/available-seats/:trainId
```

###  3. Booking Operations
**Book a Seat**  
```bash
POST /api/bookings/book
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "trainId": 1
}
```

**Get Booking Details**  
```bash
GET /api/bookings/:bookingId
Authorization: Bearer <token>
```

---

## ⚙️ Concurrency Handling
This system ensures **only one user** can book a seat when multiple users try simultaneously by:
- Using **Prisma transactions** to maintain consistency.
- Locking rows with `SELECT ... FOR UPDATE` to prevent double booking.


---

## ✅ Running Tests

### 🧪 1. Run Unit Tests
Tests are included for authentication, train operations, booking seats and concurrency testing.
```bash
npm test
```




