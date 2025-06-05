import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faCopy, faKeyboard, faCodeBranch, faTerminal } from '@fortawesome/free-solid-svg-icons';
import { encodeMessage } from '../utils/unicode';

const Encoder: React.FC = () => {
  const [message, setMessage] = useState('Hello world! This is a secret message.');
  const [encodingMethod, setEncodingMethod] = useState<'tag_chars' | 'surrogate_pairs_notation' | 'actual_surrogates' | 'decorated'>('tag_chars');
  const [encodedMessage, setEncodedMessage] = useState('');

  const handleEncode = () => {
    if (!message) {
      setEncodedMessage('ERROR: No payload detected. Enter message to encode.');
      return;
    }

    const encoded = encodeMessage(message, encodingMethod);
    setEncodedMessage(encoded);
  };

  const copyToClipboard = async () => {
    if (!encodedMessage || encodedMessage.startsWith('ERROR')) return;

    try {
      await navigator.clipboard.writeText(encodedMessage);
      // Show success message (you might want to add a state for this)
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div>
      <div className="bg-gray-900 bg-opacity-60 p-6 rounded-lg mb-8 border border-gray-800">
        <div className="terminal-line text-gray-400">SYSTEM: Unicode Tag Encoder loaded successfully</div>
        <div className="terminal-line text-gray-400">PROTOCOL: Utilizing Unicode range U+E0000 to U+E007F for covert data transfer</div>
        <div className="terminal-line text-gray-400">STATUS: Ready</div>
      </div>

      <div className="bg-gray-900 bg-opacity-60 p-6 rounded-lg mb-8 border border-gray-800">
        <h2 className="text-xl mb-4 flex items-center">
          <span className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full mr-4 text-sm">01</span>
          <FontAwesomeIcon icon={faKeyboard} className="mr-2" />
          Enter Payload
        </h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-40 bg-gray-800 text-gray-300 p-4 rounded mb-4 font-mono"
          placeholder="Enter message to encode..."
        />
      </div>

      <div className="bg-gray-900 bg-opacity-60 p-6 rounded-lg mb-8 border border-gray-800">
        <h2 className="text-xl mb-4 flex items-center">
          <span className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full mr-4 text-sm">02</span>
          <FontAwesomeIcon icon={faCodeBranch} className="mr-2" />
          Select Encoding Vector
        </h2>
        <select
          value={encodingMethod}
          onChange={(e) => setEncodingMethod(e.target.value as any)}
          className="w-full max-w-md bg-gray-800 text-gray-300 p-3 rounded mb-4"
        >
          <option value="tag_chars">UNICODE_TAG [U+E0xxx]</option>
          <option value="surrogate_pairs_notation">SURROGATE_PAIR [U+DB40 U+DCxx]</option>
          <option value="actual_surrogates">PHANTOM_MODE [invisible]</option>
          <option value="decorated">MARKED_PAYLOAD [with delimiters]</option>
        </select>
      </div>

      <div className="bg-gray-900 bg-opacity-60 p-6 rounded-lg mb-8 border border-gray-800">
        <h2 className="text-xl mb-4 flex items-center">
          <span className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full mr-4 text-sm">03</span>
          <FontAwesomeIcon icon={faTerminal} className="mr-2" />
          Execute and Extract
        </h2>
        <div className="flex space-x-4">
          <button
            onClick={handleEncode}
            className="bg-gray-800 text-gray-300 px-4 py-2 rounded flex items-center hover:bg-gray-700"
          >
            <FontAwesomeIcon icon={faLock} className="mr-2" />
            Encode Payload
          </button>
          <button
            onClick={copyToClipboard}
            className="bg-gray-800 text-gray-300 px-4 py-2 rounded flex items-center hover:bg-gray-700"
          >
            <FontAwesomeIcon icon={faCopy} className="mr-2" />
            Copy to Clipboard
          </button>
        </div>
      </div>

      {encodedMessage && (
        <>
          <h3 className="text-xl mb-4">Encoded Output</h3>
          <div className="bg-gray-800 p-4 rounded mb-8 font-mono whitespace-pre-wrap">
            {encodedMessage}
          </div>
        </>
      )}
    </div>
  );
};

export default Encoder;