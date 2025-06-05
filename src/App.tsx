import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGhost, faSearchPlus, faKey, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Analyzer from './components/Analyzer';
import Encoder from './components/Encoder';
import MatrixBackground from './components/MatrixBackground';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'home' | 'analyzer' | 'encoder'>('home');
  const [tagLine, setTagLine] = useState('// Stealth Communication Suite v3.7');

  const handleSectionChange = (section: 'home' | 'analyzer' | 'encoder') => {
    setActiveSection(section);
    switch (section) {
      case 'home':
        setTagLine('// Stealth Communication Suite v3.7');
        break;
      case 'analyzer':
        setTagLine('// Stealth Analysis Module v3.7');
        break;
      case 'encoder':
        setTagLine('// Stealth Communication Protocol v3.7');
        break;
    }
  };

  return (
    <>
      <MatrixBackground />
      <div className="container mx-auto px-4 min-h-screen text-gray-300">
        <header className="flex items-center justify-between py-5 border-b border-gray-800 mb-8">
          <div className="flex items-center">
            <span className="text-2xl mr-4 text-gray-300">
              <FontAwesomeIcon icon={faGhost} />
            </span>
            <h1 className="text-3xl font-bold tracking-wider text-gray-300">GLYPH</h1>
            <span className="ml-4 text-sm italic text-gray-600">{tagLine}</span>
          </div>
        </header>

        <nav className="mb-8">
          <button
            onClick={() => handleSectionChange('home')}
            className={`mr-6 ${activeSection === 'home' ? 'text-gray-300 border-b-2 border-gray-300' : 'text-gray-600'}`}
          >
            Home
          </button>
          <button
            onClick={() => handleSectionChange('analyzer')}
            className={`mr-6 ${activeSection === 'analyzer' ? 'text-gray-300 border-b-2 border-gray-300' : 'text-gray-600'}`}
          >
            Character Analyzer
          </button>
          <button
            onClick={() => handleSectionChange('encoder')}
            className={`mr-6 ${activeSection === 'encoder' ? 'text-gray-300 border-b-2 border-gray-300' : 'text-gray-600'}`}
          >
            Message Encoder
          </button>
        </nav>

        {activeSection === 'home' && (
          <div>
            <div className="bg-gray-900 bg-opacity-60 p-6 rounded-lg mb-8 border border-gray-800">
              <div className="terminal-line text-gray-400">SYSTEM: Unicode Steganography Suite loaded successfully</div>
              <div className="terminal-line text-gray-400">PROTOCOL: Utilizing Unicode range U+E0000 to U+E007F for covert data transfer</div>
              <div className="terminal-line text-gray-400">STATUS: Ready</div>
            </div>

            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Unicode Steganography Tools</h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Advanced toolkit for encoding, analyzing and decoding messages using non-standard Unicode characters for covert communication.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-900 bg-opacity-60 p-8 rounded-lg border border-gray-800">
                <h2 className="text-2xl mb-4 flex items-center">
                  <FontAwesomeIcon icon={faSearchPlus} className="mr-4" />
                  Character Analyzer
                </h2>
                <p className="text-gray-400 mb-4">
                  Identify and visualize non-standard, invisible, or special Unicode characters in text.
                </p>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center text-gray-400">
                    <span className="mr-2">•</span>
                    Detect invisible characters and code points
                  </li>
                  <li className="flex items-center text-gray-400">
                    <span className="mr-2">•</span>
                    View detailed character metadata and properties
                  </li>
                  <li className="flex items-center text-gray-400">
                    <span className="mr-2">•</span>
                    Extract hidden messages from encoded text
                  </li>
                </ul>
                <button
                  onClick={() => handleSectionChange('analyzer')}
                  className="bg-gray-800 text-gray-300 px-6 py-3 rounded border border-gray-700 hover:bg-gray-700 transition-colors"
                >
                  Launch Analyzer
                </button>
              </div>

              <div className="bg-gray-900 bg-opacity-60 p-8 rounded-lg border border-gray-800">
                <h2 className="text-2xl mb-4 flex items-center">
                  <FontAwesomeIcon icon={faKey} className="mr-4" />
                  Message Encoder
                </h2>
                <p className="text-gray-400 mb-4">
                  Hide messages using Unicode tag characters and other steganography techniques.
                </p>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center text-gray-400">
                    <span className="mr-2">•</span>
                    Multiple encoding vectors for optimal transmission
                  </li>
                  <li className="flex items-center text-gray-400">
                    <span className="mr-2">•</span>
                    Generate invisible payload for maximum stealth
                  </li>
                  <li className="flex items-center text-gray-400">
                    <span className="mr-2">•</span>
                    Create deployment-ready encoded text
                  </li>
                </ul>
                <button
                  onClick={() => handleSectionChange('encoder')}
                  className="bg-gray-800 text-gray-300 px-6 py-3 rounded border border-gray-700 hover:bg-gray-700 transition-colors"
                >
                  Launch Encoder
                </button>
              </div>
            </div>

            <div className="mt-8 bg-gray-900 bg-opacity-60 p-8 rounded-lg border border-gray-800">
              <h2 className="text-2xl mb-4 flex items-center">
                <FontAwesomeIcon icon={faInfoCircle} className="mr-4" />
                About Unicode Steganography
              </h2>
              <p className="text-gray-400 mb-4">
                Unicode steganography leverages invisible or visually indistinguishable characters within the Unicode standard
                to embed covert information within normal-appearing text.
              </p>
              <p className="text-gray-400 mb-4">
                The primary vector utilizes Unicode tag characters (U+E0000 to U+E007F) or their surrogate pair representations.
                While originally designed for language tagging metadata, their invisible rendering makes them ideal for
                information concealment.
              </p>
              <p className="text-gray-400">
                This toolkit enables both the creation of steganographic payloads and the detection of concealed messages
                in suspicious text streams. All operations execute client-side with zero server transmission for maximum
                operational security.
              </p>
            </div>
          </div>
        )}

        {activeSection === 'analyzer' && <Analyzer />}
        {activeSection === 'encoder' && <Encoder />}

        <footer className="mt-12 py-6 border-t border-gray-800 text-center text-sm text-gray-600">
          GLYPH Suite • Unicode Steganography Tools • Open Source • Zero Server Footprint
        </footer>
      </div>
    </>
  );
};

export default App;