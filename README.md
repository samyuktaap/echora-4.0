# VolunteerHub 🤝

A modern, comprehensive volunteering platform built with a hybrid stack of React, Supabase, and Firebase. This platform connects passionate volunteers with NGOs across India to make a real-world impact.

## 🌟 Key Features

### For Volunteers
- **Smart Profiles:** Create a detailed profile with your skills, languages, and location.
- **AI Matching Engine:** Get personalized task recommendations based on your unique skill set and location.
- **Gamification:** Earn points, unlock badges (like "Star Volunteer" and "Mentor"), and climb the all-India leaderboard.
- **Task Notes & Feedback:** Rate your volunteering experiences and share notes to help the community.
- **Interactive Map:** Explore live volunteer and NGO task locations on a dynamic heatmap covering all 28 states of India.

### For NGOs
- **Easy Request Submission:** Post detailed volunteer requests with required skills, urgency levels, and location.
- **Urgency Highlighting:** Mark tasks as High, Medium, or Low urgency to attract immediate help.
- **Targeted Reach:** Your requests are automatically matched with volunteers who have the right skills and are nearby.

### Global Features
- **Conversational AI Assistant (VolBot):** A smart chatbot that understands abbreviations, answers FAQs, and provides context-aware help based on your profile.
- **Impact Dashboard:** Real-time statistics, charts (using Recharts), and visualizations of platform growth and skill distribution.
- **Weekend Meetups:** Discover and join local networking events, cleanup drives, and hackathons.
- **OTP Authentication:** Secure phone number login powered by Supabase Auth (with a fallback demo mode).
- **Responsive & Beautiful Design:** A stunning UI with a full dark/light mode toggle, glassy components, and modern typography.

## 🛠️ Technology Stack

- **Frontend:** React (Vite)
- **Styling:** Custom CSS with complete Dark/Light theme system
- **Routing:** React Router v6
- **Database & Auth:** Supabase & Firebase
- **Maps:** Leaflet & React-Leaflet
- **Charts:** Recharts
- **Icons & UI:** Lucide React, Framer Motion, React Hot Toast

## 🚀 Running Locally

1. Ensure you have Node.js installed.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

*Note: The platform is currently configured to run in "Demo Mode" with mock data for instant testing without needing backend keys.*

## 🧪 Demo Login
- Enter **any 10-digit phone number**.
- Use OTP: **123456** to log in instantly.
