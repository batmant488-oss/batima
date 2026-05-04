# Quick Start Guide - Lmohh Frontend

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation Steps

1. **Navigate to the project directory**
   ```bash
   cd lmohh
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Demo Accounts

### Admin Account
- **Email**: admin@lmohh.demo
- **Password**: demo123
- **Access**: Full admin dashboard, user management, system settings

### Resident Account
- **Email**: resident@lmohh.demo
- **Password**: demo123
- **Access**: Personal dashboard, announcements, maintenance requests, documents

## 📱 Available Pages

### Public Pages
- `/` - Redirects to dashboard
- `/login` - Login page with demo accounts
- `/signup` - Registration page

### Dashboard Pages (Resident)
- `/dashboard` - Main dashboard with statistics
- `/announcements` - Building announcements
- `/maintenance` - Maintenance requests
- `/documents` - Document library
- `/profile` - User profile management

### Admin Pages
- `/admin` - Admin overview
- `/admin/users` - User management
- `/settings` - System settings

## 🎨 Key Features

### 1. **Modern UI/UX**
- Smooth animations with Framer Motion
- Dark/Light mode support
- Responsive design for all devices
- Clean, modern interface

### 2. **Enhanced Functionality**
- Real-time search across all pages
- Advanced filtering options
- Role-based access control
- Toast notifications

### 3. **Better Than Batima-Gest**
- Improved component architecture
- Better performance optimizations
- Enhanced accessibility
- More comprehensive features
- Better code organization

## 🔧 Common Tasks

### Add New Page
1. Create file in `app/(dashboard)/[page-name]/page.tsx`
2. Add navigation link in `components/layout/Sidebar.tsx`
3. Follow existing patterns

### Modify Theme
- Edit `app/globals.css` for color variables
- Modify `tailwind.config.ts` for custom configurations

### Add New Component
1. Create in `components/ui/` or `components/layout/`
2. Export from `components/ui/index.ts`
3. Use TypeScript for type safety

## 🐛 Troubleshooting

### Dependencies Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use
```bash
npm run dev -- -p 3001
```

### Build Errors
```bash
npm run type-check
npm run lint
```

## 📊 Project Structure

```
lmohh/
├── app/                    # Next.js app directory
│   ├── (dashboard)/       # Dashboard pages
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # UI components
│   └── layout/           # Layout components
├── lib/                  # Utility functions
├── public/              # Static assets
└── package.json         # Dependencies
```

## 🎯 Next Steps

1. **Explore the Dashboard**
   - Try different user roles
   - Test search and filtering
   - Explore all pages

2. **Customize for Your Needs**
   - Update branding in layout
   - Modify color scheme
   - Add your own pages

3. **Connect to Backend**
   - Set up API endpoints
   - Implement real authentication
   - Connect to database

4. **Deploy**
   - Build for production
   - Deploy to Vercel/Netlify
   - Set up environment variables

## 💡 Tips

- Use demo accounts to explore different features
- Try dark mode by clicking the theme toggle
- Test responsive design by resizing browser
- Use search functionality on all pages
- Check out the README for detailed documentation

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

---

**Need Help?** Check the main README.md for comprehensive documentation.