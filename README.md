# 🏙️ CityReport - City Issue Reporter

A modern, production-ready web application for reporting and tracking city issues. Built with React, Vite, Tailwind CSS, and Leaflet.

## ✨ Features

### Core Features
- 🗺️ **Interactive Map View** - View all reported issues on an interactive map with color-coded markers
- 📝 **Multi-Step Issue Reporting** - Easy-to-use form with category selection, location picker, and photo upload
- 👤 **User Authentication** - Login/Register with form validation and password strength indicator
- 📊 **Issue Tracking** - Track your reported issues and view their status
- 💬 **Comments & Updates** - Add comments and receive updates from city officials
- 👍 **Support System** - Support issues to show community interest
- 🔍 **Advanced Filters** - Filter issues by category, status, and date

### Technical Features
- ⚡ Built with Vite for fast development and optimized production builds
- 🎨 Beautiful UI with Tailwind CSS and dark mode support
- 📱 Fully responsive design (mobile-first)
- 🗺️ Leaflet integration with OpenStreetMap
- 🖼️ Image compression before upload
- 📍 Geolocation support
- 🔔 Toast notifications for user feedback
- ♿ Accessibility features (ARIA labels, keyboard navigation)
- 📦 PWA-ready (manifest.json included)

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Update the values as needed (default values work for local development)

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── issues/          # Issue-related components
│   │   ├── IssueCard.jsx
│   │   ├── IssueList.jsx
│   │   ├── IssueForm.jsx
│   │   └── IssueDetails.jsx
│   ├── map/             # Map components
│   │   ├── MapView.jsx
│   │   └── LocationPicker.jsx
│   └── layout/          # Layout components
│       └── Layout.jsx
├── pages/               # Page components
│   ├── Home.jsx
│   ├── ReportIssue.jsx
│   ├── MyIssues.jsx
│   ├── IssueDetailsPage.jsx
│   ├── Login.jsx
│   └── Register.jsx
├── services/
│   └── api.js           # API service with mock data
├── context/
│   └── AuthContext.jsx  # Authentication context
├── hooks/
│   └── useGeolocation.js
├── utils/
│   └── constants.js     # Constants and helpers
├── App.jsx              # Main app component
└── main.jsx             # Entry point
```

## 🎨 Key Features

### Home Page
- Interactive map showing all issues with color-coded markers
- Toggle between map and list views
- Advanced filtering by category and status
- Responsive design optimized for mobile

### Report Issue (Multi-Step Form)
- **Step 1:** Select from 9 issue categories
- **Step 2:** Pick location on map or use GPS
- **Step 3:** Add details, upload photos, set urgency
- **Step 4:** Review and submit
- Automatic image compression
- Real-time validation

### My Issues Dashboard
- View all your reported issues
- Filter by status
- Statistics: total, open, in-progress, resolved
- Quick access to details

### Issue Details Page
- Photo carousel with thumbnails
- Status timeline showing progress
- Interactive location map
- Comments section
- Support/upvote functionality
- Share options

### Authentication
- Secure login/register
- Password strength indicator
- Form validation
- Remember me option

## 🗺️ API Integration

Currently uses mock data. To connect to a real backend:

1. Update `VITE_API_BASE_URL` in `.env`
2. Modify `src/services/api.js` to remove mock implementations

**Expected API Endpoints:**
- `GET /api/issues` - Get all issues
- `POST /api/issues` - Create new issue
- `GET /api/issues/:id` - Get issue details
- `POST /api/issues/:id/support` - Support an issue
- `POST /api/issues/:id/comments` - Add comment
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

## 🔧 Configuration

Edit `src/utils/constants.js` to customize:
- Issue categories
- Status types
- Urgency levels
- Map configuration

## 📱 Mobile & PWA

- Fully responsive mobile design
- PWA manifest included
- Installable on mobile devices
- Offline-ready architecture

## 🌙 Dark Mode

Built-in dark mode support using Tailwind CSS dark mode classes.

## 📝 License

MIT License

---

Built with ❤️ for better cities
