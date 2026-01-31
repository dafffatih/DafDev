# Product Specification Document

## Daffa Al Fatih - Portfolio Website

| Attribute       | Value                                        |
|-----------------|----------------------------------------------|
| **Project Name** | portofolio-antigravity                      |
| **Version**      | 0.1.0                                        |
| **Author**       | Daffa Al Fatih                              |
| **Last Updated** | January 2026                                |
| **Status**       | Active Development                          |

---

## 1. Executive Summary

A modern, immersive portfolio website built with Next.js 16, featuring 3D graphics, smooth animations, and a comprehensive content management system. The platform showcases professional work, skills, experience, and blog content while providing an admin dashboard for content management.

---

## 2. Product Overview

### 2.1 Purpose
To provide a professional online presence that demonstrates technical expertise, showcases projects, and enables potential clients/employers to connect with the portfolio owner.

### 2.2 Target Audience
- Potential employers and recruiters
- Clients seeking web development services
- Collaborators and fellow developers
- General visitors interested in the work

### 2.3 Core Value Proposition
- **Visual Excellence**: Premium design with 3D graphics and smooth animations
- **Content Management**: Full admin dashboard for managing all content
- **Professional Presentation**: Structured showcase of skills, projects, and experience
- **Direct Communication**: Integrated contact form with message management

---

## 3. Technology Stack

### 3.1 Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.1 | React framework with App Router |
| React | 19.2.3 | UI library |
| TypeScript | ^5 | Type safety |
| Tailwind CSS | ^4 | Utility-first styling |
| Framer Motion | ^12.25.0 | Animations |
| React Three Fiber | ^9.5.0 | 3D graphics (Three.js wrapper) |
| @react-three/drei | ^10.7.7 | 3D helpers and components |
| Lucide React | ^0.562.0 | Icon library |

### 3.2 Backend & Database
| Technology | Version | Purpose |
|------------|---------|---------|
| Prisma | ^5.22.0 | ORM for database operations |
| SQLite | - | Database (development) |
| NextAuth (Auth.js) | ^5.0.0-beta.30 | Authentication |
| bcryptjs | ^3.0.3 | Password hashing |

### 3.3 Additional Libraries
| Library | Purpose |
|---------|---------|
| next-themes | Dark/Light mode support |
| react-scroll | Smooth scrolling navigation |
| react-markdown | Blog content rendering |
| react-day-picker | Date picker component |
| date-fns | Date manipulation |

---

## 4. Features Specification

### 4.1 Public Features

#### 4.1.1 Hero Section
- Dynamic headline with owner name and title
- Subtitle: "Fullstack Developer & AI Automation"
- Animated entrance effects
- Call-to-action buttons (View Projects, Contact)
- Scroll indicator animation

#### 4.1.2 About Section
- Personal biography and introduction
- Education history with GPA display
- Achievements and awards
- Leadership and organization experience
- Community service activities

#### 4.1.3 Skills Section
- Dynamic skill categories (Frontend, Backend, Tools, etc.)
- Proficiency levels (0-100 scale)
- Icon support for each skill
- Category-based organization

#### 4.1.4 Projects Section
- Project cards with image previews
- Technology stack tags
- Demo and repository links
- Published/unpublished status control

#### 4.1.5 Experience Section
- Professional timeline display
- Position and company details
- Date ranges (with "Present" support)
- Role descriptions

#### 4.1.6 Blog Section
- Article listing with excerpts
- Cover image support
- Slug-based URLs
- Markdown content rendering
- Published/draft status

#### 4.1.7 Contact Section
- Contact form (Name, Email, Message)
- Form validation
- Success/error feedback
- Location information

### 4.2 Admin Dashboard Features

#### 4.2.1 Authentication
- Secure login with email/password
- Session management
- Protected routes via middleware
- Logout functionality

#### 4.2.2 Content Management
| Section | CRUD Operations |
|---------|-----------------|
| Projects | Create, Read, Update, Delete |
| Skills | Create, Read, Update, Delete |
| Experience | Create, Read, Update, Delete |
| Blog Posts | Create, Read, Update, Delete |
| Messages | Read, Mark as Read, Delete |

#### 4.2.3 Dashboard Overview
- Quick statistics
- Recent messages
- Content summaries

---

## 5. Database Schema

### 5.1 Entity Relationship

```
User (Authentication)
├── Account (OAuth providers)
└── Session (Active sessions)

Content Entities:
├── Project
├── Skill
├── Experience
├── Post (Blog)
└── Message (Contact form)
```

### 5.2 Data Models

#### User
| Field | Type | Description |
|-------|------|-------------|
| id | String (CUID) | Primary key |
| name | String? | Display name |
| email | String? | Unique email |
| password | String? | Hashed password |
| emailVerified | DateTime? | Email verification date |
| image | String? | Profile image URL |

#### Project
| Field | Type | Description |
|-------|------|-------------|
| id | String (CUID) | Primary key |
| title | String | Project name |
| description | String | Project details |
| imageUrl | String? | Preview image |
| demoUrl | String? | Live demo link |
| repoUrl | String? | Repository link |
| techStack | String | Technologies (JSON/CSV) |
| published | Boolean | Visibility status |

#### Skill
| Field | Type | Description |
|-------|------|-------------|
| id | String (CUID) | Primary key |
| name | String | Skill name |
| category | String | Category (Frontend, Backend, etc.) |
| icon | String? | Lucide icon name or URL |
| proficiency | Int? | Skill level (0-100) |

