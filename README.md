# 🎉 EventScout(without Ticketing system)/EventPass(After integrating Ticketing System)

EventScout is a modern **Event Management and Ticketing Platform** built using the **MERN Stack (MongoDB, Express, React, Node.js)**.  

It allows users to **discover events, register, make payments, and receive secure digital tickets (QR-based)**.  
It works like a simplified version of platforms such as **Eventbrite or Meetup**.

---

# 🚀 What EventScout Does

EventScout solves the problem of fragmented event discovery and manual registration by providing a centralized system where:

## 👤 For Users:
- Browse all available events
- Search and view event details
- Register for events
- Make payments (if event is paid)
- Receive a **unique digital ticket (QR code)**
- View registered events in dashboard

## 🧑‍💼 For Organizers/Admin:
- Create and manage events
- Set event details (date, time, location, price)
- Track registered users
- Validate tickets at entry
- Prevent fake or duplicate entries

---

# 🎟️ Ticket System (Core Feature)

The ticket system ensures every valid user gets a **secure, unique digital ticket**.

## 🧭 How Ticket System Works

### 1️⃣ Event Registration
User clicks **Register Event**

Backend checks:
- Is user logged in?
- Is user already registered?

---

### 2️⃣ Payment (if required)
If event is paid:

- User completes payment via gateway (Stripe / Khalti / Esewa)
- Backend verifies payment (NOT frontend)

---

### 3️⃣ Ticket Generation
After successful registration/payment:

System generates a ticket:

```json id="ticket_example"
{
  "ticketId": "EVT-8X92K-2026",
  "userId": "USER123",
  "eventId": "EVENT456",
  "qrCode": "encrypted_secure_token",
  "status": "valid"
}
-----
# 4️⃣ Ticket Delivery

User receives ticket via:

Dashboard download
Email
QR code display
5️⃣ Event Entry (Validation)

At event gate:

Organizer scans QR code
Backend verifies ticket
Marks ticket as USED
🔐 Security System (VERY IMPORTANT)

EventScout ensures only valid users get tickets.

🚫 1. Authentication Required

Only logged-in users can:

Register for events
Access tickets

Uses:

JWT Authentication
🔒 2. Backend Validation (Never trust frontend)

Backend verifies:

User identity
Event registration
Payment status
🎟️ 3. Unique Secure Tickets

Each ticket:

Has unique ID
Uses encrypted QR code (not plain data)
Cannot be guessed or duplicated
🧾 4. Payment Verification

Payments are verified using backend integration:

Stripe / Khalti / Esewa APIs
Webhook confirmation (secure verification)

❌ Frontend success is NOT trusted

🛑 5. Prevent Duplicate Tickets

System ensures:

One user = one ticket per event
🚷 6. Ticket Usage Control

At entry:

If ticket already used → reject entry
If invalid → reject entry
If valid → mark as used

## 🚀 Features

- 🔐 User Authentication (Login / Register)  
- 📅 Create and Manage Events  
- 🔍 Browse & Search Events  
- 📝 Event Details Page  
- ❤️ Save / Interested Events  
- 📱 Responsive UI (mobile-friendly)  
- ⚡ Fast and dynamic frontend with React  
- 🌐 RESTful APIs with Express & Node.js  

---

## 🛠️ Tech Stack

### Frontend
- React.js  
- CSS / Tailwind / Module CSS  
- Axios (API calls)  

### Backend
- Node.js  
- Express.js  

### Database
- MongoDB (Mongoose)  

---
## 📁 Project Structure

```bash
EventScout/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── README.md
└── .gitignore
```
## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/smritikc/EventScout.git

Install dependencies
Backend
cd backend
npm install
Frontend
cd ../frontend
npm install

Environment Variables

Create a .env file inside the backend folder and add:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Run the project
Start Backend
cd backend
npm start
Start Frontend
cd frontend
npm start

Future Improvements
🔔 Event notifications
💳 Payment integration
🗺️ Map integration for event locations
📊 Admin dashboard
🧠 AI-based event recommendations

Contributing

Contributions are welcome!

1. Fork the repository  
2. Create your feature branch (git checkout -b feature-name)  
3. Commit changes (git commit -m "Add feature")  
4. Push to branch (git push origin feature-name)  
5. Open a Pull Request  



