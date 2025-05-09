import React from 'react';
import Chatbot from './components/Chatbot'; // Adjust path accordingly
import { ThemeProvider } from './context/ThemeContext';
import './App.css';  // Keep the default styling file (or update it if needed)

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <h1>AIssist</h1>
        <Chatbot />  {/* Render the Chatbot component here */}
        <div className="signature">Designed By Sanjeev Muddala</div>
      </div>
    </ThemeProvider>
  );
}

export default App;


