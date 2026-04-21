EventScout

EventScout is a modern Event Management Web Application that helps users discover, create, and manage events بسهولة. It is built using the MERN Stack (MongoDB, Express, React, Node.js) and focuses on providing a seamless experience for both event organizers and attendees.

🚀 Features
🔐 User Authentication (Login / Register)
📅 Create and Manage Events
🔍 Browse & Search Events
📝 Event Details Page
❤️ Save / Interested Events (optional if you have)
📱 Responsive UI (mobile-friendly)
⚡ Fast and dynamic frontend with React
🌐 RESTful APIs with Express & Node.js
🛠️ Tech Stack
Frontend:
React.js
CSS / Tailwind / Module CSS (based on your project)
Axios (for API calls)
Backend:
Node.js
Express.js
Database:
MongoDB (Mongoose)
📁 Project Structure
EventScout/
│
├── frontend/        # React frontend
│   ├── components/
│   ├── pages/
│   ├── styles/
│   └── App.js
│
├── backend/         # Node.js backend
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── config/
│   └── server.js
│
├── package.json
└── README.md
⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/smritikc/EventScout.git
cd EventScout
2️⃣ Install dependencies
For backend:
cd backend
npm install
For frontend:
cd ../frontend
npm install
3️⃣ Environment Variables

Create a .env file in the backend folder and add:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
4️⃣ Run the project
Start backend:
cd backend
npm start
Start frontend:
cd frontend
npm start
🌐 API Endpoints (Example)
Method	Endpoint	Description
POST	/api/auth/register	Register user
POST	/api/auth/login	Login user
GET	/api/events	Get all events
POST	/api/events	Create event
GET	/api/events/:id	Get event by ID
PUT	/api/events/:id	Update event
DELETE	/api/events/:id	Delete event
📸 Screenshots

Add screenshots of your UI here (Home, Events page, Dashboard, etc.)

🎯 Future Improvements
🔔 Notifications for events
💳 Payment integration
🗺️ Map integration (event location)
📊 Admin dashboard
🧠 AI-based event recommendations
🤝 Contributing

Contributions are welcome!

Fork the repo
Create your branch (git checkout -b feature-name)
Commit changes (git commit -m 'Add feature')
Push (git push origin feature-name)
Open a Pull Request
