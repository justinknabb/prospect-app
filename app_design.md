# Rain Gutter Supply Prospect Management App - Design Document

## Overview
This document outlines the design for an interactive web application to manage prospects for a rain gutter supply business. The app will allow the user to track prospects across different categories, manage sales interactions, and organize follow-up activities.

## User Requirements
- Organize prospects by category (Distributors, Contractors, Roofers, Gutter Installers, Competitors)
- Ability to easily change a prospect's category
- Track calls with timestamps
- Add and view call notes
- Set and track follow-up steps
- View customized sales scripts for each category

## Technology Stack
- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **Database**: Cloudflare D1 (SQLite)
- **Deployment**: Cloudflare Pages

## Database Schema

### Prospects Table
```sql
CREATE TABLE prospects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Calls Table
```sql
CREATE TABLE calls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  prospect_id INTEGER NOT NULL,
  call_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  outcome TEXT,
  follow_up_date TIMESTAMP,
  follow_up_notes TEXT,
  completed BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (prospect_id) REFERENCES prospects (id)
);
```

### Categories Table
```sql
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  sales_script TEXT
);
```

## UI Design

### Main Dashboard
- Navigation sidebar with links to:
  - Dashboard (Home)
  - Prospects
  - Call Log
  - Sales Scripts
  - Settings
- Overview statistics:
  - Total prospects by category (pie chart)
  - Recent calls (last 7 days)
  - Upcoming follow-ups
  - Quick action buttons (Add Prospect, Log Call)

### Prospects Page
- Filterable, sortable table of all prospects
- Columns:
  - Name
  - Category (dropdown for easy changing)
  - Location
  - Contact Info
  - Last Contact
  - Next Follow-up
  - Actions (View, Edit, Delete)
- Search functionality
- Add New Prospect button
- Export to CSV option

### Prospect Detail View
- Contact information section
- Category with dropdown to change
- Notes section
- Call history section with timestamps
- Follow-up section with date picker and status
- Quick access to relevant sales script
- Edit and Delete buttons

### Call Logging Interface
- Prospect selector
- Date and time (auto-filled with current time)
- Call notes text area
- Call outcome dropdown
- Follow-up scheduler with date picker
- Follow-up notes

### Sales Scripts Page
- Tabs for each category
- Full script text with sections:
  - Opening
  - Value Proposition
  - Pain Points Addressed
  - Specific Offer
  - Call to Action
- Option to view script while on a call

### Settings Page
- User profile settings
- Notification preferences
- Category management (add/edit/delete)
- Data import/export options

## Mobile Responsiveness
- Collapsible sidebar for mobile view
- Responsive tables that reformat for smaller screens
- Touch-friendly interface elements
- Simplified views for essential functions on mobile

## User Flow

1. **Login** → **Dashboard**
2. **Add Prospect** → Fill form → **Prospect Detail**
3. **View Prospect** → **Log Call** → Set follow-up → **Dashboard**
4. **Dashboard** → View upcoming follow-ups → **Prospect Detail**
5. **Sales Scripts** → Review before call → **Log Call**

## Implementation Plan
1. Set up Next.js project with Tailwind CSS
2. Create database schema and migrations
3. Implement basic CRUD operations for prospects
4. Develop UI components for all pages
5. Implement call tracking functionality
6. Add category management with dropdowns
7. Integrate sales scripts
8. Add search and filtering capabilities
9. Implement responsive design
10. Test and deploy
