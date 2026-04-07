# 🎓 Gradify - AI-Powered Learning Platform

An intelligent learning platform that combines personalized learning paths, AI-driven concept explanations, smart study planning, and comprehensive grade tracking. Designed for students and educators to enhance academic performance through data-driven insights and adaptive learning.

![Next.js](https://img.shields.io/badge/Next.js-16.2.0-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue?logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange?logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-Latest-38B2AC?logo=tailwind-css)

---

## ✨ Features

### 🎯 For Students
- **Personalized Learning Paths** - AI-generated custom learning paths based on skill level and learning style
- **Concept Simplifier** - AI-powered chatbot that breaks down complex topics into easy-to-understand explanations
- **Smart Quizzes** - Adaptive assessments that adjust difficulty based on performance
- **Study Planner** - Intelligent scheduling system with exam preparation timelines
- **Grade Tracking** - Comprehensive performance analytics with subject-wise insights
- **Leaderboard** - Competitive rankings by subject with achievement tracking
- **Learning Dashboard** - Real-time progress visualization and milestone tracking
- **Forum** - Class-based discussion forum for peer collaboration

### 👨‍🏫 For Faculty/Teachers
- **Class Management** - Create and manage multiple classes across departments
- **Assignment Management** - Create, distribute, and track student assignments
- **Quiz Builder** - Create custom quizzes with multiple question types
- **Grade Management** - Manage and track student grades with detailed analytics
- **Student Analytics** - Monitor class performance trends and individual progress
- **Submission Tracking** - View and grade student submissions with feedback

### 🔒 Security & Access Control
- Separate authentication flows for students and faculty
- Role-based access control (RBAC)
- Firebase Authentication integration
- Secure API routes with error handling

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16.2.0, React 19, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui components
- **Backend:** Next.js API Routes
- **Database:** Firebase Firestore
- **Authentication:** Firebase Authentication  
- **AI:** Google Generative AI (Gemini 1.5-flash)
- **Notifications:** Sonner Toast
- **State Management:** React Hooks
- **Build Tool:** Turbopack

---

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or pnpm
- Firebase account and project setup
- Google Generative AI API key

---

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/Aafreen-Khan7/AI-Learning-Path.git
cd AI-Learning-Path
```

### 2. Install dependencies
```bash
npm install
# or
pnpm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory:

```env
# Firebase Configuration (Public values - safe to expose)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Gemini API Key (Server-side only)
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run the development server
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
AI-Learning-Path/
├── app/
│   ├── auth/                          # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   └── faculty/                   # Faculty-specific auth
│   │       ├── login/
│   │       └── signup/
│   ├── api/                           # API routes
│   │   ├── path-generation/
│   │   ├── concept-simplifier/
│   │   ├── study-plan/
│   │   ├── affinity-quiz/
│   │   ├── leaderboard/
│   │   ├── teacher/
│   │   └── ...
│   ├── learn/                         # Student learning pages
│   │   ├── paths/
│   │   ├── planner/
│   │   ├── simplifier/
│   │   ├── leaderboard/
│   │   └── forum/
│   ├── student/                       # Student dashboard
│   │   ├── page.tsx
│   │   ├── grades/
│   │   └── assignments/
│   ├── teacher/                       # Teacher dashboard
│   │   ├── page.tsx
│   │   └── classes/
│   ├── dashboard/                     # Admin/class dashboard
│   │   ├── grades/
│   │   ├── assignments/
│   │   └── submissions/
│   └── page.tsx                       # Landing page
├── components/
│   ├── ui/                            # shadcn/ui components
│   ├── dashboard/
│   ├── student/
│   └── theme-provider.tsx
├── context/
│   └── AuthContext.tsx                # Global auth context
├── hooks/
│   ├── use-mobile.ts
│   └── use-toast.ts
├── lib/
│   ├── firebase.ts                    # Firebase configuration
│   ├── firebase-auth.ts               # Auth utilities
│   ├── gemini-utils.ts                # Gemini API wrapper
│   ├── teacher-db.ts                  # Teacher database helpers
│   ├── social-db.ts                   # Social features DB
│   ├── enhanced-features-db.ts        # Enhanced features helpers
│   └── utils.ts                       # Utility functions
├── public/                            # Static assets
├── styles/
│   └── globals.css                    # Global styles
├── package.json
├── next.config.mjs
├── tsconfig.json
├── tailwind.config.ts
└── postcss.config.mjs
```

---

## 🗺️ Key Routes

### Student Routes
| Route | Description |
|-------|-------------|
| `/auth/login` | Student login page |
| `/auth/signup` | Student registration |
| `/student` | Student dashboard with assignments |
| `/student/grades` | View grades and performance |
| `/student/assignments/[id]/submit` | Submit assignment |
| `/learn` | Learning hub |
| `/learn/paths` | Available learning paths |
| `/learn/paths/[id]` | Individual learning path |
| `/learn/simplifier` | AI concept simplifier |
| `/learn/planner` | Study planner |
| `/learn/leaderboard` | Rankings and achievements |
| `/learn/forum/[classId]` | Class forum |

### Faculty Routes
| Route | Description |
|-------|-------------|
| `/auth/faculty/login` | Faculty login |
| `/auth/faculty/signup` | Faculty registration |
| `/teacher` | Teacher dashboard |
| `/teacher/classes` | Manage classes |
| `/teacher/classes/[id]` | Class details and management |
| `/dashboard` | Admin dashboard |
| `/dashboard/grades` | Grade management |
| `/dashboard/assignments` | Assignment management |
| `/dashboard/submissions` | Student submissions |

---

## 🔌 API Endpoints

### Learning & Content
- `POST /api/path-generation` - Generate personalized learning paths
- `POST /api/concept-simplifier` - Get AI explanations for concepts
- `POST /api/study-plan` - Generate study schedules
- `POST /api/affinity-quiz` - Interactive affinity assessment

### Data & Analytics
- `GET /api/leaderboard` - Get subject rankings
- `GET /api/recommendations` - Get personalized recommendations
- `GET /api/teacher/analytics` - Teacher performance analytics
- `GET /api/tokens` - Token usage information

### Management
- `GET/POST /api/teacher/classes` - Class management
- `GET/POST /api/forum/posts` - Forum posts
- `POST /api/forum/replies` - Forum replies
- `GET /api/gemini-health` - API health check

---

## 🎓 Firestore Collections

### `users`
Student profiles with personal and academic information.
```typescript
{
  uid: string;
  name: string;
  email: string;
  qualification: string;
  branch: string;
  year: number;
  semester: number;
  subjects: string[];
  createdAt: timestamp;
}
```

### `faculty`
Faculty/teacher profiles with professional details.
```typescript
{
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  specialization: string;
  experience: string;
  institutionType: string;
  institutionName: string;
  subjectsTaught: string[];
  userType: "faculty";
  createdAt: timestamp;
}
```

### `learningPaths`
Generated learning path data.
```typescript
{
  userId: string;
  subject: string;
  profile: "foundation" | "balanced" | "accelerated";
  modules: Module[];
  progress: number;
  createdAt: timestamp;
}
```

### `topicAttempts`
Track user attempts on quiz topics.

### `subjectProgress`
Subject-wise progress tracking.

### `classes`
Class information managed by teachers.

### `assignments`
Assignments created by teachers.

### `submissions`
Student assignment submissions.

---

## 🚀 Getting Started

### For Students
1. Sign up at `/auth/signup`
2. Complete your profile (qualification, branch, subjects)
3. Take the affinity quiz to get personalized paths
4. Start learning through customized paths
5. Track your progress in the dashboard

### For Faculty
1. Sign up at `/auth/faculty/signup`
2. Complete professional information
3. Select subjects you teach
4. Create classes and assignments
5. Manage student submissions and grades

---

## 🤖 AI Features

### Concept Simplifier
Leverages Google Gemini to break down complex topics into easy-to-understand explanations with:
- Real-world analogies
- Step-by-step breakdowns
- Key concepts highlighting
- Practice questions

### Personalized Learning Paths
AI-generated learning paths that:
- Assess your current knowledge level
- Adapt to your learning pace
- Recommend relevant topics
- Track your progress

### Smart Study Planning
Intelligent scheduling that:
- Creates exam preparation timelines
- Allocates time based on subject difficulty
- Suggests optimal study sessions
- Sends reminders and notifications

---

## 🔄 Retry Logic & Resilience

The platform includes robust error handling with:
- **Exponential Backoff Retry** - 3 attempts with delays (1s → 2s → 4s)
- **Fallback Mechanisms** - Graceful degradation when APIs are unavailable
- **Comprehensive Error Messages** - Helps users understand what went wrong
- **Network Error Distinction** - Differentiates between auth, quota, and network errors

---

## 📊 Build Statistics

- **Total Routes:** 41+ pages
- **API Endpoints:** 14+ routes
- **Components:** 40+ reusable UI components
- **Firestore Collections:** 8+ collections
- **Build Time:** ~16-23 seconds
- **TypeScript Coverage:** Full project typed

---

## 🔐 Security Features

- ✅ Firebase Auth with email/password
- ✅ Role-based access control (Student/Faculty)
- ✅ Protected API routes
- ✅ Environment variable protection
- ✅ Secure token management
- ✅ XSS protection with React
- ✅ CSRF protection built-in

---

## 📝 Contributing

Contributions are welcome! To contribute:

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

Please follow the existing code style and ensure all tests pass.

---

## 🐛 Troubleshooting

### Gemini API 403 Error
**Solution:** Ensure `GEMINI_API_KEY` is set correctly in `.env.local` (not `NEXT_PUBLIC_GEMINI_API_KEY`)

### Build Compilation Errors
**Solution:** Clear the `.next` directory and rebuild:
```bash
rm -rf .next
npm run build
```

### Firebase Connection Issues
**Solution:** Verify Firebase configuration in `lib/firebase.ts` and check .env.local values

### Port Already in Use
**Solution:** Kill the process on port 3000:
```bash
npm run dev -- -p 3001  # Use different port
```

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Support & Contact

For issues, feature requests, or questions:
- Open an issue on GitHub
- Contact the development team
- Check the documentation

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- AI powered by [Google Generative AI](https://ai.google.dev/)
- Hosted on [Firebase](https://firebase.google.com/)

---

## 📈 Future Roadmap

- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Parent portal
- [ ] Video course support
- [ ] Integration with LMS systems
- [ ] Offline mode support
- [ ] Progressive Web App (PWA)
- [ ] Multi-language support
- [ ] Advanced assessment tools

---

**Last Updated:** April 2026  
**Version:** 1.0.0  
**Status:** Active Development