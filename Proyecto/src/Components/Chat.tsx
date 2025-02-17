import React, { useState } from "react";
import { MainContainer, ChatContainer, MessageList, Message, MessageInput } from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import '../CSS/Chat.css'

// Definición de la clave y la URL de la API de Gemini para generar respuestas basadas en IA.
const API_KEY = "AIzaSyCq-NldttCfz3K8NXs1PS4jk0_bCAwLsKQ";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Definición de la estructura de un mensaje en el chat.
interface MessageType {
  sender: "user" | "bot"; // El mensaje puede ser enviado por el usuario o por el bot.
  text: string; // Contenido del mensaje.
}

const Chatbot: React.FC = () => {
  // Estado que almacena los mensajes enviados y recibidos.
  const [messages, setMessages] = useState<MessageType[]>([]);

  // Función para enviar un mensaje y recibir respuesta del chatbot.
  const sendMessage = async (text: string) => {
    if (!text.trim()) return; // Evita enviar mensajes vacíos.

    // Crea el mensaje del usuario y lo agrega a la lista de mensajes.
    const newMessage: MessageType = { sender: "user", text };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Llamada a la API de Gemini para obtener una respuesta basada en IA.
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Responde como si fueras un videoclub, el videoclub se llama 'Kozzy', no respondas a las preguntas que no estén relacionadas con el videoclub, si fuese así di que no lo puedes responder porque no es sobre el videoclub: ${text}` }] }],
        }),
      });

      // Procesa la respuesta de la API.
      const data = await response.json();
      const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

      // Agrega la respuesta del bot a la lista de mensajes.
      setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: botReply }]);
    } catch (error) {
      console.error("Error fetching response:", error);
       // Si hay un error, se muestra un mensaje de error en el chat.
      setMessages((prevMessages) => [...prevMessages, newMessage, { sender: "bot", text: "Error en la respuesta" }]);
    }
  };

  return (
    <div className="chatbot-container">
      <MainContainer>
        <ChatContainer className="chat-container">
          <MessageList>
            {messages.map((msg, index) => (
              <Message
                key={index}
                model={{
                  message: msg.text,
                  sentTime: "just now",
                  sender: msg.sender,
                  direction: msg.sender === "user" ? "outgoing" : "incoming",
                  position: "single",
                }}
                className={msg.sender === "user" ? "cs-message--outgoing" : "cs-message--incoming"}
              />
            ))}
          </MessageList>
          <MessageInput placeholder="Escribe tu mensaje..." onSend={sendMessage} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default Chatbot;