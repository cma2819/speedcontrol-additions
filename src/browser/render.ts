import { type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

export const render = (app: ReactNode): void => {
  const rootDom = document.getElementById('root');
  if (rootDom === null) {
    console.error('#root DOM is not found');
    return;
  }
  const root = createRoot(rootDom);
  root.render(app);
};
