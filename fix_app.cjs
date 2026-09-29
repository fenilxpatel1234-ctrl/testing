const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace syncViewFromHash
const oldSync = `    const hash = window.location.hash.replace('#', '').split('?')[0];
    const view = viewMap[hash] || 'home';
    setCurrentView(view);
  };`;

const newSync = `    const hash = window.location.hash.replace('#', '').split('?')[0];
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

// Replace popstate useEffect to include hashchange
const oldEffect = `  useEffect(() => {
    syncViewFromHash();
    setHashReady(true);
    window.addEventListener('popstate', syncViewFromHash);
    return () => window.removeEventListener('popstate', syncViewFromHash);
  }, []);`;

const newEffect = `  useEffect(() => {
    syncViewFromHash();
    setHashReady(true);
    window.addEventListener('popstate', syncViewFromHash);
    window.addEventListener('hashchange', syncViewFromHash);
    return () => {
      window.removeEventListener('popstate', syncViewFromHash);
      window.removeEventListener('hashchange', syncViewFromHash);
    };
  }, []);`;

content = content.replace(oldEffect, newEffect);

fs.writeFileSync('src/App.tsx', content, 'utf-8');
console.log('Fixed syncViewFromHash and hashchange listeners');
