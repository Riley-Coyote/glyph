import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTrashAlt, faStream, faInfoCircle, faKey } from '@fortawesome/free-solid-svg-icons';
import { specialCharacters, decodingStrategies } from '../utils/unicode';

const Analyzer: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [stats, setStats] = useState({ total: 0, special: 0 });
  const [specialCharsFound, setSpecialCharsFound] = useState<Set<string>>(new Set());
  const [decodedMessages, setDecodedMessages] = useState<Array<{ strategy: string; message: string; details: string }>>([]);

  const analyzeText = () => {
    if (!inputText) {
      setResult('Please enter some text to analyze.');
      setStats({ total: 0, special: 0 });
      setSpecialCharsFound(new Set());
      return;
    }

    let charCount = 0;
    let specialCount = 0;
    const foundSpecialChars = new Set<string>();
    let htmlResult = '';

    for (let i = 0; i < inputText.length; i++) {
      const char = inputText[i];
      const code = char.charCodeAt(0);
      charCount++;

      if (specialCharacters[char]) {
        specialCount++;
        foundSpecialChars.add(char);
      }

      htmlResult += `${char} (U+${code.toString(16).toUpperCase().padStart(4, '0')}) `;
    }

    setResult(htmlResult);
    setStats({ total: charCount, special: specialCount });
    setSpecialCharsFound(foundSpecialChars);
  };

  const decodeMessages = () => {
    const found = [];
    
    for (const strategy of decodingStrategies) {
      const result = strategy.decode(inputText);
      if (result.found) {
        found.push({
          strategy: strategy.name,
          message: result.message,
          details: result.details
        });
      }
    }

    setDecodedMessages(found);
  };

  const clearText = () => {
    setInputText('');
    setResult('');
    setStats({ total: 0, special: 0 });
    setSpecialCharsFound(new Set());
    setDecodedMessages([]);
  };

  return (
    <div>
      <div className="bg-gray-900 bg-opacity-60 p-6 rounded-lg mb-8 border border-gray-800">
        <div className="terminal-line text-gray-400">SYSTEM: Unicode Character Analysis module loaded successfully</div>
        <div className="terminal-line text-gray-400">PROTOCOL: Detecting Unicode range U+E0000 to U+E007F and surrogate pairs</div>
        <div className="terminal-line text-gray-400">STATUS: Ready</div>
      </div>

      <div className="bg-gray-900 bg-opacity-60 p-6 rounded-lg mb-8 border border-gray-800">
        <h2 className="text-xl mb-4 flex items-center">
          <span className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full mr-4 text-sm">01</span>
          <FontAwesomeIcon icon={faStream} className="mr-2" />
          Input Text Data
        </h2>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full h-40 bg-gray-800 text-gray-300 p-4 rounded mb-4 font-mono"
          placeholder="Paste or type your text here for analysis..."
        />
        <div className="flex space-x-4">
          <button
            onClick={analyzeText}
            className="bg-gray-800 text-gray-300 px-4 py-2 rounded flex items-center hover:bg-gray-700"
          >
            <FontAwesomeIcon icon={faSearch} className="mr-2" />
            Analyze Text
          </button>
          <button
            onClick={clearText}
            className="bg-gray-800 text-gray-300 px-4 py-2 rounded flex items-center hover:bg-gray-700"
          >
            <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
            Clear
          </button>
        </div>
      </div>

      {result && (
        <>
          <h2 className="text-xl mb-4 flex items-center">
            <FontAwesomeIcon icon={faStream} className="mr-2" />
            Character Analysis
          </h2>
          <div className="bg-gray-800 p-4 rounded mb-8 font-mono whitespace-pre-wrap">
            {result}
          </div>

          <div className="bg-gray-900 bg-opacity-60 p-4 rounded mb-8">
            <div className="terminal-line">TOTAL CHARACTERS: {stats.total}</div>
            <div className="terminal-line">SPECIAL CHARACTERS: {stats.special}</div>
            <div className="terminal-line">CHARACTER ANALYSIS: Complete</div>
          </div>

          <h2 className="text-xl mb-4 flex items-center">
            <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
            Special Characters Detected
          </h2>
          <div className="bg-gray-800 p-4 rounded mb-8">
            {specialCharsFound.size > 0 ? (
              Array.from(specialCharsFound).map((char, index) => (
                <div key={index} className="mb-2">
                  <strong>U+{char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}</strong>:{' '}
                  {specialCharacters[char].name}{' '}
                  <span className="text-gray-500">({specialCharacters[char].category})</span>
                </div>
              ))
            ) : (
              <div className="terminal-line">No special characters detected in input stream.</div>
            )}
          </div>

          <h2 className="text-xl mb-4 flex items-center">
            <FontAwesomeIcon icon={faKey} className="mr-2" />
            Message Extraction
          </h2>
          <button
            onClick={decodeMessages}
            className="bg-gray-800 text-gray-300 px-4 py-2 rounded flex items-center hover:bg-gray-700 mb-4"
          >
            <FontAwesomeIcon icon={faKey} className="mr-2" />
            Extract Hidden Messages
          </button>

          {decodedMessages.length > 0 ? (
            decodedMessages.map((found, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded mb-4">
                <p className="font-bold mb-2">{found.strategy}:</p>
                <pre className="bg-gray-900 p-2 rounded mb-2">{found.message}</pre>
                <p className="text-sm text-gray-400">{found.details}</p>
              </div>
            ))
          ) : (
            <div className="terminal-line">Run extraction to decode potential hidden messages.</div>
          )}
        </>
      )}
    </div>
  );
};

export default Analyzer;