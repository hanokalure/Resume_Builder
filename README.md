# ATS-Friendly Resume Builder

A modern, high-performance React application designed to help users create Applicant Tracking System (ATS) friendly resumes. Features secure authentication, persistent cloud profiles, a real-time split-screen editor, and instant PDF export.

[Resume Builder Preview](https://resume-builder-beta-blond.vercel.app/)

## 🚀 Key Features

-   **Secure Authentication**: Full Sign Up and Log In functionality using Supabase.
-   **Cloud Profiles**: Save your master resume data (Basic Info, Education, Experience, Projects, Skills, Certifications) securely in a cloud database.
-   **"Add from Profile" Workflow**: Build targeted resumes in seconds by pulling specific experiences and skills directly from your saved master profile.
-   **Real-Time Preview**: See changes instantly as you type.
-   **ATS-Optimized Layout**: Clean, single-column layout with standard fonts (Arial/Helvetica) and proper hierarchy to ensure high parseability by ATS software.
-   **Split-Screen Interface**: Dedicated Editor panel on the left and Live Preview on the right (with mobile-friendly responsive views).
-   **Smart Role Filtering**: Auto-selects relevant skills and projects based on the selected role (Frontend, Backend, Full Stack).
-   **PDF Export**: One-click high-quality A4 PDF generation via `html2pdf.js`.

## 🛠️ Tech Stack

-   **Frontend Core**: [React 19](https://react.dev/) (Hooks, Context API, React Router)
-   **Backend & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, Authentication)
-   **Build Tool**: [Vite](https://vitejs.dev/) (Fast Hot Module Replacement)
-   **Styling**: Pure CSS (Variables, Flexbox, Grid, Glassmorphism UI)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **PDF Generation**: [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/)

## 📂 Project Structure

```
src/
├── components/
│   ├── layout/          # Main containers (FormPanel, PreviewPanel)
│   ├── resume/          # Resume Template (The printable view)
│   ├── selections/      # Editor forms (BasicInfo, Education, etc.)
│   ├── Auth.jsx         # Login/Signup screens
│   ├── Profile.jsx      # Master profile management dashboard
│   ├── Builder.jsx      # The main resume builder interface
│   └── ProtectedRoute.jsx # Auth guards
├── context/
│   ├── AuthContext.jsx  # Supabase authentication state
│   └── ResumeContext.jsx # Global Resume Builder State 
├── styles/
│   ├── layout.css       # App-wide layout and editor styles
│   ├── resume.css       # Print-specific styles for the resume
│   ├── Auth.css         # Styling for the login screens
│   └── Profile.css      # Styling for the profile dashboard
├── utils/
│   └── exportPDF.js     # PDF generation logic
├── supabaseClient.js    # Database connection setup
└── App.jsx              # Main entry point & Routing
```

## ⚡ Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/hanokalure/Resume_Builder.git
    cd resume-builder
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.

## 🎨 Design Philosophy

-   **"Content First"**: The UI prioritizes data entry and readability.
-   **Zero Bloat**: Minimum dependencies. No heavy UI frameworks (like MUI or Bootstrap) were used—everything is custom-styled for speed and control.
-   **Security & Persistence**: User data is strictly tied to their authenticated sessions via Row Level Security (RLS) in Supabase.

## 📄 License

MIT License.
