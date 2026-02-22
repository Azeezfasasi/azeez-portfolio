# Languages & Services Feature Documentation

## Overview

This feature allows you to dynamically manage and display your technical skills (languages) and services on your portfolio website. The backend is built with MongoDB and Next.js, while the frontend features a beautiful, responsive React component.

## Project Structure

### Backend

- **Model**: `src/app/server/models/LanguageServices.js`
  - MongoDB schema for storing languages and services
  - Fields: type, name, icon, description, image, order, isActive, timestamps

- **Controller**: `src/app/server/controllers/languageServicesController.js`
  - Business logic for CRUD operations
  - Functions: get, create, update, delete, reorder

- **API Route**: `src/app/api/language-services/route.js`
  - RESTful API endpoints (GET, POST, PUT, DELETE)
  - Handles database connections and error handling

### Frontend

- **Component**: `src/components/home-component/MyLanguagesServices.js`
  - Displays languages and services with beautiful animations
  - Mobile responsive grid layouts
  - Fallback data if API fails

- **Management Dashboard**: `src/app/dashboard/manage-languages-services/page.js`
  - Admin interface to manage languages and services
  - Add, edit, delete operations
  - Tab navigation for languages and services

- **API Helper**: `src/utils/language-services-api.js`
  - Utility functions for making API calls
  - Easy-to-use methods for all CRUD operations

### Seed Script

- **Script**: `seed-language-services.js`
  - Populates MongoDB with initial data
  - 6 languages and 4 services included

## Setup Instructions

### 1. Install Dependencies (if not already installed)

```bash
npm install mongoose
```

### 2. Environment Variables

Ensure your `.env.local` file contains:

```env
MONGODB_URI=your_mongodb_connection_string
```

### 3. Seed the Database

Run the seed script to populate initial data:

```bash
node seed-language-services.js
```

Output should show:

```
✅ Connected to MongoDB
✅ Cleared existing data
✅ Seeded 10 items successfully

📊 Seed Summary:
   Languages: 6
   Services: 4
   Total: 10
```

### 4. Start Your Application

```bash
npm run dev
```

## Usage

### Display Languages & Services (Homepage)

The component is already integrated. If you need to add it to another location:

```jsx
import MyLanguagesServices from "@/components/home-component/MyLanguagesServices";

export default function Page() {
  return (
    <div>
      <MyLanguagesServices />
    </div>
  );
}
```

### Management Dashboard

Navigate to `/dashboard/manage-languages-services` to:

- View all languages and services in a table
- Create new items
- Edit existing items
- Delete items
- Toggle items active/inactive

### Using the API Helper in Other Components

```jsx
import {
  getLanguages,
  getServices,
  createLanguageService,
} from "@/utils/language-services-api";

export default function MyComponent() {
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    // Get all languages
    getLanguages().then(setLanguages);

    // Or get all services
    // getServices().then(setServices);
  }, []);

  const handleAddLanguage = async () => {
    await createLanguageService({
      type: "language",
      name: "TypeScript",
      icon: "📘",
      order: 7,
      isActive: true,
    });
  };

  return <div>{/* Your component code */}</div>;
}
```

## API Endpoints

### GET /api/language-services

Fetch all languages and services.

**Query Parameters:**

- `type` (optional): 'language' or 'service'

**Example:**