#### Experience
| Field | Type | Description |
|-------|------|-------------|
| id | String (CUID) | Primary key |
| position | String | Job title |
| company | String | Company name |
| startDate | DateTime | Employment start |
| endDate | DateTime? | Employment end (null = Present) |
| description | String | Role description |

#### Post (Blog)
| Field | Type | Description |
|-------|------|-------------|
| id | String (CUID) | Primary key |
| title | String | Article title |
| slug | String | URL-friendly identifier |
| content | String | Markdown content |
| excerpt | String? | Short summary |
| coverImage | String? | Header image |
| published | Boolean | Draft/Published status |

#### Message
| Field | Type | Description |
|-------|------|-------------|
| id | String (CUID) | Primary key |
| name | String | Sender name |
| email | String | Sender email |
| message | String | Message content |
| read | Boolean | Read status |

---

## 6. API Endpoints

### 6.1 Public APIs
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/contact` | POST | Submit contact form |
| `/api/posts` | GET | Fetch published posts |
| `/api/projects` | GET | Fetch published projects |
| `/api/skills` | GET | Fetch skills |
| `/api/experience` | GET | Fetch experience |

### 6.2 Protected APIs (Admin)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/*` | ALL | Admin operations |
| `/api/auth/*` | ALL | Authentication routes |
| `/api/posts/*` | POST/PUT/DELETE | Blog management |
| `/api/projects/*` | POST/PUT/DELETE | Project management |
| `/api/skills/*` | POST/PUT/DELETE | Skills management |
| `/api/experience/*` | POST/PUT/DELETE | Experience management |

---

## 7. Application Structure

```
portofolio-antigravity/
├── app/
│   ├── (public)/          # Public routes with shared layout
│   ├── admin/             # Admin dashboard routes
│   │   ├── blog/          # Blog management
│   │   ├── experience/    # Experience management
│   │   ├── messages/      # Message inbox
│   │   ├── projects/      # Project management
│   │   ├── settings/      # Admin settings
│   │   └── skills/        # Skills management
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/
│   ├── 3d/                # Three.js/R3F components
│   ├── admin/             # Admin UI components
│   ├── backgrounds/       # Background effects
│   ├── helpers/           # Utility components
│   ├── layout/            # Layout components
│   ├── providers/         # Context providers
│   ├── sections/          # Page sections
│   └── ui/                # Reusable UI components
├── lib/                   # Utility functions
├── locales/               # Internationalization (EN)
├── prisma/                # Database schema & seeds
├── public/                # Static assets
└── types/                 # TypeScript types
```

---

## 8. User Flows

### 8.1 Visitor Flow
```
Landing Page → Browse Sections (scroll) → View Projects/Blog → Contact Form
```

### 8.2 Admin Flow
```
Login → Dashboard → Manage Content (CRUD) → View Messages → Logout
```

---

## 9. Design System

### 9.1 Theming
- **Dark Mode**: Default immersive dark theme
- **Light Mode**: Clean light alternative
- **Toggle**: Theme switcher in navigation

### 9.2 Typography
- **Primary Font**: Geist Sans (Vercel)
- **Monospace**: Geist Mono
- **Anti-aliasing**: Enabled

### 9.3 Animations
- **Library**: Framer Motion
- **Effects**: Fade, slide, scale transitions
- **Viewport Triggers**: Animate on scroll into view
- **Performance**: Hardware-accelerated CSS transforms

### 9.4 3D Graphics
- **Engine**: Three.js via React Three Fiber
- **Components**: 3D Earth, lighting effects
- **Post-processing**: Visual effects layer

---

## 10. SEO & Performance

### 10.1 SEO Features
- Dynamic metadata per page
- `robots.ts` for crawler configuration
- `sitemap.ts` for search engine indexing
- Semantic HTML structure

### 10.2 Performance Optimizations
- Next.js Image optimization
- Font optimization via `next/font`
- Code splitting (App Router)
- Static generation where possible

---

## 11. Security

### 11.1 Authentication
- Password hashing with bcryptjs
- JWT-based sessions (NextAuth)
- CSRF protection
- Secure cookie handling

### 11.2 Authorization
- Middleware-based route protection
- API route validation
- Admin-only endpoints

### 11.3 Data Validation
- Input sanitization on forms
- Type validation via TypeScript
- Prisma query safety

---

## 12. Development Setup

### 12.1 Prerequisites
- Node.js (v18+)
- npm or yarn

### 12.2 Installation
```bash
# Clone repository
git clone <repository-url>

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Seed database (optional)
npx prisma db seed

# Start development server
npm run dev
```

### 12.3 Environment Variables
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="<your-secret>"
NEXTAUTH_URL="http://localhost:3000"
```

---

## 13. Future Enhancements

### 13.1 Planned Features
- [ ] Multi-language support (ID, EN)
- [ ] Analytics integration
- [ ] Resume/CV download
- [ ] Social media integration
- [ ] Comment system for blog
- [ ] Newsletter subscription

### 13.2 Technical Improvements
- [ ] PostgreSQL for production
- [ ] Image upload to cloud storage
- [ ] Email notifications
- [ ] PWA support
- [ ] Performance monitoring

---

## 14. Version History

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | Jan 2026 | Initial release with core features |

---

*Document generated for portofolio-antigravity project*
