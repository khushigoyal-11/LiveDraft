# LiveDraft – Real-Time Collaborative Document Editor

LiveDraft is a powerful real-time collaborative document editor that allows multiple users to simultaneously work on a shared document. Designed with a modern tech stack — React.js, Node.js, Express.js, WebSocket (Socket.IO), and MongoDB — the platform delivers a fast, responsive, and synchronized editing experience.


🚀 Features

- ✍️ **Real-time Collaborative Editing**  
  Multiple users can edit the same document simultaneously with instant updates across all clients using WebSockets.

- 🧑‍🤝‍🧑 **Room-Based Collaboration**  
  Users can join or create private rooms using unique IDs. Only users in the same room can collaborate on a document.

- 💾 **Download as .txt**  
  Documents can be easily downloaded in `.txt` format using a one-click download button.

- 💡 **Error Handling & User Tracking**  
  Robust error handling and active user tracking for better session management.

- 🌐 **REST API Support**  
  Backend routes built with Express.js to create, manage, and retrieve collaborative sessions.

  🛠️ Tech Stack

| Technology | Description |
|------------|-------------|
| **Frontend** | React.js, Tailwind CSS |
| **Backend**  | Node.js, Express.js |
| **Database** | MongoDB  |
| **Real-Time** | WebSocket (Socket.IO) |
| **Version Control** | Git & GitHub |


 📁 Folder Structure

 LiveDraft/
├── client/ # React Frontend
│ ├── public/
│ └── src/
├── server/ # Node.js + Express Backend
│ └── index.js
├── README.md
├── .gitignore
└── package.json

🔧 Setup Instructions

1. Clone the Repository

   git clone https://github.com/khushigoyal-11/LiveDraft.git

   
   cd LiveDraft

2. Install Frontend & Backend Dependencies

   cd client
   npm install
   cd ../server
   npm install

3. Create .env files

   Create .env files in both client/ and server/ as per your local setup

4. Run Backend

   cd server
   npm install
   node index.js

5. Run Frontend

   cd client
   npm install
   npm start


