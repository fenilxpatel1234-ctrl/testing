const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add import
if (!content.includes('import { NotFoundView }')) {
  content = content.replace(
    "import { ResetPasswordView } from './views/ResetPasswordView';",
    "import { ResetPasswordView } from './views/ResetPasswordView';\nimport { NotFoundView } from './views/NotFoundView';"
  );
}

// 2. Update syncViewFromHash
const oldSync = `  const syncViewFromHash = () => {
    const viewMap: Record<string, PageView> = {
      'admin': 'admin', 'secure-admin-login': 'admin',
      'reset-password': 'reset-password',
      'home': 'home', 'services': 'services', 'book-online': 'book-online', 'emergency': 'emergency',
      'our-team': 'our-team', 'contact-us': 'contact-us', 'blog': 'blog',
      'reviews': 'reviews',
      'legal': 'legal', 'service-detail': 'service-detail'
    };
    const hash = window.location.hash.replace('#', '').split('?')[0];
    const view = viewMap[hash] || 'home';
    setCurrentView(view);
  };`;

const newSync = `  const syncViewFromHash = () => {
    const viewMap: Record<string, PageView> = {
      'admin': 'admin', 'secure-admin-login': 'admin',
      'reset-password': 'reset-password',
      'home': 'home', 'services': 'services', 'book-online': 'book-online', 'emergency': 'emergency',
      'our-team': 'our-team', 'contact-us': 'contact-us', 'blog': 'blog',
      'reviews': 'reviews',
      'legal': 'legal', 'service-detail': 'service-detail'
    };
    const hash = window.location.hash.replace('#', '').split('?')[0];
    if (hash === '') {
      setCurrentView('home');
      return;
    }
    const view = viewMap[hash];
    if (view) {
      setCurrentView(view);
    } else {
      setCurrentView('not-found');
    }
  };`;

content = content.replace(oldSync, newSync);

// 3. Update switch statement
const oldSwitch = `      case 'admin':
        return <AdminView onSelectView={handleSelectView} />;
      default:
        return (
          <HomeView`;

const newSwitch = `      case 'admin':
        return <AdminView onSelectView={handleSelectView} />;
      case 'not-found':
        return <NotFoundView onSelectView={handleSelectView} />;
      default:
        return (
          <HomeView`;

content = content.replace(oldSwitch, newSwitch);

fs.writeFileSync('src/App.tsx', content, 'utf-8');
console.log('App.tsx updated successfully');
