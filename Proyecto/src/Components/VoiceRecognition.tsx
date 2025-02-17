import React, { useState, useEffect, useContext } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import '../CSS/VoiceRecognition.css'; // Importa el archivo CSS
import { ThemeContext } from '../Contexts/ThemeContext';

const InputWithDisplay: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [displayText, setDisplayText] = useState<string>('');

  // Accedemos al contexto usando useContext
  const themeContext = useContext(ThemeContext); // Accede al contexto
  const { theme } = themeContext!;

  // Usa el hook useSpeechRecognition
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Si el navegador no soporta reconocimiento de voz
  if (!browserSupportsSpeechRecognition) {
    return <div>Tu navegador no soporta reconocimiento de voz.</div>;
  }

  // Función que se ejecuta cuando se hace clic en el botón "Enviar"
  const handleSubmit = () => {
    setDisplayText(inputValue);
    setInputValue('');
    resetTranscript(); // Reinicia el texto reconocido
  };

  // Actualiza el input con el texto reconocido
  useEffect(() => {
    setInputValue(transcript);
  }, [transcript]);

  return (
    <div className={`container ${theme}`}>
      {/* Contenedor para el input y los botones */}
      <div className="input-container">
        {/* Input para escribir el texto */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Escribe algo..."
          className="input-field"
        />

        {/* Grupo de botones */}
        <div className="button-group">
          {/* Botón circular para enviar el texto */}
          <button onClick={handleSubmit} className="submit-button">
            ✓
          </button>

          {/* Botón circular para activar el micrófono */}
          <button
            onClick={() => {
              if (listening) {
                SpeechRecognition.stopListening();
              } else {
                SpeechRecognition.startListening();
              }
            }}
            className={`mic-button ${listening ? 'active' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z" />
              <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Área donde se mostrará el texto enviado */}
      <div className="display-area">
        <h3>Texto ingresado:</h3>
        <p>{displayText}</p>
      </div>
    </div>
  );
};

export default InputWithDisplay;
