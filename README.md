# ATS-Friendly Resume Builder

A modern, high-performance React application designed to help users create Applicant Tracking System (ATS) friendly resumes. Features a real-time split-screen editor, instant PDF export, and local data persistence.

![Resume Builder Preview](https://resume-builder-beta-blond.vercel.app/)

## 🚀 Features

-   **Real-Time Preview**: See changes instantly as you type.
-   **ATS-Optimized Layout**: Clean, single-column layout with standard fonts (Arial/Helvetica) and proper hierarchy to ensure high parseability by ATS software.
-   **Split-Screen Interface**: dedicated Editor panel on the left and Live Preview on the right.
-   **Smart Role Filtering**: Auto-selects relevant skills and projects based on the selected role (Frontend, Backend, Full Stack).
-   **Comprehensive Sections**:
    -   Basic Info (with custom link text support)
    -   Professional Summary
    -   Education (Support for CGPA and Percentage)
    -   Skills (Master list with "Trash" functionality)
    -   Experience (Add, Edit, Delete support)
    -   Projects (Tag-based filtering)
    -   Certifications (With clickable link support)
-   **Local Storage Persistence**: Never lose your work; data is saved automatically to your browser.
-   **PDF Export**: One-click high-quality A4 PDF generation.
-   **Data Management**:
    -   **Reset**: clear all data to start fresh.
    -   **Demo Data**: Populate the entire resume with one click to see capabilities.

## 🛠️ Tech Stack

-   **Core**: [React](https://reactjs.org/) (Hooks, Context API, useReducer)
-   **Build Tool**: [Vite](https://vitejs.dev/) (Fast Hot Module Replacement)
-   **Styling**: Pure CSS (Variables, Flexbox, Grid) for a custom, lightweight design system.
-   **PDF Generation**: [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/)
-   **Icons**: Inline SVGs (No heavy active icon librarires).
-   **State Management**: React Context API + useReducer for complex state logic (Master vs Selected lists).

## 📂 Project Structure

```
src/
├── components/
│   ├── layout/          # Main containers (FormPanel, PreviewPanel)
│   ├── resume/          # Resume Template (The printable view)
│   └── selections/      # Editor forms (BasicInfo, Education, etc.)
├── context/
│   └── ResumeContext.jsx # Global State (Actions: ADD, UPDATE, DELETE, FILTER)
├── styles/
│   ├── layout.css       # App-wide layout and editor styles
│   └── resume.css       # Print-specific styles for the resume
├── utils/
│   └── exportPDF.js     # PDF generation logic
└── App.jsx              # Main entry point
```

## ⚡ Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/resume-builder.git
    cd resume-builder
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.

4.  **Build for Production**
    ```bash
    npm run build
    ```

## 🎨 Design Philosophy

-   **"Content First"**: The UI prioritizes data entry and readability.
-   **Zero Bloat**: Minimum dependencies. No heavy UI frameworks (like MUI or Bootstrap) were used—everything is custom-styled for speed and control.
-   **User Control**: Users can edit every list item, toggle visibility, and customize link text.

## 📄 License

MIT License.
