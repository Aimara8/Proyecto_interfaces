
import '../CSS/ErrorPage.css';
import { useContext } from 'react';
import { ThemeContext } from '../Contexts/ThemeContext';

function ErrorPage() {

  // Accedemos al contexto usando useContext
      const themeContext = useContext(ThemeContext); // Accede al contexto
  
      const { theme } = themeContext!;

  return (
    <div className={`error-page ${theme}`}>
      <h1>404</h1>
      <p>Oops! The page you are looking for does not exist.</p>
    </div>
  );
}

export default ErrorPage;
