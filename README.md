# 🎉 EventScout

EventScout is a modern **Event Management Web Application** that helps users discover, create, and manage events بسهولة.  
It is built using the **MERN Stack (MongoDB, Express, React, Node.js)** and focuses on providing a seamless experience for both event organizers and attendees.

---

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


EventScout/
│
├── frontend/ # React Frontend
│ ├── public/
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Pages (Home, Events, Login, etc.)
│ │ ├── services/ # API calls (Axios)
│ │ ├── styles/ # CSS files
│ │ ├── App.js
│ │ └── index.js
│ └── package.json
│
├── backend/ # Node.js Backend
│ ├── config/ # DB connection config
│ ├── controllers/ # Business logic
│ ├── models/ # Mongoose schemas
│ ├── routes/ # API routes
│ ├── middleware/ # Auth middleware
│ ├── server.js # Entry point
│ └── package.json
│
├── .gitignore
├── README.md
└── package.json
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


cd EventScout
## 📁 Project Structure
