import React, { useState, useContext } from 'react';
import '../CSS/CatsApp.css'
import { ThemeContext } from '../Contexts/ThemeContext';

interface Cat {
  id: string;
  url: string;
  width: number;
  height: number;
}

export const CatsApp = () => {

  // Accedemos al contexto usando useContext
  const themeContext = useContext(ThemeContext); // Accede al contexto
  const { theme } = themeContext!;

  const APIKEY = 'live_7eRK0k7BR1SXwtcF40Px1qbd2y1IkfkIqfSE1q4gmDTR3TBfpFKYgD0EJ3ulGAZk'; // Sustituye con tu API key de TheMealDB
  const urlBase = 'https://api.thecatapi.com/v1/images/search?';

  const [cat, setCat] = useState<Cat | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchAPI();
  };

  const fetchAPI = async () => {
    try {
      const response = await fetch(`${urlBase}api_key=${APIKEY}&lang=es`);
      const data = await response.json();
      setCat(data[0]); // Asumiendo que la API devuelve un array
    } catch (error) {
      console.error("Ocurrio el siguiente error: " + error)
    }
  }

  return (
    <div className={`catsapp ${theme}`}>
      <h1>Gato Sorpresa</h1>
      <form onSubmit={handleSubmit}>
        <button type="submit">Buscar Gato</button>
      </form>

      {cat ? (
        <div className='gato'>
          <h2>¡Aquí tienes un gato!</h2>
          <div className='info'>
            <img src={cat.url} alt="Gato" width="200" />
            <div>
              <p><strong>Estatura:</strong> {cat.height}</p>
              <p><strong>Peso:</strong> {cat.width}</p>
            </div>
          </div>
        </div>
      ) : (
        <p>No se encontraron gatos o algo salió mal.</p>
      )}
    </div>
  );
};