```
GET /api/language-services                    # All items
GET /api/language-services?type=language      # Languages only
GET /api/language-services?type=service       # Services only
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "123abc...",
      "type": "language",
      "name": "React",
      "icon": "⚛️",
      "order": 1,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /api/language-services

Create a new language or service.

**Request Body:**

```json
{
  "type": "language",
  "name": "React",
  "icon": "⚛️",
  "description": "Optional description",
  "image": "Optional image URL",
  "order": 1,
  "isActive": true
}
```

### PUT /api/language-services

Update an existing item or reorder items.

**Update Item:**

```json
{
  "id": "123abc...",
  "name": "React",
  "icon": "⚛️",
  "isActive": true
}
```

**Reorder Items:**

```json
{
  "action": "reorder",
  "items": [{ "_id": "id1" }, { "_id": "id2" }, { "_id": "id3" }]
}
```

### DELETE /api/language-services

Delete an item.

**Request Body:**

```json
{
  "id": "123abc..."
}
```

## Data Schema

### LanguageService Model

```javascript
{
  type: 'language' | 'service',          // Required
  name: String,                           // Required
  icon: String,                           // Required (emoji, icon class, or URL)
  description: String,                    // Optional (mainly for services)
  image: String,                          // Optional (URL for service images)
  order: Number,                          // Default: 0
  isActive: Boolean,                      // Default: true
  createdAt: Date,                        // Auto-generated
  updatedAt: Date                         // Auto-generated
}
```

## Design Features

### Frontend Component

✨ **Features:**

- **Responsive Grid Layout**
  - Languages: 2 cols (mobile) → 3 cols (tablet) → 6 cols (desktop)
  - Services: 1 col (mobile) → 2 cols (tablet) → 4 cols (desktop)

- **Beautiful Animations**
  - Hover scale effect on language cards
  - Smooth color transitions
  - Service cards with image zoom and overlay effect

- **Gradient Effects**
  - Background gradient (slate to blue)
  - Linear gradient accent lines
  - Hover gradient backgrounds

- **Icon Support**
  - Emojis (⚛️, 🔴, etc.)
  - Image URLs
  - Font Awesome class names

- **Fallback Data**
  - Default languages and services if API fails
  - Graceful error handling

### Dashboard Interface

- Tab navigation between languages and services
- Sortable table view with edit/delete buttons
- Modal form for adding/editing items
- Status indicators (Active/Inactive)
- Responsive design for tablets and mobile

## Customization

### Modify Default Languages

Edit `seed-language-services.js` to change the initial data:

```javascript
{
  type: 'language',
  name: 'TypeScript',
  icon: '📘',
  order: 7,
  isActive: true,
}
```

### Change Colors

Edit `MyLanguagesServices.js` component:

```jsx
// Change gradient colors
className = "bg-gradient-to-br from-slate-50 via-white to-blue-50";

// Change accent colors
className = "bg-gradient-to-r from-blue-500 to-purple-500";
```

### Add More Fields

Update the schema in `LanguageServices.js`:

```javascript
const LanguageServiceSchema = new mongoose.Schema({
  // Existing fields...
  proficiency: String, // Add custom field
  yearsOfExperience: Number, // Add custom field
});
```

## Troubleshooting

### Database Connection Fails

- Check `MONGODB_URI` in `.env.local`
- Ensure MongoDB is running
- Verify network access in MongoDB Atlas

### No Data Displays

- Run seed script: `node seed-language-services.js`
- Check browser console for API errors
- Verify database has data: Use MongoDB Compass

### Styling Issues

- Ensure Tailwind CSS is configured in `tailwind.config.js`
- Clear Next.js cache: `rm -rf .next`
- Restart development server

### API Errors

- Check server logs for error details
- Verify API endpoint: `/api/language-services`
- Test with curl or Postman

## Advanced Usage

### Add Custom Sorting

```jsx
const sortedLanguages = languages.sort((a, b) => a.order - b.order);
```

### Search/Filter

```jsx
const filteredLanguages = languages.filter((lang) =>
  lang.name.toLowerCase().includes(searchTerm),
);
```

### Pagination

```jsx
const itemsPerPage = 6;
const paginatedServices = services.slice(0, itemsPerPage);
```

## Version History

- v1.0.0 (2024) - Initial release with full CRUD functionality

## Support

For issues or questions, check:

1. Console errors (browser DevTools)
2. Terminal output (server logs)
3. MongoDB connection status
4. API endpoint responses (Network tab in DevTools)

---

Enjoy your dynamic Languages & Services feature! 🚀
