# Direct Moutamadris - Complete Student Portal

A comprehensive Next.js web application that provides access to all MoutaMadris platform functions. This app allows students and parents to access grades, attendance, schedules, announcements, homework, and student information through a modern, user-friendly interface.

## 🌟 Features

### ✅ Currently Implemented Functions

- **Student Information** - View personal details, establishment info, and academic level
- **Academic Grades** - Access detailed grade reports with:
  - Continuous assessment scores (contrôles continus)
  - Exam results with coefficients
  - Class averages and comparisons
  - Interactive radar charts for visualization
  - CSV export functionality
- **Attendance Tracking** - Monitor absence records with justified/unjustified status
- **Class Schedule** - View weekly timetable with teachers and room assignments
- **School Announcements** - Stay updated with official communications
- **Homework & Assignments** - Track assignments with due dates and completion status

### 🔧 Technical Features

- **Authentication System** - Secure login with MoutaMadris credentials
- **Tabbed Interface** - Easy navigation between different functions
- **Responsive Design** - Works on desktop and mobile devices
- **Error Handling** - Clear error messages and loading states
- **Data Parsing** - Intelligent parsing of HTML responses from MoutaMadris
- **Material-UI Components** - Modern, accessible user interface

## 📱 Screenshots

The application includes:
- Clean login interface with credential validation
- Comprehensive dashboard with 6 main sections
- Detailed grade tables with statistical analysis
- Visual charts for grade comparison
- Organized display of announcements and assignments

## 🚀 Quick Start

```bash
git clone https://github.com/Maxylium/DirectMoutamadris/
cd DirectMoutamadris
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 API Endpoints

The application includes the following API endpoints:

- `/api/fetch-grades` - Retrieve academic grades and scores
- `/api/fetch-student-info` - Get student profile information  
- `/api/fetch-attendance` - Access attendance records
- `/api/fetch-schedule` - Retrieve class timetable
- `/api/fetch-announcements` - Get school announcements
- `/api/fetch-homework` - Access homework and assignments

## 🔒 Security & Privacy

- All authentication is handled securely through the official MoutaMadris platform
- No credentials are stored - authentication is session-based
- Data is only displayed to the authenticated user
- Network requests use proper headers and CSRF protection

## 🛠️ Development

### Project Structure
```
src/
├── components/          # React components for each feature
├── utils/              # Authentication and parsing utilities  
├── types/              # TypeScript interfaces
└── app/                # Next.js app router pages

pages/api/              # API endpoints for MoutaMadris integration
```

### Key Files
- `MoutamadrisApp.tsx` - Main application with tabbed interface
- `moutamadrisAuth.ts` - Shared authentication utility
- `parseAdditionalData.ts` - HTML parsing for all data types
- `moutamadris.ts` - TypeScript type definitions

## ⚠️ Important Notes

- This application only works from Morocco due to MoutaMadris geo-restrictions
- Valid MoutaMadris credentials are required for authentication
- The app acts as a front-end client to the official MoutaMadris platform
- No data is stored locally - all information is fetched in real-time

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests to improve the application.

## 📄 License

This project is intended for educational purposes and to improve access to student information.
