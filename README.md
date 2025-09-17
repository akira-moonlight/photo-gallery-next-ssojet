# 🖼️ Photo Gallery with SSOJet Authentication

A **modern, responsive photo gallery** built with **Next.js** and **SSOJet OpenID Connect authentication**. Features a beautiful masonry layout, full-screen modal viewing, and seamless authentication flow. Perfect for showcasing photo collections with secure access control.

## 📋 Table of Contents

- [Features](#-features)
- [Architecture Overview](#-architecture-overview)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Authentication Flow](#-authentication-flow)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Development](#-development)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [References](#-references)

## ✨ Features

- 🔐 **SSOJet OpenID Connect Authentication** - Secure SSO integration
- 🖼️ **Responsive Photo Gallery** - Beautiful masonry layout with Tailwind CSS
- 🎭 **Full-Screen Modal Viewing** - Immersive photo viewing experience
- ⌨️ **Keyboard Navigation** - Arrow keys for photo navigation
- 📱 **Touch/Swipe Support** - Mobile-friendly gesture controls
- 🎨 **Smooth Animations** - Framer Motion powered transitions
- 🖼️ **Image Optimization** - Next.js Image component with blur placeholders
- 📊 **Unsplash API** - Photo fetching from Unsplash
- 🎯 **TypeScript Support** - Full type safety throughout the application
- 📱 **Mobile Responsive** - Optimized for all device sizes

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   User Browser  │────│  Next.js App    │────│   Unsplash API  │
│                 │    │   (Frontend)    │    │   (Photo Data)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         │               ┌─────────────────┐             │
         └───────────────│   SSOJet Auth   │─────────────┘
                         │    Provider     │
                         └─────────────────┘
```

### 🔄 Authentication & Gallery Flow

```
1. User visits gallery → Authentication check
   ↓
2. If not authenticated → Redirect to SSOJet login
   ↓
3. User authenticates → SSOJet OAuth flow
   ↓
4. Callback → Session created with NextAuth
   ↓
5. Gallery loads → Cached photos displayed
   ↓
6. User clicks photo → Full-screen modal opens
   ↓
7. Navigation → Keyboard/touch controls for browsing
   ↓
8. Download/Share → Direct links to full-size images
```

## 📦 Prerequisites

### Required Software
- **Node.js** (v16.0.0 or higher)
- **npm** (comes with Node.js)
- **Git** (for cloning repository)

### Required Accounts & Credentials
1. **SSOJet Account** - [Sign up at SSOJet](https://ssojet.com)
2. **Unsplash Account** - [Sign up at Unsplash](https://unsplash.com/developers) for photo API access

### SSOJet Application Setup
1. Log in to **SSOJet Dashboard**
2. Navigate to **Applications**
3. Create new application:
   - **Name**: `Photo Gallery`
   - **Type**: `Regular Web App`
   - **Callback URL**: `http://localhost:3000/api/auth/callback/ssojet`
4. Copy credentials:
   - **Client ID**
   - **Client Secret**
   - **Authority URL** (from Advanced > Endpoints)

**📚 Reference**: [SSOJet Integration Guide](https://docs.ssojet.com/integration-guide-llm.txt)

### Unsplash API Setup
1. Log in to **Unsplash Developers**
2. Navigate to **Your Apps**
3. Create new application:
   - **Application name**: `Photo Gallery`
   - **Description**: `Photo gallery with SSOJet authentication`
   - **Website URL**: `http://localhost:3000` (or your domain)
4. Copy credentials:
   - **Access Key** (for API requests)

**📚 Reference**: [Unsplash API Documentation](https://unsplash.com/documentation)

### SSOJet Configuration Details

#### **OAuth 2.0 / OpenID Connect Flow**
The application uses SSOJet as an OpenID Connect provider with the following configuration:

```javascript
// SSOJet Provider Configuration
{
  id: "ssojet",
  name: "SSOJet",
  type: "oauth",
  wellKnown: `${process.env.SSOJET_AUTHORITY}/.well-known/openid-configuration`,
  authorization: {
    params: {
      scope: "openid profile email",
      response_type: "code",
    },
  },
  clientId: process.env.SSOJET_CLIENT_ID,
  clientSecret: process.env.SSOJET_CLIENT_SECRET,
  checks: ["pkce", "state", "nonce"],
  idToken: true,
}
```

#### **Environment Variables Required**
```env
# SSOJet Authentication
SSOJET_CLIENT_ID=your_ssojet_client_id
SSOJET_CLIENT_SECRET=your_ssojet_client_secret
SSOJET_AUTHORITY=https://your-subdomain.auth.ssojet.com

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_nextauth_key

# Unsplash API Configuration
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

#### **SSOJet Endpoints**
- **Authorization URL**: `https://your-subdomain.auth.ssojet.com/oauth/authorize`
- **Token URL**: `https://your-subdomain.auth.ssojet.com/oauth/token`
- **User Info URL**: `https://your-subdomain.auth.ssojet.com/oauth/userinfo`
- **JWKS URL**: `https://your-subdomain.auth.ssojet.com/.well-known/jwks.json`
- **OpenID Configuration**: `https://your-subdomain.auth.ssojet.com/.well-known/openid-configuration`

## 🛠️ Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-username/photo-gallery-next-js.git
cd photo-gallery-next-js/photo-gallery
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the `photo-gallery` directory:

**Note**: Copy the example below and replace with your actual credentials:

```env
# SSOJet Authentication
SSOJET_CLIENT_ID=your_ssojet_client_id
SSOJET_CLIENT_SECRET=your_ssojet_client_secret
SSOJET_AUTHORITY=https://your-subdomain.auth.ssojet.com

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_nextauth_key

# Unsplash API Configuration
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

### 4. Start the Development Server
```bash
npm run dev
```

The application will start on `http://localhost:3000`

## 🔐 Authentication Flow

### Step-by-Step Authentication Process

#### 1. **Check Authentication Status**
```bash
curl -X GET "http://localhost:3000/api/auth/session"
```

#### 2. **Visit the Gallery**
Navigate to `http://localhost:3000`

#### 3. **Authentication Check**
- If not authenticated, you'll see the login screen
- Click "Sign In to View Photos" button

#### 4. **SSOJet Authentication**
**⚠️ Important**: This step requires browser interaction for OAuth flow

Open in browser: `http://localhost:3000/api/auth/signin/ssojet`

1. Browser redirects to SSOJet OAuth provider
2. User completes authentication on SSOJet
3. SSOJet redirects back with authorization code
4. NextAuth exchanges code for tokens
5. Session cookie is created
6. User is redirected to gallery

**Successful Response:**
```json
{
  "user": {
    "id": "user_id_from_ssojet",
    "email": "user@example.com",
    "name": "User Name",
    "image": "https://avatar-url.com/user.jpg"
  },
  "expires": "2025-01-20T10:30:00.000Z"
}
```

#### 5. **Gallery Access**
- Photos load from cached data
- Full gallery functionality available
- User can sign out from header

### Authentication API Endpoints

#### **Get Session Status**
```bash
curl -X GET "http://localhost:3000/api/auth/session"
```

#### **Sign In**
```bash
curl -X GET "http://localhost:3000/api/auth/signin/ssojet"
```

#### **Sign Out**
```bash
curl -X POST "http://localhost:3000/api/auth/signout"
```

## 📁 Project Structure

```
photo-gallery/
├── components/
│   ├── Carousel.tsx              # Photo carousel component
│   ├── Header.tsx                # Navigation header with auth
│   ├── Modal.tsx                 # Full-screen photo modal
│   ├── SharedModal.tsx           # Shared modal functionality
│   └── Icons/
│       ├── Bridge.tsx            # Bridge icon component
│       ├── Logo.tsx              # Logo component
│       └── Twitter.tsx           # Twitter icon component
├── data/
│   └── (removed - now using live API)
├── pages/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth].ts  # NextAuth configuration
│   ├── p/
│   │   └── [photoId].tsx         # Individual photo page
│   ├── _app.tsx                  # App wrapper with providers
│   ├── _document.tsx             # Custom document
│   └── index.tsx                 # Main gallery page
├── styles/
│   └── index.css                 # Global styles
├── utils/
│   ├── animationVariants.ts      # Framer Motion variants
│   ├── cachedImages.ts           # Photo data utilities
│   ├── downloadPhoto.ts          # Photo download utility
│   ├── generateBlurPlaceholder.ts # Blur placeholder generation
│   ├── range.ts                  # Utility functions
│   ├── types.ts                  # TypeScript type definitions
│   ├── unsplash.ts               # Unsplash API client
│   └── useLastViewedPhoto.ts     # Last viewed photo hook
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

## ⚙️ Configuration

### SSOJet Authentication

```env
# SSOJet Configuration
SSOJET_CLIENT_ID=cli_xxxxx.xxxxx.xxxxx
SSOJET_CLIENT_SECRET=sk_xxxxx.xxxxx
SSOJET_AUTHORITY=https://your-subdomain.auth.ssojet.com
```

### NextAuth Configuration

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-nextauth-key-here
```

### Image Configuration

The app is configured to load images from:
- **Unsplash** (primary source)
- **Cloudinary** (backup/alternative)

Configured in `next.config.js`:
```javascript
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  }
};
```

## 🚀 Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

### Testing SSOJet Integration

#### **Test Authentication Flow**
```bash
# 1. Start the development server
npm run dev

# 2. Test session endpoint
curl -X GET "http://localhost:3000/api/auth/session"

# 3. Test sign-in endpoint
curl -X GET "http://localhost:3000/api/auth/signin/ssojet"

# 4. Test sign-out endpoint
curl -X POST "http://localhost:3000/api/auth/signout"
```

#### **Test SSOJet Configuration**
```bash
# Test SSOJet OpenID Configuration
curl -X GET "https://your-subdomain.auth.ssojet.com/.well-known/openid-configuration"

# Test SSOJet JWKS endpoint
curl -X GET "https://your-subdomain.auth.ssojet.com/.well-known/jwks.json"
```

#### **Browser Testing**
1. Open `http://localhost:3000`
2. Click "Sign In to View Photos"
3. Complete SSOJet authentication
4. Verify gallery loads with photos
5. Test modal navigation
6. Test sign out functionality

#### **Environment Testing**
```bash
# Check environment variables
echo $SSOJET_CLIENT_ID
echo $SSOJET_CLIENT_SECRET
echo $SSOJET_AUTHORITY
echo $NEXTAUTH_URL
echo $NEXTAUTH_SECRET
echo $UNSPLASH_ACCESS_KEY
```

### Key Features Implementation

#### **Photo Gallery Layout**
- **Masonry Grid**: Responsive columns using Tailwind CSS
- **Image Optimization**: Next.js Image component with blur placeholders
- **API Integration**: Photo fetching from Unsplash API
- **Lazy Loading**: Images load as user scrolls

#### **Modal Viewing**
- **Full-Screen Experience**: Immersive photo viewing
- **Navigation Controls**: Previous/Next buttons and keyboard support
- **Touch Gestures**: Swipe left/right on mobile devices
- **Download/Share**: Direct links to full-size images

#### **Authentication Integration**
- **NextAuth.js**: Handles OAuth flow with SSOJet
- **Session Management**: Persistent user sessions
- **Protected Routes**: Gallery only accessible when authenticated

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

2. **Environment Variables**
   Set the following in Vercel dashboard:
   - `SSOJET_CLIENT_ID`
   - `SSOJET_CLIENT_SECRET`
   - `SSOJET_AUTHORITY`
   - `NEXTAUTH_URL` (your production URL)
   - `NEXTAUTH_SECRET`
   - `UNSPLASH_ACCESS_KEY`

3. **Update SSOJet Callback URL**
   Update your SSOJet application callback URL to:
   `https://your-app.vercel.app/api/auth/callback/ssojet`

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- **Netlify**
- **Railway**
- **DigitalOcean App Platform**
- **AWS Amplify**

## 🔧 Troubleshooting

### Common Issues

#### SSOJet Authentication Problems

**Issue**: "Failed to obtain access token"
```
Solution: Verify SSOJet endpoints in OIDC discovery:
https://your-subdomain.auth.ssojet.com/.well-known/openid-configuration

Check that your SSOJet application is properly configured:
- Client ID and Secret are correct
- Callback URL matches exactly: http://localhost:3000/api/auth/callback/ssojet
- Application is enabled in SSOJet dashboard
```

**Issue**: "Invalid client" error
```
Solution: 
1. Verify SSOJET_CLIENT_ID in .env.local
2. Check SSOJet application settings
3. Ensure callback URL is exactly: http://localhost:3000/api/auth/callback/ssojet
4. Verify application is not disabled in SSOJet dashboard
```

**Issue**: Gallery shows login screen after authentication
```
Solution: 
1. Check NEXTAUTH_URL matches your domain
2. Verify NEXTAUTH_SECRET is set correctly
3. Check browser console for NextAuth errors
4. Verify session is being created in browser dev tools
```

**Issue**: "Callback URL mismatch"
```
Solution:
1. In SSOJet dashboard, ensure callback URL is exactly:
   http://localhost:3000/api/auth/callback/ssojet
2. For production, update to your production domain:
   https://yourdomain.com/api/auth/callback/ssojet
3. No trailing slashes or extra paths
```

**Issue**: Authentication redirects but doesn't complete
```
Solution:
1. Check SSOJet application scopes include: openid, profile, email
2. Verify SSOJET_AUTHORITY URL is correct
3. Check network tab for failed requests
4. Ensure SSOJet service is operational
```

#### Image Loading Problems

**Issue**: Images not loading
```
Solution: Check next.config.js remote patterns
Verify Unsplash API access (if using custom collections)
```

**Issue**: Blur placeholders not working
```
Solution: Check image URLs in cached data
Verify imagemin dependencies are installed
```

#### Modal Navigation Problems

**Issue**: Modal doesn't open when clicking images
```
Solution: 
1. Check browser console for JavaScript errors
2. Verify images array is properly loaded
3. Check that selectedPhotoId state is being set
```

**Issue**: Navigation buttons not working in modal
```
Solution:
1. Verify images array has proper structure
2. Check that changePhotoId function is working
3. Ensure modal is receiving correct props
```

### Debug Mode

Enable detailed logging:
```bash
NODE_ENV=development npm run dev
```

Check browser console and server logs for detailed error information.

## 📚 References

### Official Documentation
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
- **NextAuth.js**: [next-auth.js.org](https://next-auth.js.org)
- **SSOJet Integration Guide**: [docs.ssojet.com/integration-guide-llm.txt](https://docs.ssojet.com/integration-guide-llm.txt)
- **SSOJet Dashboard**: [ssojet.com](https://ssojet.com)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Framer Motion**: [framer.com/motion](https://framer.com/motion)

### SSOJet Resources
- **SSOJet Documentation**: [docs.ssojet.com](https://docs.ssojet.com)
- **SSOJet OpenID Connect**: [docs.ssojet.com/openid-connect](https://docs.ssojet.com/openid-connect)
- **SSOJet OAuth 2.0**: [docs.ssojet.com/oauth2](https://docs.ssojet.com/oauth2)
- **SSOJet API Reference**: [docs.ssojet.com/api](https://docs.ssojet.com/api)
- **SSOJet Dashboard Guide**: [docs.ssojet.com/dashboard](https://docs.ssojet.com/dashboard)

### Libraries Used
- **Next.js**: React framework with SSR/SSG
- **NextAuth.js**: Authentication for Next.js
- **SSOJet**: OpenID Connect authentication provider
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Headless UI**: Unstyled UI components
- **Heroicons**: Beautiful SVG icons
- **Unsplash JS**: Unsplash API client

### Authentication Standards
- **OpenID Connect Spec**: [openid.net/connect](https://openid.net/connect/)
- **OAuth 2.0 Spec**: [oauth.net/2](https://oauth.net/2/)
- **JWT (JSON Web Tokens)**: [jwt.io](https://jwt.io)
- **PKCE (Proof Key for Code Exchange)**: [tools.ietf.org/html/rfc7636](https://tools.ietf.org/html/rfc7636)

### Security Best Practices
- **OWASP Authentication**: [owasp.org/www-project-authentication-cheat-sheet](https://owasp.org/www-project-authentication-cheat-sheet)
- **OAuth 2.0 Security**: [tools.ietf.org/html/rfc6819](https://tools.ietf.org/html/rfc6819)
- **NextAuth.js Security**: [next-auth.js.org/configuration/options](https://next-auth.js.org/configuration/options)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using Next.js, SSOJet Authentication, and Tailwind CSS**