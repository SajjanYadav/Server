
# 📁 File Share Server

The backend server for **FileShare**, a secure and simple platform to upload, manage, and share files via short URLs. Built with **Node.js**, **Express**, **MongoDB**, and **Cloudinary**, this API handles authentication, file uploads, URL shortening, and user file history.

---

## 🌐 Live API

> 🟢 Deployed at: [https://file-share-server-k5hr.onrender.com](https://file-share-server-k5hr.onrender.com)

Frontend: [https://file-share-delta.vercel.app](https://file-share-delta.vercel.app)

---

## 🔧 Features

- ✅ JWT-based Authentication
- ☁️ Upload files to **Cloudinary**
- 🔗 Generate and store short URLs
- 📊 Track click count for shared links
- 🧾 Retrieve file history per user
- 🧼 Input sanitization and rate limiting
- 🌐 CORS configured for Vercel frontend

---

## 🧩 Project Structure

\`\`\`
📦 server/
├── config/                # Cloudinary & MongoDB config
├── controllers/           # Core business logic
├── middleware/            # JWT, rate limit, sanitize
├── models/                # Mongoose schemas
├── repository/            # DB ops for URLs
├── routes/                # Auth & URL endpoints
├── services/              # Shorten & redirect logic
└── index.js               # Server entry point
\`\`\`

---

## ⚙️ Getting Started

### 1️⃣ Clone the repository

\`\`\`bash
git clone https://github.com/your-username/file-share-server.git
cd file-share-server
\`\`\`

### 2️⃣ Install dependencies

\`\`\`bash
npm install
\`\`\`

### 3️⃣ Setup environment variables

Create a \`.env\` file in the root and add:

\`\`\`env
PORT=4000
DATABASE_URL=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MAIL_HOST=your_email_host
MAIL_USER=your_email_user
MAIL_PASS=your_email_pass
\`\`\`

### 4️⃣ Start the server

\`\`\`bash
npm start
\`\`\`

---

## 🔐 Authentication Routes (\`/api/v1/auth\`)

| Method | Endpoint     | Description              |
|--------|--------------|--------------------------|
| POST   | \`/signup\`  | Register new user        |
| POST   | \`/login\`   | Authenticate & get token |

---

## 📁 File Routes (\`/api/v1/url\`)

| Method | Endpoint               | Description                |
|--------|------------------------|----------------------------|
| POST   | \`/file-upload\`       | Upload a file              |
| GET    | \`/getUserFiles\`      | Get user's uploaded files  |
| GET    | \`/url/:shortId\`      | Redirect to original URL   |

---

## 🔗 Sample Upload Response

\`\`\`json
{
  "success": true,
  "message": "File uploaded and URL shortened successfully",
  "updatedUser": { ... },
  "data": {
    "file": {
      "_id": "66a9f...",
      "fileName": "example.pdf",
      "url": "https://res.cloudinary.com/.../example.pdf",
      "shortUrl": "https://file-share-server-k5hr.onrender.com/api/v1/url/abc123"
    }
  }
}
\`\`\`

---

## 🌐 CORS Configuration

Server allows frontend access from:

\`\`\`
https://file-share-delta.vercel.app
\`\`\`

> ⚠️ Note: Ensure the URL **matches exactly** (no trailing slash)

---

## 🧪 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Cloudinary
- JWT (Authentication)
- Vercel + Render (Deployment)

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🙋‍♂️ Author

Made with ❤️ by [@SajjanYadav](https://github.com/SajjanYadav)
