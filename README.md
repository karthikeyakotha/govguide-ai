# GovGuide (BragBoard) 🇮🇳
### *Bridging the Gap Between Citizens and Government Schemes*

---

## 1. Introduction 👋
**GovGuide** is an intelligent, AI-powered platform designed to simplify the discovery and understanding of Indian government schemes.
Our mission is to empower every citizen—regardless of literacy or tech-savviness—to access the benefits they are entitled to.

> *"Governance at your fingertips."*

---

## 2. Problem Statement ❓
Accessing government schemes in India is often challenging due to:
*   **Information Overload**: Thousands of schemes scattered across multiple portals.
*   **Complex Eligibility**: Legal jargon makes it hard for common people to understand if they qualify.
*   **Language Barriers**: Most information is in English, while beneficiaries often speak regional languages.
*   **Lack of Guidance**: Citizens don't know *how* to apply or what documents are needed.

---

## 3. The Solution 💡
**GovGuide** acts as a unified, conversational interface for all government welfare programs.
*   **AI Chatbot**: Ask questions in natural language (English/Hindi/etc.) and get instant, accurate answers.
*   **Personalized**: Filters schemes based on your profile (State, District, Category).
*   **Action-Oriented**: Provides direct links, document checklists, and application guides.

---

## 4. Key Features 🚀

### 🧠 AI-Powered Scheme Search (RAG)
*   **Context-Aware**: Uses Retrieval-Augmented Generation (RAG) to fetch real data from our verified database.
*   **Conversational**: "What schemes are there for farmers in Andhra Pradesh?" vs just keyword search.

### 🎙️ Voice Input Support
*   **Speak Your Query**: Integrated microphone support allows users to ask questions verbally.
*   **Accessibility**: Crucial for rural users or those with lower literacy levels.

### 📊 Dynamic Dashboard & Browser
*   **Schemes Repository**: A browsable list of all schemes with rich filtering (Category, State, Beneficiary Type).
*   **Deep Dive View**: Detailed breakdown of Benefits, Eligibility, and Documents for each scheme.

### 🔐 Secure & Smart Accounts
*   **Localized Signup**: Users select their **State** and **District** during registration to get hyper-local recommendations.
*   **History & Bookmarks**: Save schemes for later or review your past conversation history.

### 🎨 Modern & Accessible UI
*   **Dark Mode**: Fully supported globally for comfortable usage at any time of day.
*   **Responsive**: Works seamlessly on desktops and tablets.

---

## 5. Technology Stack 🛠️

| Component | Technology | Usage |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | Fast, interactive UI |
| **Styling** | Tailwind CSS v4 | Modern, responsive design system |
| **Backend/DB** | Supabase | Postgres database & Auth management |
| **AI Logic** | OpenAI API | Natural Language Processing & text generation |
| **Icons** | Lucide React | Clean, consistent visual assets |
| **Language** | TypeScript | Strongly typed, reliable code |

---

## 6. Project Structure 📂
The project is organized into two main directories:

*   **`frontend/`**: Contains the React application (UI, components, pages).
*   **`backend/`**: Contains scripts for data ingestion, database management, and RAG logic.

---

## 7. Getting Started 🏁

Follow these steps to set up the project locally.

### Prerequisites
*   **Node.js** (v18 or higher)
*   **npm** (comes with Node.js)
*   **Git**

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd codestrom
```

#### 2. Frontend Setup
Navigate to the frontend directory, install dependencies, and start the development server.

```bash
cd frontend
npm install
```

**Environment Variables (.env)**
Create a `.env` file in the `frontend` directory with the following keys:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GITHUB_TOKEN=your_github_token_for_openai_api
VITE_GITHUB_TOKEN_BACKUP=optional_backup_token
```

**Run the Frontend**
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

#### 3. Backend (Scripts) Setup
Navigate to the backend directory and install dependencies.

```bash
cd ../backend
npm install
```

**Environment Variables (.env)**
Create a `.env` file in the `backend` directory (should be same as frontend):
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GITHUB_TOKEN=your_github_token_for_openai_api
```

**Available Backend Scripts**
*   **Ingest Data (PDFs to Vector DB)**:
    ```bash
    npm run ingest
    ```
    *Make sure to place PDF files in `backend/public` (or adjust script path) before running.*

*   **Manage Database**:
    ```bash
    npm run manage-db
    ```

*   **Test Imports**:
    ```bash
    npm run test-import
    ```

---

## 8. Usage Guide 📖

1.  **Sign Up/Login**: Create an account specifying your State and District.
2.  **Home Page**: View recommended schemes based on your profile.
3.  **Chat**: Click the chat icon to ask questions (e.g., "How do I apply for PM Kisan scheme?").
    *   Use the **Microphone** button to speak your query.
4.  **Browse Schemes**: Use the "Schemes" tab to filter and search through the entire database.
5.  **Profile**: Manage your saved schemes and settings.

---

## 9. Future Scope 🔮
*   **Multilingual Voice Output**: The bot will *speak* back the answers in regional languages.
*   **WhatsApp Integration**: Bringing GovGuide to the most popular messaging app in India.
*   **Direct Application**: API integration with government portals to auto-fill forms.
*   **Offline Mode**: SMS-based queries for areas with poor internet connectivity.

---

### *Made for the <CodeStorm/> Hackathon*
