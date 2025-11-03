<<<<<<< HEAD
# RG Interiors - Professional Interior Design Website

A modern, responsive interior design portfolio website with Firebase integration for dynamic content management.

## 🌟 Features

- **Dynamic Content**: Firebase Realtime Database integration
- **Project Showcase**: Interactive project gallery with modal views
- **Contact Forms**: Working contact and review submission forms
- **Google Drive Integration**: Smart image URL conversion for Google Drive links
- **Mobile Responsive**: Optimized for all devices
- **SEO Friendly**: Clean HTML structure and meta tags
- **Client Reviews System**: Firebase Firestore integration
- **Newsletter Subscription**: Email capture functionality
- **Filterable Gallery**: Category-based project filtering
- **Rating System**: Interactive star ratings for reviews

## 🚀 Live Demo

Visit: [Your Render URL will be here]

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase Realtime Database
- **Authentication**: Firebase Auth (optional)
- **Hosting**: Render
- **Icons**: Font Awesome 6.4.0

## 📁 Project Structure

```
├── index.html              # Homepage
├── projects.html           # Projects showcase page  
├── styles.css             # Main stylesheet
├── projects.css           # Projects page styles
├── script.js              # Main JavaScript functionality
├── firebase-config.js     # Firebase configuration
├── firebase-sample-data/  # Sample data structure
└── README.md              # This file
```

## 🔥 Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable Realtime Database
3. Update `firebase-config.js` with your Firebase credentials
4. Import sample data from `firebase-sample-data/all-sample-data.json`

## 🚀 Deployment on Render

This site is configured for easy deployment on Render:

1. **Connect Repository**: Link your GitHub repository to Render
2. **Auto-Deploy**: Render will automatically detect the static site configuration
3. **Custom Domain**: Add your custom domain in Render dashboard

### Build Settings for Render:
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Node Version**: 18.x or higher

## 📝 Environment Variables

No environment variables needed - Firebase config is included in the codebase for static hosting.

## 🎨 Customization

### Adding New Projects
Upload project data to Firebase Realtime Database under the `projects` node.

### Updating Site Information
Modify the `settings/siteInfo` node in Firebase to update:
- Site name and branding
- Contact information  
- Social media links
- Company statistics

### Styling
- Edit `styles.css` for general styling
- Edit `projects.css` for project-specific styles
- Font Awesome icons are used throughout

## 📞 Contact & Support

For support or customization requests, please contact the development team.

## 📄 License

This project is licensed under the MIT License.
=======
# RG Interiors - Interior Design Website

A modern, responsive static website for an interior design business featuring Firebase integration for dynamic content.
>>>>>>> 1acfb585b5c1d39a5f804f0ab16d493c78de164c

## Features

- 🎨 Modern and responsive design
- 📱 Mobile-first approach
- 🖼️ Dynamic gallery with Firebase Storage integration
- 💬 Client reviews system with Firebase Firestore
- 📧 Contact form with Firebase database storage
- 🎯 Service showcase
- ⭐ Rating system for reviews
- 🔍 Filterable gallery by category
- 📰 Newsletter subscription

## Setup Instructions

### 1. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable Firestore Database
4. Enable Firebase Storage
5. Get your Firebase configuration from Project Settings
6. Replace the configuration in `firebase-config.js`:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 2. Firestore Database Structure

Create the following collections in Firestore:

#### Gallery Collection (`gallery`)
```javascript
{
    title: "Project Title",
    description: "Project description",
    imageUrl: "https://firebase-storage-url/image.jpg",
    category: "residential", // residential, restaurant, theme-park, studio, movie-set
    createdAt: timestamp
}
```

#### Reviews Collection (`reviews`)
```javascript
{
    name: "Client Name",
    email: "client@email.com",
    review: "Review text",
    rating: 5, // 1-5
    approved: true, // boolean
    createdAt: timestamp
}
```

#### Contacts Collection (`contacts`)
```javascript
{
    name: "Client Name",
    email: "client@email.com",
    phone: "Phone number",
    service: "residential", // selected service
    message: "Message text",
    status: "new", // new, contacted, completed
    createdAt: timestamp
}
```

#### Newsletter Collection (`newsletter`)
```javascript
{
    email: "subscriber@email.com",
    subscribedAt: timestamp
}
```

#### Settings Collection (`settings`)
Document ID: `contactInfo`
```javascript
{
    address: "123 Design Street, Creative City, DC 12345",
    phone: "+1 (555) 123-4567",
    email: "info@rginteriors.com",
    businessHours: "Mon - Fri: 9:00 AM - 6:00 PM<br>Sat: 10:00 AM - 4:00 PM",
    socialLinks: {
        facebook: "https://facebook.com/yourpage",
        instagram: "https://instagram.com/yourpage",
        twitter: "https://twitter.com/yourpage",
        linkedin: "https://linkedin.com/company/yourpage",
        pinterest: "https://pinterest.com/yourpage"
    }
}
```

### 3. Firestore Security Rules

Add these security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Gallery - Read only
    match /gallery/{document} {
      allow read: if true;
      allow write: if false; // Only admins can write (use Firebase Console)
    }
    
    // Reviews - Read approved, write new (pending approval)
    match /reviews/{document} {
      allow read: if resource.data.approved == true;
      allow create: if request.resource.data.approved == false;
    }
    
    // Contacts - Write only
    match /contacts/{document} {
      allow read: if false; // Only admins can read
      allow create: if true;
    }
    
    // Newsletter - Write only
    match /newsletter/{document} {
      allow read: if false; // Only admins can read
      allow create: if true;
    }
    
    // Settings - Read only (contact info, etc.)
    match /settings/{document} {
      allow read: if true;
      allow write: if false; // Only admins can write (use Firebase Console)
    }
  }
}
```

### 4. Firebase Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /gallery/{allPaths=**} {
      allow read: if true;
      allow write: if false; // Only admins via Firebase Console
    }
  }
}
```

### 5. Adding Gallery Images

1. Upload images to Firebase Storage in a folder called `gallery`
2. Get the download URL for each image
3. Add a document to the `gallery` collection with the image URL and details

### 6. Running the Website

Simply open `index.html` in a web browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## Project Structure

```
cutie/
├── index.html          # Main HTML file
├── styles.css          # All styles
├── script.js           # Main JavaScript functionality
├── firebase-config.js  # Firebase configuration
└── README.md          # This file
```

## Services Offered

- Residential Interior Design
- Restaurant Interiors
- Theme Park Design
- Studio Design
- Movie Set Design
- Moulding & Architectural Detailing

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #e74c3c;
    --accent-color: #3498db;
    /* ... */
}
```

### Content
- Edit text directly in `index.html`
- Update contact information in the Contact section
- Modify service descriptions in the Services section

## Support

For issues or questions, please contact the development team.

## License

© 2025 RG Interiors. All rights reserved.
