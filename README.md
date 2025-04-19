# 🚀 AIVortex

**AIVortex** is a web application that uses powerful AI models to evaluate culture fit for candidates. It integrates with LinkedIn and Typeform to fetch data and delivers PDF reports summarizing evaluations. Built for recruiters, hiring managers, and HR professionals, AIVortex helps streamline the hiring process with an intuitive workflow builder.

---

## 🌟 Features

- 🔍 **AI-Powered Culture Fit Evaluation**  
  Uses **Gemini 2.0 Flash Thinking Experimental** and **DeepSeek R1** AI models to assess candidate attributes like teamwork and reliability.

- 🔗 **LinkedIn Integration**  
  Fetch candidate data directly from LinkedIn using the **Relevance API**.

- 📝 **Typeform Integration**  
  Analyze Typeform survey responses as part of the evaluation process.

- 📄 **PDF Report Generation**  
  Download culture fit evaluations as professionally formatted PDF reports.

- 🧩 **Custom Workflow Builder**  
  Build tailored workflows with nodes like `AskAINode`, `CultureFitNode`, and `PDFNode`.

- ⚡ **Fast and Scalable**  
  Backend powered by **FastAPI** (Dockerized), deployed on **AWS EC2**.  
  Frontend built with **React + TypeScript**, hosted on **Vercel**.

---

## 🧰 Tech Stack

| Layer        | Tech                                                                 |
|--------------|----------------------------------------------------------------------|
| **Frontend** | React, TypeScript, Vite                                              |
| **Backend**  | FastAPI, Python, Docker                                              |
| **Deployment** | Frontend: Vercel <br> Backend: AWS EC2                              |
| **AI Models** | Gemini 2.0 Flash Thinking Experimental <br> DeepSeek R1 (upgradeable to V3) |
| **Integrations** | LinkedIn (Relevance API), Typeform (Typeform API)               |

---

## 🚀 Live URLs

- 🌐 **Frontend**: [https://app.aievaluate.xyz](https://app.aievaluate.xyz)  
- 🔗 **API**: [https://api.aievaluate.xyz](https://api.aievaluate.xyz)

---

## 🛠️ Getting Started

### 🔐 Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16.x or later)  
- [Python](https://www.python.org/) (v3.9 or later)  
- [Docker](https://www.docker.com/)  
- [Git](https://git-scm.com/)  

### 🔑 Required API Keys

- Gemini API Key  
- DeepSeek API Key  
- Relevance API Token and Project ID  
- Typeform API Key  

---

## 📦 Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/ChaitanyaKiran14/AIvortex.git
cd AIvortex
```

---

### 2️⃣ Set Up the Frontend

```bash
cd AIVortex
npm install
```

Start the development server:

```bash
npm run dev
```

> The frontend will be available at **http://localhost:5173**

---

### 3️⃣ Set Up the Backend

```bash
cd ../Backend
python -m venv venv
source venv/bin/activate  # Use `venv\Scripts\activate` on Windows
pip install -r requirements.txt
```

Create a `.env` file in the `Backend` directory:

```env
GEMINI_API_KEY=<your-gemini-api-key>
GEMINI_FLASH_THINKING_KEY=<your-gemini-flash-thinking-key>
DEEPSEEK_API_KEY=<your-deepseek-api-key>
TYPEFORM_API_KEY=<your-typeform-api-key>
RELEVANCE_API_TOKEN=<your-relevance-api-token>
RELEVANCE_PROJECT_ID=<your-relevance-project-id>
```

Run the backend server:

```bash
uvicorn app.main:app --reload
```

> The backend will be available at **http://localhost:8000**


## 🧩 Workflow Nodes

- `AskAINode` – Ask an AI model a question.  
- `CultureFitNode` – Evaluate culture fit from LinkedIn and Typeform data.  
- `PDFNode` – Generate a PDF report from AI results.  


## 🙌 Contributing

PRs are welcome!  
For major changes, please open an issue first to discuss what you'd like to change.

---

## 📫 Contact

- [LinkedIn – Chaitanya Kiran](https://www.linkedin.com/in/chaitanya-kiran-624113225/)  
- [X (Twitter) – @Chaitan48960042](https://x.com/Chaitan48960042)
