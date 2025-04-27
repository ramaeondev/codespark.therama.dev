🛠️ Online JS & Python Code Runner

This project is a full-stack online code editor and compiler for JavaScript, TypeScript, and Python.

It allows users to:

Write code in a web editor.
Execute JavaScript and Python securely.
View program Output and Console Logs separately.
See live linting for JavaScript and TypeScript (Monaco Editor).
✨ Tech Stack


Layer	Technology
Frontend	Angular 17 + Monaco Editor
Backend	FastAPI (Python 3.11)
Containerization	Docker
Future	Supabase (for user code storage, authentication, etc.)
🖼️ Application Layout

Code Editor (Monaco)
Run Button
Language Selector (JS / Python)
Output Area:
Top half: Program Output
Bottom half: Console Logs
🏗️ Project Structure

frontend/    --> Angular app
  └── src/
      └── app/
          ├── components/
          │    ├── code-editor/
          │    ├── run-button/
          │    ├── language-selector/
          │    └── result/
          └── services/
              └── code-execution.service.ts

backend/     --> FastAPI server (Python)
  └── main.py

docker-compose.yml --> To run backend with Docker
README.md
⚡ Local Development Setup

1. Clone the repo
git clone https://github.com/yourusername/online-js-python-runner.git
cd online-js-python-runner
2. Start the Backend (Python FastAPI + Docker)
cd backend
docker build -t code-runner-backend .
docker run -p 8000:8000 code-runner-backend
or using docker-compose:

docker-compose up --build
The backend will start at:

http://localhost:8000
3. Start the Frontend (Angular)
cd frontend
npm install
npm start
The frontend will start at:

http://localhost:4200
🚀 Deployment

Backend Deployment Options
Fly.io
Render.com
AWS EC2 (Docker)
The backend must be exposed publicly so the Angular app can access /run-python API.

Frontend Deployment Options
GitHub Pages
Vercel
AWS S3 + CloudFront
Netlify
🛡️ Security Considerations

Python code execution is sandboxed inside Docker with timeout (5s max).
JavaScript code runs in-browser (user side only).
Future improvements: memory limits, CPU limits, syscall restrictions (gVisor / Firecracker).
📋 TODO / Roadmap

 Split Output page horizontally
 Support JS + Python code execution
 Capture console logs separately
 Add TypeScript linting (live)
 Save user code to Supabase
 Add support for C++ and Java
 Deploy backend using Fly.io
 Add authentication (optional)
 Add code sharing (copy link feature)
👨‍💻 Author

GitHub: @ramaeon
Twitter: @ramaeon
📸 Preview Screenshot

(Insert a nice screenshot of the split output view here!)

License

This project is licensed under the MIT License — feel free to use, modify, and share.

✨ Final Note

Built for developers, students, and creators.
Run your code, learn new languages, and explore programming from your browser 🚀