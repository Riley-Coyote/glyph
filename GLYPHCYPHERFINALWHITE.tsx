import React, { useState, useEffect, useRef } from 'react';

const GlyphSuite = () => {
  // State for active section and UI
  const [activeSection, setActiveSection] = useState('home-section');
  const [statusMessage, setStatusMessage] = useState({ type: 'info', text: 'System ready' });
  const [hoveredElement, setHoveredElement] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  
  // Encoder states
  const [plainText, setPlainText] = useState('Hello world! This is a secret message.');
  const [encodedText, setEncodedText] = useState('');
  const [encodingMethod, setEncodingMethod] = useState('actual_surrogates');
  const [glyphDelimiter, setGlyphDelimiter] = useState('⟁✴⇌𓂀🜇');
  const [customDelimitersEnabled, setCustomDelimitersEnabled] = useState(false);
  const [openingDelimiter, setOpeningDelimiter] = useState('⊰•-✧-•⦑');
  const [closingDelimiter, setClosingDelimiter] = useState('⦒•-✧-•⊱');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  
  // Decoder states
  const [inputText, setInputText] = useState('');
  const [decodedText, setDecodedText] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [statsResult, setStatsResult] = useState('');
  const [charInfo, setCharInfo] = useState('');
  
  // Analyzer tab states
  const [activeTab, setActiveTab] = useState('decodeTab');
  const [analyzerInputText, setAnalyzerInputText] = useState('');
  const [messageToEncode, setMessageToEncode] = useState('');
  const [analyzerEncodingMethod, setAnalyzerEncodingMethod] = useState('tag_chars');
  const [analyzerCustomDelimitersEnabled, setAnalyzerCustomDelimitersEnabled] = useState(false);
  const [analyzerOpeningDelimiter, setAnalyzerOpeningDelimiter] = useState('⊰•-✧-•⦑');
  const [analyzerClosingDelimiter, setAnalyzerClosingDelimiter] = useState('⦒•-✧-•⊱');
  const [analyzerSelectedPresetIndex, setAnalyzerSelectedPresetIndex] = useState(0);
  const [analyzerEncodedMessage, setAnalyzerEncodedMessage] = useState('');
  const [analyzerDecodedMessage, setAnalyzerDecodedMessage] = useState('');
  
  // Matrix canvas
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Delimiter presets
  const delimiterPresets = [
    { name: "Alchemical Basic", opening: "⚗", closing: "⚗", description: "Alchemical apparatus" },
    { name: "Elements", opening: "🜄", closing: "🜁", description: "Air and Water symbols" },
    { name: "Atomic", opening: "⚛", closing: "⚛", description: "Atom symbol" },
    { name: "Quantum Wave", opening: "Ψ", closing: "Ψ", description: "Psi (Wave Function)" },
    { name: "Quantum Brackets", opening: "⟨", closing: "⟩", description: "Bra-Ket notation" },
    { name: "Alchemical Elements", opening: "🜃🜄", closing: "🜁🜂", description: "Fire/Air and Water/Earth" },
    { name: "Quantum Field", opening: "∮", closing: "∰", description: "Contour and Volume Integrals" },
    { name: "Planck-Tensor", opening: "ℏ", closing: "⊗", description: "Planck constant and Tensor product" },
    { name: "Planets", opening: "♅", closing: "♇", description: "Uranus and Pluto" },
    { name: "Uncertainty", opening: "Δ", closing: "∇", description: "Delta and Nabla" }
  ];

  // Special characters mapping
  const specialCharacters = {
    '\u200B': { name: 'ZERO WIDTH SPACE', category: 'Invisible Separator' },
    '\u200C': { name: 'ZERO WIDTH NON-JOINER', category: 'Invisible Separator' },
    '\u200D': { name: 'ZERO WIDTH JOINER', category: 'Invisible Separator' },
    '\uFEFF': { name: 'ZERO WIDTH NO-BREAK SPACE (BOM)', category: 'Invisible Separator' },
    '\u0009': { name: 'HORIZONTAL TAB', category: 'Whitespace' },
    '\u000A': { name: 'LINE FEED', category: 'Whitespace' },
    '\u000B': { name: 'VERTICAL TAB', category: 'Whitespace' },
    '\u000C': { name: 'FORM FEED', category: 'Whitespace' },
    '\u000D': { name: 'CARRIAGE RETURN', category: 'Whitespace' },
    '\u0020': { name: 'SPACE', category: 'Whitespace' },
    '\u00A0': { name: 'NO-BREAK SPACE', category: 'Whitespace' },
    // ... Many more special characters could be added here ...
  };

  // Theme toggle function
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Get theme-based colors
  const getThemeColors = () => {
    return {
      bgColor: darkMode ? 'bg-[#000000]' : 'bg-[#f5f5f5]',
      textColor: darkMode ? 'text-[#a0a0a0]' : 'text-[#333333]',
      headingColor: darkMode ? 'text-[#c4c4c4]' : 'text-[#222222]',
      accentColor: darkMode ? 'text-[#00c6ff]' : 'text-[#3a7bd5]',
      panelBg: darkMode ? 'bg-[rgba(5,5,5,0.7)]' : 'bg-[rgba(255,255,255,0.8)]',
      borderColor: darkMode ? 'border-[#111111]' : 'border-[#dddddd]',
      inputBg: darkMode ? 'bg-[#030303]' : 'bg-[#ffffff]',
      buttonBg: darkMode ? 'bg-[#050505]' : 'bg-[#f0f0f0]',
      buttonHoverBg: darkMode ? 'hover:bg-[#080808]' : 'hover:bg-[#e8e8e8]',
      infoPanelBg: darkMode ? 'bg-[rgba(10,10,10,0.5)]' : 'bg-[rgba(240,240,240,0.7)]',
      glowEffect: darkMode ? 'shadow-[0_0_15px_rgba(80,170,255,0.25)]' : 'shadow-[0_0_10px_rgba(58,123,213,0.15)]',
      gradientBorder: darkMode 
        ? 'bg-gradient-to-r from-[#4a00e0] via-[#7a00ff] to-[#00c6ff]' 
        : 'bg-gradient-to-r from-[#3a7bd5] via-[#5a93d5] to-[#78c6ff]'
    };
  };

  // Get colors based on current theme
  const colors = getThemeColors();

  // Matrix effect initialization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const chars = "01";
    const columns = Math.floor(width / 20);
    const drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -100));
    
    const drawMatrix = () => {
      if (darkMode) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, width, height);
        
        // Add subtle blue glow effect for some characters
        if (hoveredElement) {
          ctx.fillStyle = "#00c6ff04";
        } else {
          ctx.fillStyle = "#20202004";
        }
        ctx.font = "15px 'Share Tech Mono'";
        
        for (let i = 0; i < drops.length; i++) {
          const text = chars[Math.floor(Math.random() * chars.length)];
          
          // Add occasional glowing effect
          if (Math.random() > 0.997 && hoveredElement) {
            ctx.fillStyle = "rgba(0, 198, 255, 0.2)";
            ctx.fillText(text, i * 20, drops[i] * 20);
            ctx.fillStyle = "#20202004";
          } else {
            ctx.fillText(text, i * 20, drops[i] * 20);
          }
          
          if (drops[i] * 20 > height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          
          drops[i]++;
        }
      } else {
        // Light mode - clear the canvas or draw very subtle matrix
        ctx.fillStyle = "rgba(245, 245, 245, 0.95)";
        ctx.fillRect(0, 0, width, height);
        
        ctx.fillStyle = "#33333301";
        ctx.font = "15px 'Share Tech Mono'";
        
        for (let i = 0; i < drops.length; i++) {
          const text = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(text, i * 20, drops[i] * 20);
          
          if (drops[i] * 20 > height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          
          drops[i]++;
        }
      }
      
      animationFrameRef.current = requestAnimationFrame(drawMatrix);
    };
    
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    animationFrameRef.current = requestAnimationFrame(drawMatrix);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [hoveredElement, darkMode]);

  // Encoding functions
  function encodeWithTagChars(msg) {
    return [...msg].map(c => {
      const code = c.charCodeAt(0);
      return code < 128 
        ? `U+E00${code.toString(16).padStart(2, '0').toUpperCase()}`
        : c;
    }).join(' ');
  }

  function encodeWithSurrogatePairNotation(msg) {
    let out = '';
    [...msg].forEach((c, i) => {
      const code = c.charCodeAt(0);
      if (code < 128) {
        const hex = code.toString(16).padStart(2, '0').toUpperCase();
        out += `56128|U+DB40 56${hex}|U+DC${hex}` + (i < msg.length - 1 ? ' ' : '');
      } else {
        out += c + ' ';
      }
    });
    return out.trim();
  }

  function encodeWithActualSurrogates(msg) {
    return [...msg].map(c => {
      const code = c.charCodeAt(0);
      return code < 128 
        ? String.fromCharCode(0xDB40) + String.fromCharCode(0xDC00 + code) 
        : c;
    }).join('');
  }

  function encodeWithDecoration(msg, opening, closing) {
    // Default delimiters if not provided
    opening = opening || '⊰•-✧-•⦑';
    closing = closing || '⦒•-✧-•⊱';
    
    // Create the surrogate pairs first
    const surrogateEncoded = encodeWithActualSurrogates(msg);
    
    // Add decorative borders
    return `${opening}${surrogateEncoded}${closing}`;
  }

  // Unified decoder function
  function unifiedStegoDecode(text) {
    let out = "";
    
    // 1. Decode real surrogate pairs (0xDB40/0xDCxx)
    for (let i = 0; i < text.length - 1; i++) {
      const hi = text.charCodeAt(i);
      const lo = text.charCodeAt(i + 1);
      
      if (hi === 0xDB40 && lo >= 0xDC00 && lo <= 0xDC7F) {
        out += String.fromCharCode(lo - 0xDC00);
        i++;
      }
    }
    
    // 2: decode surrogate-pair notation
    const noted = [...text.matchAll(/U\+DC([0-7][0-9A-Fa-f]{2})/g)];
    if (noted.length) {
      for (const m of noted) {
        out += String.fromCharCode(parseInt(m[1], 16));
      }
    }
    
    // 3: decode direct tag characters
    for (let i = 0; i < text.length; i++) {
      let cp = text.codePointAt(i);
      if (cp >= 0xE0000 && cp <= 0xE007F) {
        out += String.fromCharCode(cp - 0xE0000);
        if (cp > 0xFFFF) i++;
      }
    }
    
    return out;
  }

  // Enhanced character analysis
  const analyzeText = () => {
    const text = analyzerInputText;
    if (!text) {
      setAnalysisResult('<p>Please enter some text to analyze.</p>');
      setStatsResult('');
      return;
    }
    
    let htmlResult = '';
    let charCount = 0;
    let specialCount = 0;
    let foundSpecialChars = new Set();
    let surrogatePairCount = 0;
    
    // Process each character
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const code = char.charCodeAt(0);
      charCount++;
      
      let charClass = '';
      let charTitle = '';
      
      // Check if it's a surrogate pair start
      let isSurrogatePair = false;
      if (i < text.length - 1 && code >= 0xD800 && code <= 0xDBFF) {
        const nextCode = text.charCodeAt(i + 1);
        if (nextCode >= 0xDC00 && nextCode <= 0xDFFF) {
          // This is a surrogate pair
          surrogatePairCount++;
          isSurrogatePair = true;
          
          // Calculate the actual code point
          const codePoint = ((code - 0xD800) * 0x400) + (nextCode - 0xDC00) + 0x10000;
          
          // Highlight surrogate pairs specially
          charClass = 'highlight special-char';
          charTitle = `data-desc="Surrogate Pair: U+${code.toString(16).toUpperCase().padStart(4, '0')} U+${nextCode.toString(16).toUpperCase().padStart(4, '0')} → U+${codePoint.toString(16).toUpperCase().padStart(5, '0')}"`;
          
          // Display the surrogate pair with its info
          htmlResult += `<span class="${charClass}" ${charTitle}>${escapeHTML(char)}${escapeHTML(text[i+1])}</span>`;
          
          // Display character code
          htmlResult += `<span class="char-info">U+${codePoint.toString(16).toUpperCase().padStart(5, '0')}</span>`;
          
          // Skip the second part of the surrogate pair
          i++;
          continue;
        }
      }
      
      // Check if it's a special character
      if (specialCharacters[char]) {
        specialCount++;
        foundSpecialChars.add(char);
        const info = specialCharacters[char];
        charClass = 'highlight special-char';
        charTitle = `data-desc="U+${code.toString(16).toUpperCase().padStart(4, '0')} ${info.name}"`;
      }
      
      // Display the character with its info
      htmlResult += `<span class="${charClass}" ${charTitle}>${escapeHTML(char)}</span>`;
      
      // Display character code
      htmlResult += `<span class="char-info">${code}|U+${code.toString(16).toUpperCase().padStart(4, '0')}</span>`;
    }
    
    // Set statistics
    setStatsResult(`
      <div class="terminal-line">TOTAL CHARACTERS: ${charCount}</div>
      <div class="terminal-line">SPECIAL CHARACTERS: ${specialCount}</div>
      <div class="terminal-line">SURROGATE PAIRS: ${surrogatePairCount}</div>
      <div class="terminal-line">CHARACTER ANALYSIS: Complete</div>
    `);
    
    // Set the analyzed text
    setAnalysisResult(htmlResult);
    
    // Display information about found special characters
    let charInfoHTML = '';
    if (foundSpecialChars.size > 0) {
      charInfoHTML = '<ul style="list-style-type: none; padding-left: 5px;">';
      foundSpecialChars.forEach(char => {
        const info = specialCharacters[char];
        const code = char.charCodeAt(0);
        charInfoHTML += `
          <li style="margin-bottom: 8px; position: relative; padding-left: 25px;">
            <span style="position: absolute; left: 0; color: var(--active-color);">⊢</span>
            <strong>U+${code.toString(16).toUpperCase().padStart(4, '0')}</strong>: 
            ${info.name} 
            <span class="category">(${info.category})</span>
          </li>
        `;
      });
      charInfoHTML += '</ul>';
    } else {
      charInfoHTML = '<div class="terminal-line">No special characters detected in input stream.</div>';
    }
    
    setCharInfo(charInfoHTML);
  };

  // Function to decode hidden messages
  const decodeMessages = () => {
    const text = analyzerInputText;
    
    if (!text) {
      setAnalyzerDecodedMessage('<div class="terminal-line">ERROR: No text available for analysis. Please input text first.</div>');
      return;
    }
    
    const decoded = unifiedStegoDecode(text);
    
    if (decoded) {
      const htmlResult = `
        <h3><i class="fas fa-exclamation-triangle"></i> Hidden Messages Detected</h3>
        <div class="message-found">
          <p><strong>Steganography Decoder:</strong></p>
          <pre>${escapeHTML(decoded)}</pre>
          <p><small>Successfully decoded hidden message using unified stego decoder.</small></p>
        </div>
      `;
      
      setAnalyzerDecodedMessage(htmlResult);
    } else {
      setAnalyzerDecodedMessage('<div class="terminal-line">SCAN COMPLETE: No hidden messages detected in the analyzed text.</div>');
    }
  };

  // Function to encode messages in analyzer
  const encodeMessageInAnalyzer = () => {
    if (!messageToEncode) {
      setAnalyzerEncodedMessage('<div class="terminal-line">ERROR: No payload detected. Enter message to encode.</div>');
      return;
    }
    
    let encodedText = '';
    let openingDelim = analyzerOpeningDelimiter;
    let closingDelim = analyzerClosingDelimiter;
    
    // If not using custom delimiters and decorated method is selected
    if (analyzerEncodingMethod === 'decorated' && !analyzerCustomDelimitersEnabled) {
      const selectedPreset = delimiterPresets[analyzerSelectedPresetIndex];
      openingDelim = selectedPreset.opening;
      closingDelim = selectedPreset.closing;
    }
    
    switch (analyzerEncodingMethod) {
      case 'tag_chars':
        encodedText = encodeWithTagChars(messageToEncode);
        break;
      case 'surrogate_pairs_notation':
        encodedText = encodeWithSurrogatePairNotation(messageToEncode);
        break;
      case 'actual_surrogates':
        encodedText = encodeWithActualSurrogates(messageToEncode);
        break;
      case 'decorated':
        encodedText = encodeWithDecoration(messageToEncode, openingDelim, closingDelim);
        break;
    }
    
    // Set the encoded message
    setAnalyzerEncodedMessage(`
      <div class="terminal-line">ENCODING COMPLETE: Vector [${getEncodingMethodDescription(analyzerEncodingMethod)}]</div>
      <pre style="margin-top: 10px;">${escapeHTML(encodedText)}</pre>
    `);
  };

  // Main encoder function
  const encodeMessage = () => {
    if (!plainText) {
      setStatusMessage({ type: 'warning', text: 'Please enter ASCII payload to encode' });
      return;
    }
    
    try {
      let result = '';
      let openingDelim = openingDelimiter;
      let closingDelim = closingDelimiter;
      
      // If not using custom delimiters and decorated method is selected
      if (encodingMethod === 'decorated' && !customDelimitersEnabled) {
        const selectedPreset = delimiterPresets[selectedPresetIndex];
        openingDelim = selectedPreset.opening;
        closingDelim = selectedPreset.closing;
      }
      
      switch(encodingMethod) {
        case 'tag_chars':
          result = encodeWithTagChars(plainText);
          break;
        case 'surrogate_pairs_notation':
          result = encodeWithSurrogatePairNotation(plainText);
          break;
        case 'actual_surrogates':
          result = encodeWithActualSurrogates(plainText);
          break;
        case 'decorated':
          result = encodeWithDecoration(plainText, openingDelim, closingDelim);
          break;
      }
      
      setEncodedText(result);
      setStatusMessage({ 
        type: 'success', 
        text: `Successfully encoded ${plainText.length} ASCII characters using ${getEncodingMethodDescription(encodingMethod)}` 
      });
    } catch (e) {
      setStatusMessage({ type: 'error', text: `Encoding error: ${e.message}` });
    }
  };

  // Function to decode input
  const decodeMessage = () => {
    if (!inputText) {
      setStatusMessage({ type: 'warning', text: 'Please enter encoded text to decode' });
      return;
    }
    
    try {
      const result = unifiedStegoDecode(inputText);
      
      if (!result) {
        setStatusMessage({ type: 'info', text: 'No hidden ASCII content detected in input' });
        setDecodedText('');
      } else {
        setDecodedText(result);
        setStatusMessage({ 
          type: 'success', 
          text: `Successfully extracted ${result.length} ASCII characters` 
        });
      }
    } catch (e) {
      setStatusMessage({ type: 'error', text: `Decoding error: ${e.message}` });
    }
  };

  // Copy encoded text to clipboard
  const copyToClipboard = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
      
      // Show success message
      setStatusMessage({
        type: 'success',
        text: 'Payload copied to clipboard. Transfer complete.'
      });
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setStatusMessage({ type: 'info', text: 'System ready' });
      }, 3000);
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: 'Failed to copy to clipboard'
      });
    }
    
    document.body.removeChild(textarea);
  };

  // Helper for encoding method description
  const getEncodingMethodDescription = (method) => {
    switch (method) {
      case 'tag_chars': return 'UNICODE_TAG';
      case 'surrogate_pairs_notation': return 'SURROGATE_PAIR';
      case 'actual_surrogates': return 'PHANTOM_MODE';
      case 'decorated': return 'MARKED_PAYLOAD';
      default: return method;
    }
  };

  // Helper to escape HTML
  const escapeHTML = (str) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  // Set active tab
  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  // Clear text in analyzer
  const clearAnalyzerText = () => {
    setAnalyzerInputText('');
    setAnalysisResult('');
    setStatsResult('');
    setCharInfo('');
    setAnalyzerDecodedMessage('');
    setAnalyzerEncodedMessage('');
  };

  // Sample text for analyzer
  const loadSampleText = () => {
    const sampleText = `This is a sample​ text with\u200B zero-width\u200C spaces\u200D and\u00A0non-breaking\u2002spaces.
It also includes some\ttabs and\rcarriage returns.

Example 1 - Standard Unicode Tag Characters:
U+E0048 U+E0065 U+E006C U+E006C U+E006F

Example 2 - Actual surrogate pairs (should be visible when analyzed):
⚗󠁈󠁥󠁬󠁬󠁯󠀠󠁷󠁯󠁲󠁬󠁤󠀡󠀠󠁔󠁨󠁩󠁳󠀠󠁩󠁳󠀠󠁡󠀠󠁳󠁥󠁣󠁲󠁥󠁴󠁳󠁵󠁩󠁴󠁥⚗

Example 3 - Quantum delimited message:
⟨󠁔󠁨󠁥󠀠󠁧󠁬󠁹󠁰󠁨󠀠󠁤󠁥󠁣󠁯󠁤󠁥󠁲󠀠󠁩󠁳󠀠󠁣󠁯󠁭󠁰󠁬󠁥󠁴󠁥⟩`;
    
    setAnalyzerInputText(sampleText);
  };

  // Create the UI
  return (
    <div className={`${colors.bgColor} ${colors.textColor} min-h-screen font-mono transition-colors duration-300`}>
      {/* Matrix canvas background */}
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-5"
      />
        
      <div className="container max-w-6xl mx-auto p-5 relative">
        {/* Header */}
        <header className={`flex items-center justify-between py-5 border-b ${colors.borderColor} mb-8 transition-colors duration-300`}>
          <div className="flex items-center">
            <span className={`text-3xl ${colors.textColor} mr-4 transition-colors duration-300`}>
              <i className="fas fa-ghost"></i>
            </span>
            <h1 className={`text-2xl font-bold ${colors.headingColor} tracking-wider m-0 ${darkMode ? 'shadow-[0_0_15px_rgba(100,220,255,0.2)]' : ''} transition-all duration-300`}>
              GLYPH
            </h1>
            <span className="text-sm text-[#505050] italic ml-4" id="tagLine">
              {activeSection === 'home-section' && "// Enhanced Steganography Suite v4.0"}
              {activeSection === 'analyzer-section' && "// Stealth Analysis Module v4.0"}
              {activeSection === 'encoder-section' && "// Stealth Communication Protocol v4.0"}
            </span>
          </div>
          
          {/* Theme toggle */}
          <div className="flex items-center">
            <button 
              onClick={toggleTheme}
              className={`${colors.buttonBg} ${colors.textColor} border ${colors.borderColor} rounded-full p-2 transition-all duration-300 ${colors.buttonHoverBg} hover:${colors.glowEffect}`}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <i className="fas fa-sun"></i>
              ) : (
                <i className="fas fa-moon"></i>
              )}
            </button>
          </div>
        </header>

        {/* Navigation */}
        <div className="mb-5">
          <a 
            onClick={() => setActiveSection('home-section')} 
            className={`mr-4 ${colors.textColor} no-underline text-sm py-1 px-2 relative cursor-pointer transition-all duration-300 rounded ${activeSection === 'home-section' ? `${darkMode ? 'text-[#d0d0d0]' : 'text-[#222222]'} after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:${colors.gradientBorder}` : `hover:${darkMode ? 'text-[#d0d0d0]' : 'text-[#222222]'} ${colors.buttonHoverBg} hover:${colors.glowEffect}`}`}
            onMouseEnter={() => setHoveredElement('home-nav')}
            onMouseLeave={() => setHoveredElement(null)}
          >
            Home
          </a>
          <a 
            onClick={() => setActiveSection('analyzer-section')} 
            className={`mr-4 ${colors.textColor} no-underline text-sm py-1 px-2 relative cursor-pointer transition-all duration-300 rounded ${activeSection === 'analyzer-section' ? `${darkMode ? 'text-[#d0d0d0]' : 'text-[#222222]'} after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:${colors.gradientBorder}` : `hover:${darkMode ? 'text-[#d0d0d0]' : 'text-[#222222]'} ${colors.buttonHoverBg} hover:${colors.glowEffect}`}`}
            onMouseEnter={() => setHoveredElement('analyzer-nav')}
            onMouseLeave={() => setHoveredElement(null)}
          >
            Character Analyzer
          </a>
          <a 
            onClick={() => setActiveSection('encoder-section')} 
            className={`mr-4 ${colors.textColor} no-underline text-sm py-1 px-2 relative cursor-pointer transition-all duration-300 rounded ${activeSection === 'encoder-section' ? `${darkMode ? 'text-[#d0d0d0]' : 'text-[#222222]'} after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:${colors.gradientBorder}` : `hover:${darkMode ? 'text-[#d0d0d0]' : 'text-[#222222]'} ${colors.buttonHoverBg} hover:${colors.glowEffect}`}`}
            onMouseEnter={() => setHoveredElement('encoder-nav')}
            onMouseLeave={() => setHoveredElement(null)}
          >
            Message Encoder
          </a>
        </div>
        
        {/* Home Section */}
        {activeSection === 'home-section' && (
          <section>
            <div className={`${colors.textColor} ${colors.infoPanelBg} p-4 rounded mb-8 border-l-4 ${colors.borderColor} ${darkMode ? 'shadow-[0_0_15px_rgba(0,0,0,0.8)] hover:shadow-[0_0_20px_rgba(80,170,255,0.2)]' : 'shadow-md hover:shadow-lg'} transition-all duration-500`}
              onMouseEnter={() => setHoveredElement('system-panel')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <div className="relative pl-4 mb-2">
                <span className={`absolute left-0 ${hoveredElement === 'system-panel' ? (darkMode ? 'text-[#00c6ff]' : 'text-[#3a7bd5]') : (darkMode ? 'text-[#c4c4c4]' : 'text-[#444444]')} transition-colors duration-300`}>&gt;</span>
                SYSTEM: Enhanced Unicode Steganography Suite loaded successfully
              </div>
              <div className="relative pl-4 mb-2">
                <span className={`absolute left-0 ${hoveredElement === 'system-panel' ? (darkMode ? 'text-[#00c6ff]' : 'text-[#3a7bd5]') : (darkMode ? 'text-[#c4c4c4]' : 'text-[#444444]')} transition-colors duration-300`}>&gt;</span>
                PROTOCOL: Utilizing Unicode range U+E0000 to U+E007F for covert data transfer
              </div>
              <div className="relative pl-4 mb-2">
                <span className={`absolute left-0 ${hoveredElement === 'system-panel' ? (darkMode ? 'text-[#00c6ff]' : 'text-[#3a7bd5]') : (darkMode ? 'text-[#c4c4c4]' : 'text-[#444444]')} transition-colors duration-300`}>&gt;</span>
                STATUS: <span className={`after:content-['|'] after:${darkMode ? 'text-[#00c6ff]' : 'text-[#3a7bd5]'} after:animate-[blink_1s_infinite]`}>Ready</span>
              </div>
            </div>

            <div className="text-center mb-10">
              <h1 className={`text-2xl ${colors.headingColor} font-normal transition-colors duration-300`}>Enhanced Unicode Steganography Tools</h1>
              <p className={`text-base ${colors.textColor} max-w-2xl mx-auto mt-4 transition-colors duration-300`}>
                Advanced toolkit for encoding, analyzing and decoding messages using non-standard Unicode characters with improved alchemical and quantum-themed delimiters.
              </p>
            </div>

            <div className="flex flex-wrap gap-5">
              <div className={`flex-1 min-w-[300px] ${colors.panelBg} border ${colors.borderColor} rounded p-6 shadow-md relative overflow-hidden transition-all duration-500 hover:transform hover:-translate-y-1 hover:${colors.glowEffect} backdrop-blur-md`}
                onMouseEnter={() => setHoveredElement('card-analyzer')}
                onMouseLeave={() => setHoveredElement(null)}
              >
                <div className={`absolute top-0 left-0 right-0 h-[1px] ${hoveredElement === 'card-analyzer' ? colors.gradientBorder : (darkMode ? 'bg-gradient-to-r from-[#111111] via-[#333333] to-[#111111]' : 'bg-gradient-to-r from-[#dddddd] via-[#ffffff] to-[#dddddd]')} transition-all duration-500`}></div>
                <h2 className={`text-xl ${colors.headingColor} mt-0 flex items-center transition-colors duration-300`}>
                  <span className={`text-2xl ${hoveredElement === 'card-analyzer' ? (darkMode ? 'text-[#00c6ff]' : 'text-[#3a7bd5]') : (darkMode ? 'text-[#c4c4c4]' : 'text-[#555555]')} mr-4 ${darkMode ? 'shadow-[0_0_10px_rgba(80,170,255,0.2)]' : ''} transition-colors duration-300`}>
                    <i className="fas fa-search-plus"></i>
                  </span>
                  Character Analyzer
                </h2>
                <p className="my-4">Identify and visualize non-standard, invisible, or special Unicode characters in text.</p>
                <ul className="my-4 pl-5 list-none">
                  <li className="relative pl-4 mb-2">
                    <span className={`absolute left-0 ${hoveredElement === 'card-analyzer' ? (darkMode ? 'text-[#00c6ff]' : 'text-[#3a7bd5]') : (darkMode ? 'text-[#c4c4c4]' : 'text-[#555555]')} transition-colors duration-300`}>•</span>
                    Detect invisible characters and code points
                  </li>
                  <li className="relative pl-4 mb-2">
                    <span className={`absolute left-0 ${hoveredElement === 'card-analyzer' ? (darkMode ? 'text-[#00c6ff]' : 'text-[#3a7bd5]') : (darkMode ? 'text-[#c4c4c4]' : 'text-[#555555]')} transition-colors duration-300`}>•</span>
                    View detailed character metadata and properties
                  </li>
                  <li className="relative pl-4 mb-2">
                    <span className={`absolute left-0 ${hoveredElement === 'card-analyzer' ? (darkMode ? 'text-[#00c6ff]' : 'text-[#3a7bd5]') : (darkMode ? 'text-[#c4c4c4]' : 'text-[#555555]')} transition-colors duration-300`}>•</span>
                    Extract hidden messages from encoded text
                  </li>
                </ul>
                <a 
                  onClick={() => setActiveSection('analyzer-section')}
                  className={`inline-block ${colors.buttonBg} ${colors.headingColor} no-underline py-2 px-5 border ${colors.borderColor} rounded mt-5 transition-all duration-300 ${colors.buttonHoverBg} hover:${colors.glowEffect} hover:border-${darkMode ? '[#333333]' : '[#aaaaaa]'} cursor-pointer inline-flex items-center text-sm`}
                >
                  <i className="fas fa-terminal mr-2"></i>
                  Launch Analyzer
                </a>
              </div>

              <div className={`flex-1 min-w-[300px] ${colors.panelBg} border ${colors.borderColor} rounded p-6 shadow-md relative overflow-hidden transition-all duration-500 hover:transform hover:-translate-y-1 hover:${colors.glowEffect} backdrop-blur-md`}
                onMouseEnter={() => setHoveredElement('card-encoder')}
                onMouseLeave={() => setHoveredElement(null)}
              >
                <div className={`absolute top-0 left-0 right-0 h-[1px] ${hoveredElement === 'card-encoder' ? colors.gradientBorder : (darkMode ? 'bg-gradient-to-r from-[#111111] via-[#333333] to-[#111111]' : 'bg-gradient-to-r from-[#dddddd] via-[#ffffff] to-[#dddddd]')} transition-all duration-500`}></div>
                <h2 className={`text-xl ${colors.headingColor} mt-0 flex items-center transition-colors duration-300`}>
                  <span className={`text-2xl ${hoveredElement === 'card-encoder' ? (darkMode ? 'text-[#00c6ff]' : 'text-[#3a7bd5]') : (darkMode ? 'text-[#c4c4c4]' : 'text-[#555555]')} mr-4 ${darkMode ? 'shadow-[0_0_10px_rgba(80,170,255,0.2)]' : ''} transition-colors duration-300`}>
                    <i className="fas fa-key"></i>
                  </span>
                  Message Encoder
                </h2>
                <p className="my-4">Hide messages using Unicode tag characters and other steganography techniques.</p>
                <ul className="my-4 pl-5 list-none">
                  <li className="relative pl-4 mb-2">
                    <span className={`absolute left-0 ${hoveredElement === 'card-encoder' ? (darkMode ? 'text-[#00c6ff]' : 'text-[#3a7bd5]') : (darkMode ? 'text-[#c4c4c4]' : 'text-[#555555]')} transition-colors duration-300`}>•</span>
                    Multiple encoding vectors for optimal transmission
                  </li>
                  <li className="relative pl-4 mb-2">
                    <span className={`absolute left-0 ${hoveredElement === 'card-encoder' ? (darkMode ? 'text-[#00c6ff]' : 'text-[#3a7bd5]') : (darkMode ? 'text-[#c4c4c4]' : 'text-[#555555]')} transition-colors duration-300`}>•</span>
                    Customizable alchemical and quantum delimiters
                  </li>
                  <li className="relative pl-4 mb-2">
                    <span className={`absolute left-0 ${hoveredElement === 'card-encoder' ? (darkMode ? 'text-[#00c6ff]' : 'text-[#3a7bd5]') : (darkMode ? 'text-[#c4c4c4]' : 'text-[#555555]')} transition-colors duration-300`}>•</span>
                    Generate invisible payload for maximum stealth
                  </li>
                </ul>
                <a 
                  onClick={() => setActiveSection('encoder-section')}
                  className={`inline-block ${colors.buttonBg} ${colors.headingColor} no-underline py-2 px-5 border ${colors.borderColor} rounded mt-5 transition-all duration-300 ${colors.buttonHoverBg} hover:${colors.glowEffect} hover:border-${darkMode ? '[#333333]' : '[#aaaaaa]'} cursor-pointer inline-flex items-center text-sm`}
                >
                  <i className="fas fa-lock"></i>
                  Launch Encoder
                </a>
              </div>
            </div>

            <div className="mt-5">
              <div className={`w-full ${colors.panelBg} border ${colors.borderColor} rounded p-6 shadow-md relative overflow-hidden backdrop-blur-md transition-all duration-500 hover:${colors.glowEffect}`}
                onMouseEnter={() => setHoveredElement('about-panel')}
                onMouseLeave={() => setHoveredElement(null)}
              >
                <div className={`absolute top-0 left-0 right-0 h-[1px] ${hoveredElement === 'about-panel' ? colors.gradientBorder : (darkMode ? 'bg-gradient-to-r from-[#111111] via-[#333333] to-[#111111]' : 'bg-gradient-to-r from-[#dddddd] via-[#ffffff] to-[#dddddd]')} transition-all duration-500`}></div>
                <h2 className={`text-xl ${colors.headingColor} mt-0 flex items-center transition-colors duration-300`}>
                  <span className={`text-2xl ${hoveredElement === 'about-panel' ? (darkMode ? 'text-[#00c6ff]' : 'text-[#3a7bd5]') : (darkMode ? 'text-[#c4c4c4]' : 'text-[#555555]')} mr-4 ${darkMode ? 'shadow-[0_0_10px_rgba(80,170,255,0.2)]' : ''} transition-colors duration-300`}>
                    <i className="fas fa-info-circle"></i>
                  </span>
                  About Unicode Steganography
                </h2>
                <p className="my-4">Unicode steganography leverages invisible or visually indistinguishable characters within the Unicode standard to embed covert information within normal-appearing text.</p>
                <p className="my-4">The primary vector utilizes Unicode tag characters (U+E0000 to U+E007F) or their surrogate pair representations. While originally designed for language tagging metadata, their invisible rendering makes them ideal for information concealment.</p>
                <p className="my-4">This enhanced toolkit adds support for custom delimiters using alchemical and quantum symbols, allowing for more robust message encapsulation and improved extraction.</p>
              </div>
            </div>
          </section>
        )}
        
        {/* Analyzer Section */}
        {activeSection === 'analyzer-section' && (
          <section>
            <div className={`${colors.textColor} ${colors.infoPanelBg} p-4 rounded mb-8 border-l-4 ${colors.borderColor} ${darkMode ? 'shadow-[0_0_15px_rgba(0,0,0,0.8)] hover:shadow-[0_0_20px_rgba(80,170,255,0.2)]' : 'shadow-md hover:shadow-lg'} transition-all duration-500`}
              onMouseEnter={() => setHoveredElement('analyzer-panel')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <div className="relative pl-4 mb-2">
                <span className={`absolute left-0 ${hoveredElement === 'analyzer-panel' ? (darkMode ? 'text-[#00c6ff]' : 'text-[#3a7bd5]') : (darkMode ? 'text-[#c4c4c4]' : 'text-[#444444]')} transition-colors duration-300`}>&gt;</span>
                SYSTEM: Unicode Character Analysis module loaded successfully
              </div>
              <div className="relative pl-4 mb-2">
                <span className={`absolute left-0 ${hoveredElement === 'analyzer-panel' ? (darkMode ? 'text-[#00c6ff]' : 'text-[#3a7bd5]') : (darkMode ? 'text-[#c4c4c4]' : 'text-[#444444]')} transition-colors duration-300`}>&gt;</span>
                PROTOCOL: Detecting Unicode range U+E0000 to U+E007F and surrogate pairs
              </div>
              <div className="relative pl-4 mb-2">
                <span className={`absolute left-0 ${hoveredElement === 'analyzer-panel' ? (darkMode ? 'text-[#00c6ff]' : 'text-[#3a7bd5]') : (darkMode ? 'text-[#c4c4c4]' : 'text-[#444444]')} transition-colors duration-300`}>&gt;</span>
                STATUS: <span className={`after:content-['|'] after:${darkMode ? 'text-[#00c6ff]' : 'text-[#3a7bd5]'} after:animate-[blink_1s_infinite]`}>Ready</span>
              </div>
            </div>
            
            <div className={`${colors.panelBg} border ${colors.borderColor} rounded p-5 mb-8 relative overflow-hidden backdrop-blur-md transition-all duration-500 hover:${colors.glowEffect}`}
              onMouseEnter={() => setHoveredElement('input-panel')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <div className={`absolute top-0 left-0 right-0 h-[1px] ${hoveredElement === 'input-panel' ? colors.gradientBorder : (darkMode ? 'bg-gradient-to-r from-[#111111] via-[#333333] to-[#111111]' : 'bg-gradient-to-r from-[#dddddd] via-[#ffffff] to-[#dddddd]')} transition-all duration-500`}></div>
              <h2 className={`text-xl ${colors.headingColor} mb-4 flex items-center transition-colors duration-300`}>
                <span className={`flex items-center justify-center w-7 h-7 ${colors.buttonBg} border ${colors.borderColor} rounded-full mr-2 text-sm ${colors.textColor}`}>01</span>
                <i className={`fas fa-file-alt mr-2 ${hoveredElement === 'input-panel' ? (darkMode ? 'text-[#00c6ff]' : 'text-[#3a7bd5]') : ''} transition-colors duration-300`}></i>Input Text Data
              </h2>
              <textarea 
                value={analyzerInputText}
                onChange={(e) => setAnalyzerInputText(e.target.value)}
                className={`w-full min-h-40 p-4 my-2 ${colors.inputBg} ${colors.textColor} border ${colors.borderColor} rounded resize-y font-mono focus:outline-none focus:border-${darkMode ? '[#333333]' : '[#aaaaaa]'} focus:${colors.glowEffect}`}
                placeholder="Paste or type your text here for analysis..."
              />
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={analyzeText}
                  className={`${colors.buttonBg} ${colors.headingColor} border ${colors.borderColor} rounded py-2 px-5 cursor-pointer mb-5 transition-all duration-300 ${colors.buttonHoverBg} hover:${colors.glowEffect} hover:border-${darkMode ? '[#333333]' : '[#aaaaaa]'} inline-flex items-center text-sm`}
                >
                  <i className="fas fa-search mr-2"></i>Analyze Text
                </button>
                <button
                  onClick={loadSampleText}
                  className={`${colors.buttonBg} ${colors.headingColor} border ${colors.borderColor} rounded py-2 px-5 cursor-pointer mb-5 transition-all duration-300 ${colors.buttonHoverBg} hover:${colors.glowEffect} hover:border-${darkMode ? '[#333333]' : '[#aaaaaa]'} inline-flex items-center text-sm`}
                >
                  <i className="fas fa-vial mr-2"></i>Load Sample
                </button>
                <button
                  onClick={clearAnalyzerText}
                  className={`${colors.buttonBg} ${colors.headingColor} border ${colors.borderColor} rounded py-2 px-5 cursor-pointer mb-5 transition-all duration-300 ${colors.buttonHoverBg} hover:${colors.glowEffect} hover:border-${darkMode ? '[#333333]' : '[#aaaaaa]'} inline-flex items-center text-sm`}
                >
                  <i className="fas fa-trash-alt mr-2"></i>Clear
                </button>
              </div>
            </div>

            <h2 className={`text-xl ${colors.headingColor} mb-4 flex items-center transition-colors duration-300`}>
              <i className="fas fa-stream mr-2"></i>Character Analysis
            </h2>
            <div
              className={`${colors.buttonBg} ${colors.headingColor} p-4 border ${colors.borderColor} rounded mb-5 font-mono whitespace-pre-wrap break-words max-h-[300px] overflow-y-auto relative leading-7 transition-colors duration-300`}
              dangerouslySetInnerHTML={{ __html: analysisResult || '// Analyzed characters will appear here' }}
            />
            
            <div
              className={`my-4 text-sm ${colors.textColor} ${colors.infoPanelBg} p-3 rounded border-l-3 ${colors.borderColor} transition-colors duration-300`}
              dangerouslySetInnerHTML={{ __html: statsResult }}
            />
            
            <h2 className={`text-xl ${colors.headingColor} mb-4 flex items-center transition-colors duration-300`}>
              <i className="fas fa-info-circle mr-2"></i>Special Characters Detected
            </h2>
            <div
              className={`${colors.buttonBg} ${colors.headingColor} p-4 border ${colors.borderColor} rounded mb-5 font-mono whitespace-pre-wrap break-words max-h-[300px] overflow-y-auto relative transition-colors duration-300`}
              dangerouslySetInnerHTML={{ __html: charInfo || '// Special characters will be listed here' }}
            />
            
            <h2 className={`text-xl ${colors.headingColor} mb-4 flex items-center transition-colors duration-300`}>
              <i className="fas fa-key mr-2"></i>Message Extraction
            </h2>
            <div className={`flex border-b ${colors.borderColor} mb-5 transition-colors duration-300`}>
              <button 
                className={`${colors.buttonBg} ${colors.textColor} border ${colors.borderColor} border-b-0 py-2 px-5 cursor-pointer transition-all duration-200 mb-[-1px] rounded-t-md ${activeTab === 'decodeTab' ? `${darkMode ? 'bg-[#0a0a0a]' : 'bg-[#ffffff]'} ${colors.headingColor} border-b border-b-${darkMode ? '[#0a0a0a]' : '[#ffffff]'}` : ''}`}
                onClick={() => switchTab('decodeTab')}
              >
                Decode Messages
              </button>
              <button 
                className={`${colors.buttonBg} ${colors.textColor} border ${colors.borderColor} border-b-0 py-2 px-5 cursor-pointer transition-all duration-200 mb-[-1px] ml-1 rounded-t-md ${activeTab === 'encodeTab' ? `${darkMode ? 'bg-[#0a0a0a]' : 'bg-[#ffffff]'} ${colors.headingColor} border-b border-b-${darkMode ? '[#0a0a0a]' : '[#ffffff]'}` : ''}`}
                onClick={() => switchTab('encodeTab')}
              >
                Encode Messages
              </button>
            </div>
            
            {activeTab === 'decodeTab' && (
              <div className="py-5 px-1">
                <p>This module attempts to extract hidden ASCII messages from the analyzed text using multiple decoding vectors.</p>
                <button
                  onClick={decodeMessages}
                  className={`${colors.buttonBg} ${colors.headingColor} border ${colors.borderColor} rounded py-2 px-5 cursor-pointer my-5 transition-all duration-300 ${colors.buttonHoverBg} hover:${colors.glowEffect} hover:border-${darkMode ? '[#333333]' : '[#aaaaaa]'} inline-flex items-center text-sm`}
                >
                  <i className="fas fa-unlock-alt mr-2"></i>Extract Hidden Messages
                </button>
                <div
                  className={`${colors.buttonBg} ${colors.headingColor} p-4 border ${colors.borderColor} rounded mb-5 font-mono whitespace-pre-wrap break-words max-h-[300px] overflow-y-auto relative transition-colors duration-300`}
                  dangerouslySetInnerHTML={{ __html: analyzerDecodedMessage || '// Decoded messages will appear here' }}
                />
              </div>
            )}
            
            {activeTab === 'encodeTab' && (
              <div className="py-5 px-1">
                <p>Enter a message to encode using Unicode tag characters:</p>
                <textarea 
                  value={messageToEncode}
                  onChange={(e) => setMessageToEncode(e.target.value)}
                  className={`w-full min-h-[150px] p-4 my-4 ${colors.inputBg} ${colors.textColor} border ${colors.borderColor} rounded resize-y font-mono focus:outline-none focus:border-${darkMode ? '[#333333]' : '[#aaaaaa]'} focus:${colors.glowEffect}`}
                  placeholder="Enter message to encode..."
                />
                
                <div className="my-4">
                  <label htmlFor="encodingMethod" className="block mb-2">Encoding Vector:</label>
                  <select 
                    id="encodingMethod"
                    value={analyzerEncodingMethod}
                    onChange={(e) => {
                      setAnalyzerEncodingMethod(e.target.value);
                    }}
                    className={`py-3 px-4 rounded border ${colors.borderColor} ${colors.buttonBg} ${colors.textColor} font-mono mb-2 w-full max-w-[500px] text-sm appearance-none bg-[right_10px_center] bg-[length:16px] bg-no-repeat focus:outline-none focus:border-${darkMode ? '[#333333]' : '[#aaaaaa]'} focus:${colors.glowEffect}`}
                  >
                    <option value="tag_chars">UNICODE_TAG [U+E0xxx]</option>
                    <option value="surrogate_pairs_notation">SURROGATE_PAIR [U+DB40 U+DCxx]</option>
                    <option value="actual_surrogates">PHANTOM_MODE [invisible]</option>
                    <option value="decorated">MARKED_PAYLOAD [with delimiters]</option>
                  </select>
                </div>
                
                {analyzerEncodingMethod === 'decorated' && (
                  <div className="mt-4">
                    <h3 className={`text-base ${colors.headingColor} mb-4 flex items-center transition-colors duration-300`}>
                      <i className="fas fa-palette mr-2"></i>Delimiter Options
                    </h3>
                    <p>Choose from preset delimiter combinations or create your own:</p>
                    
                    <div className="flex flex-wrap gap-2 my-4">
                      {delimiterPresets.map((preset, index) => (
                        <div 
                          key={index}
                          className={`flex items-center py-2 px-4 ${colors.buttonBg} border ${colors.borderColor} rounded cursor-pointer transition-all duration-300 ${analyzerSelectedPresetIndex === index && !analyzerCustomDelimitersEnabled ? `${darkMode ? 'bg-[rgba(160,160,160,0.15)]' : 'bg-[rgba(58,123,213,0.1)]'} border-${darkMode ? '[#c4c4c4]' : '[#3a7bd5]'} ${colors.glowEffect}` : `${colors.buttonHoverBg} hover:border-${darkMode ? '[#333333]' : '[#aaaaaa]'}`}`}
                          onClick={() => {
                            setAnalyzerSelectedPresetIndex(index);
                            setAnalyzerCustomDelimitersEnabled(false);
                          }}
                        >
                          <span className="mr-2 text-base">{preset.opening}...{preset.closing}</span>
                          <span className="text-xs text-[#a0a0a0]">{preset.name}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4">
                      <label className="flex items-center cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={analyzerCustomDelimitersEnabled}
                          onChange={(e) => setAnalyzerCustomDelimitersEnabled(e.target.checked)}
                          className="mr-2"
                        /> 
                        Use custom delimiters
                      </label>
                      
                      {analyzerCustomDelimitersEnabled && (
                        <div className="flex gap-2 mt-4">
                          <input 
                            type="text"
                            value={analyzerOpeningDelimiter}
                            onChange={(e) => setAnalyzerOpeningDelimiter(e.target.value)}
                            placeholder="Opening delimiter"
                            maxLength={10}
                            className={`p-2 ${colors.inputBg} border ${colors.borderColor} rounded ${colors.textColor} font-mono flex-1 focus:outline-none focus:border-${darkMode ? '[#333333]' : '[#aaaaaa]'} focus:${colors.glowEffect}`}
                          />
                          <input 
                            type="text"
                            value={analyzerClosingDelimiter}
                            onChange={(e) => setAnalyzerClosingDelimiter(e.target.value)}
                            placeholder="Closing delimiter"
                            maxLength={10}
                            className={`p-2 ${colors.inputBg} border ${colors.borderColor} rounded ${colors.textColor} font-mono flex-1 focus:outline-none focus:border-${darkMode ? '[#333333]' : '[#aaaaaa]'} focus:${colors.glowEffect}`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    onClick={encodeMessageInAnalyzer}
                    className={`${colors.buttonBg} ${colors.headingColor} border ${colors.borderColor} rounded py-2 px-5 cursor-pointer my-2 transition-all duration-300 ${colors.buttonHoverBg} hover:${colors.glowEffect} hover:border-${darkMode ? '[#333333]' : '[#aaaaaa]'} inline-flex items-center text-sm`}
                  >
                    <i className="fas fa-lock mr-2"></i>Encode Message
                  </button>
                  <button
                    onClick={() => {
                      const preElement = document.querySelector("#analyzerEncodedMessage pre");
                      if (preElement) {
                        copyToClipboard(preElement.textContent);
                      }
                    }}
                    className={`${colors.buttonBg} ${colors.headingColor} border ${colors.borderColor} rounded py-2 px-5 cursor-pointer my-2 transition-all duration-300 ${colors.buttonHoverBg} hover:${colors.glowEffect} hover:border-${darkMode ? '[#333333]' : '[#aaaaaa]'} inline-flex items-center text-sm`}
                  >
                    <i className="fas fa-copy mr-2"></i>Copy to Clipboard
                  </button>
                </div>
                
                <div
                  id="analyzerEncodedMessage"
                  className={`${colors.buttonBg} ${colors.headingColor} p-4 border ${colors.borderColor} rounded my-5 font-mono whitespace-pre-wrap break-words max-h-[300px] overflow-y-auto relative transition-colors duration-300`}
                  dangerouslySetInnerHTML={{ __html: analyzerEncodedMessage || '// Encoded output will appear here' }}
                />
              </div>
            )}
            
            <div className={`mt-7 p-4 ${colors.infoPanelBg} rounded border-l-4 ${colors.borderColor} text-sm transition-colors duration-300`}>
              <h3 className={`text-base ${colors.headingColor} mb-4 flex items-center transition-colors duration-300`}>
                <i className="fas fa-shield-alt mr-2"></i>Unicode Covert Channel Technical Data
              </h3>
              <p className="mb-2">The analysis module detects and decodes the following steganographic vectors:</p>
              <ol className="pl-5 mb-2">
                <li className="mb-1"><strong className={`${colors.headingColor}`}>Direct Unicode Tag Characters:</strong> Range U+E0000 to U+E007F mapped to ASCII</li>
                <li className="mb-1"><strong className={`${colors.headingColor}`}>UTF-16 Surrogate Pairs:</strong> High surrogate U+DB40 combined with low surrogate U+DC00-U+DC7F</li>
                <li className="mb-1"><strong className={`${colors.headingColor}`}>Custom Delimited Messages:</strong> Supports alchemical and quantum symbol delimiters</li>
              </ol>
              <p className="mb-2">Decoding process:</p>
              <ol className="pl-5 mb-2">
                <li className="mb-1">Extract tag character or surrogate pair from input stream</li>
                <li className="mb-1">Apply offset subtraction (0xE0000 or 0xDC00)</li>
                <li className="mb-1">Convert resulting value to ASCII (0x00-0x7F range)</li>
                <li className="mb-1">For delimited messages, identify delimiter boundaries and extract payload</li>
              </ol>
            </div>
          </section>
        )}
        
        {/* Encoder Section */}
        {activeSection === 'encoder-section' && (
          <section>
            <div className="flex flex-col space-y-6">
              <div className={`${colors.textColor} ${colors.infoPanelBg} p-4 rounded mb-8 border-l-4 ${colors.borderColor} ${darkMode ? 'shadow-[0_0_15px_rgba(0,0,0,0.8)] hover:shadow-[0_0_20px_rgba(80,170,255,0.2)]' : 'shadow-md hover:shadow-lg'} transition-all duration-500`}
                onMouseEnter={() => setHoveredElement('encoder-panel')}
                onMouseLeave={() => setHoveredElement(null)}
              >
                <div className="relative pl-4 mb-2">
                  <span className={`absolute left-0 ${hoveredElement === 'encoder-panel' ? (darkMode ? 'text-[#00c6ff]' : 'text-[#3a7bd5]') : (darkMode ? 'text-[#c4c4c4]' : 'text-[#444444]')} transition-colors duration-300`}>&gt;</span>
                  SYSTEM: Enhanced Unicode Tag Encoder loaded successfully
                </div>
                <div className="relative pl-4 mb-2">
                  <span className={`absolute left-0 ${hoveredElement === 'encoder-panel' ? (darkMode ? 'text-[#00c6ff]' : 'text-[#3a7bd5]') : (darkMode ? 'text-[#c4c4c4]' : 'text-[#444444]')} transition-colors duration-300`}>&gt;</span>
                  PROTOCOL: Utilizing Unicode range U+E0000 to U+E007F for covert data transfer
                </div>
                <div className="relative pl-4 mb-2">
                  <span className={`absolute left-0 ${hoveredElement === 'encoder-panel' ? (darkMode ? 'text-[#00c6ff]' : 'text-[#3a7bd5]') : (darkMode ? 'text-[#c4c4c4]' : 'text-[#444444]')} transition-colors duration-300`}>&gt;</span>
                  STATUS: <span className={`${statusMessage.type === 'error' ? 'text-red-400' : statusMessage.type === 'success' ? (darkMode ? 'text-green-400' : 'text-green-600') : statusMessage.type === 'warning' ? (darkMode ? 'text-yellow-400' : 'text-yellow-600') : (darkMode ? 'text-[#c4c4c4]' : 'text-[#444444]')} after:content-['|'] after:${darkMode ? 'text-[#00c6ff]' : 'text-[#3a7bd5]'} after:animate-[blink_1s_infinite]`}>
                    {statusMessage.text}
                  </span>
                </div>
              </div>

              {/* Input Panel */}
              <div className={`${colors.panelBg} border ${colors.borderColor} rounded p-5 relative overflow-hidden backdrop-blur-md transition-all duration-500 hover:${colors.glowEffect}`}
                onMouseEnter={() => setHoveredElement('payload-panel')}
                onMouseLeave={() => setHoveredElement(null)}
              >
                <div className={`absolute top-0 left-0 right-0 h-[1px] ${hoveredElement === 'payload-panel' ? colors.gradientBorder : (darkMode ? 'bg-gradient-to-r from-[#111111] via-[#333333] to-[#111111]' : 'bg-gradient-to-r from-[#dddddd] via-[#ffffff] to-[#dddddd]')} transition-all duration-500`}></div>
                <h2 className={`text-xl ${colors.headingColor} mb-4 flex items-center transition-colors duration-300`}>
                  <span className={`flex items-center justify-center w-7 h-7 ${colors.buttonBg} border ${colors.borderColor} rounded-full mr-2 text-sm ${colors.textColor}`}>01</span>
                  <i className={`fas fa-keyboard mr-2 ${hoveredElement === 'payload-panel' ? (darkMode ? 'text-[#00c6ff]' : 'text-[#3a7bd5]') : ''} transition-colors duration-300`}></i>Enter Payload
                </h2>
                <textarea 
                  value={plainText}
                  onChange={(e) => setPlainText(e.target.value)}
                  className={`w-full min-h-[150px] p-4 ${colors.inputBg} ${colors.textColor} border ${colors.borderColor} rounded resize-y font-mono focus:outline-none focus:border-${darkMode ? '[#333333]' : '[#aaaaaa]'} focus:${colors.glowEffect}`}
                  placeholder="Enter message to encode..."
                />
              </div>

              {/* Encoding Options */}
              <div className={`${colors.panelBg} border ${colors.borderColor} rounded p-5 relative overflow-hidden backdrop-blur-md transition-all duration-500 hover:${colors.glowEffect}`}
                onMouseEnter={() => setHoveredElement('vector-panel')}
                onMouseLeave={() => setHoveredElement(null)}
              >
                <div className={`absolute top-0 left-0 right-0 h-[1px] ${hoveredElement === 'vector-panel' ? colors.gradientBorder : (darkMode ? 'bg-gradient-to-r from-[#111111] via-[#333333] to-[#111111]' : 'bg-gradient-to-r from-[#dddddd] via-[#ffffff] to-[#dddddd]')} transition-all duration-500`}></div>
                <h2 className={`text-xl ${colors.headingColor} mb-4 flex items-center transition-colors duration-300`}>
                  <span className={`flex items-center justify-center w-7 h-7 ${colors.buttonBg} border ${colors.borderColor} rounded-full mr-2 text-sm ${colors.textColor}`}>02</span>
                  <i className={`fas fa-code-branch mr-2 ${hoveredElement === 'vector-panel' ? (darkMode ? 'text-[#00c6ff]' : 'text-[#3a7bd5]') : ''} transition-colors duration-300`}></i>Select Encoding Vector
                </h2>
                <select 
                  value={encodingMethod}
                  onChange={(e) => setEncodingMethod(e.target.value)}
                  className={`py-3 px-4 rounded border ${colors.borderColor} ${colors.buttonBg} ${colors.textColor} font-mono my-2 w-full max-w-[500px] text-sm appearance-none bg-[right_10px_center] bg-[length:16px] bg-no-repeat focus:outline-none focus:border-${darkMode ? '[#333333]' : '[#aaaaaa]'} focus:${colors.glowEffect}`}
                >
                  <option value="tag_chars">UNICODE_TAG [U+E0xxx]</option>
                  <option value="surrogate_pairs_notation">SURROGATE_PAIR [notation]</option>
                  <option value="actual_surrogates">PHANTOM_MODE [invisible]</option>
                  <option value="decorated">MARKED_PAYLOAD [visible delimiter]</option>
                </select>

                {/* Method descriptions */}
                {encodingMethod === 'tag_chars' && (
                  <div className={`my-4 p-4 ${colors.infoPanelBg} border-l-3 ${colors.borderColor} text-sm transition-colors duration-300`}>
                    <p><strong className={`${colors.headingColor}`}>UNICODE_TAG [U+E0xxx]</strong></p>
                    <p>Encodes each character as a Unicode tag character in range U+E0000 to U+E007F. Optimal for data inspection but may have limited platform compatibility.</p>
                    <p>Syntax: <code className={`${darkMode ? 'bg-[rgba(15,15,15,0.8)]' : 'bg-[rgba(240,240,240,0.8)]'} py-1 px-2 rounded ${colors.headingColor} font-mono break-all transition-colors duration-300`}>U+E0048 U+E0065 U+E006C U+E006C U+E006F</code> → "Hello"</p>
                  </div>
                )}

                {encodingMethod === 'surrogate_pairs_notation' && (
                  <div className={`my-4 p-4 ${colors.infoPanelBg} border-l-3 ${colors.borderColor} text-sm transition-colors duration-300`}>
                    <p><strong className={`${colors.headingColor}`}>SURROGATE_PAIR [U+DB40 U+DCxx]</strong></p>
                    <p>Represents tag characters using UTF-16 surrogate pair notation. Enhances compatibility with legacy systems and improves persistence across network boundaries.</p>
                    <p>Syntax: <code className={`${darkMode ? 'bg-[rgba(15,15,15,0.8)]' : 'bg-[rgba(240,240,240,0.8)]'} py-1 px-2 rounded ${colors.headingColor} font-mono break-all transition-colors duration-300`}>56128|U+DB40 56360|U+DC48 56128|U+DB40 56357|U+DC65</code> → "He"</p>
                  </div>
                )}

                {encodingMethod === 'actual_surrogates' && (
                  <div className={`my-4 p-4 ${colors.infoPanelBg} border-l-3 ${colors.borderColor} text-sm transition-colors duration-300`}>
                    <p><strong className={`${colors.headingColor}`}>PHANTOM_MODE [invisible]</strong></p>
                    <p>Implements actual UTF-16 surrogate pairs rendered as invisible characters. Maximum stealth capability - payload exists but remains visually undetectable.</p>
                    <p>Warning: Payload will appear as empty space or zero-width elements in most environments.</p>
                  </div>
                )}

                {encodingMethod === 'decorated' && (
                  <div className={`my-4 p-4 ${colors.infoPanelBg} border-l-3 ${colors.borderColor} text-sm transition-colors duration-300`}>
                    <p><strong className={`${colors.headingColor}`}>MARKED_PAYLOAD [with delimiters]</strong></p>
                    <p>Deploys invisible surrogate pairs with visible delimiter sequences. Enhances payload identification while maintaining content protection.</p>
                    <p>Choose from alchemical, quantum, or custom delimiter patterns to encapsulate the hidden message.</p>
                  </div>
                )}
              </div>

              {/* Delimiter Options (only show if decorated is selected) */}
              {encodingMethod === 'decorated' && (
                <div className={`${colors.panelBg} border ${colors.borderColor} rounded p-5 relative overflow-hidden backdrop-blur-md transition-all duration-500 hover:${colors.glowEffect}`}
                  onMouseEnter={() => setHoveredElement('delimiter-panel')}
                  onMouseLeave={() => setHoveredElement(null)}
                >
                  <div className={`absolute top-0 left-0 right-0 h-[1px] ${hoveredElement === 'delimiter-panel' ? colors.gradientBorder : (darkMode ? 'bg-gradient-to-r from-[#111111] via-[#333333] to-[#111111]' : 'bg-gradient-to-r from-[#dddddd] via-[#ffffff] to-[#dddddd]')} transition-all duration-500`}></div>
                  <h2 className={`text-xl ${colors.headingColor} mb-4 flex items-center transition-colors duration-300`}>
                    <span className={`flex items-center justify-center w-7 h-7 ${colors.buttonBg} border ${colors.borderColor} rounded-full mr-2 text-sm ${colors.textColor}`}>03</span>
                    <i className={`fas fa-palette mr-2 ${hoveredElement === 'delimiter-panel' ? (darkMode ? 'text-[#00c6ff]' : 'text-[#3a7bd5]') : ''} transition-colors duration-300`}></i>Select Delimiters
                  </h2>
                  <p>Choose from preset delimiter combinations or create your own:</p>
                  
                  <div className="flex flex-wrap gap-2 my-4">
                    {delimiterPresets.map((preset, index) => (
                      <div 
                        key={index}
                        className={`flex items-center py-2 px-4 ${colors.buttonBg} border ${colors.borderColor} rounded cursor-pointer transition-all duration-300 ${selectedPresetIndex === index && !customDelimitersEnabled ? `${darkMode ? 'bg-[rgba(160,160,160,0.15)]' : 'bg-[rgba(58,123,213,0.1)]'} border-${darkMode ? '[#c4c4c4]' : '[#3a7bd5]'} ${colors.glowEffect}` : `${colors.buttonHoverBg} hover:border-${darkMode ? '[#333333]' : '[#aaaaaa]'}`}`}
                        onClick={() => {
                          setSelectedPresetIndex(index);
                          setCustomDelimitersEnabled(false);
                        }}
                      >
                        <span className="mr-2 text-base">{preset.opening}...{preset.closing}</span>
                        <span className="text-xs text-[#a0a0a0]">{preset.name}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={customDelimitersEnabled}
                        onChange={(e) => setCustomDelimitersEnabled(e.target.checked)}
                        className="mr-2"
                      /> 
                      Use custom delimiters
                    </label>
                    
                    {customDelimitersEnabled && (
                      <div className="flex gap-2 mt-4">
                        <input 
                          type="text"
                          value={openingDelimiter}
                          onChange={(e) => setOpeningDelimiter(e.target.value)}
                          placeholder="Opening delimiter"
                          maxLength={10}
                          className={`p-2 ${colors.inputBg} border ${colors.borderColor} rounded ${colors.textColor} font-mono flex-1 focus:outline-none focus:border-${darkMode ? '[#333333]' : '[#aaaaaa]'} focus:${colors.glowEffect}`}
                        />
                        <input 
                          type="text"
                          value={closingDelimiter}
                          onChange={(e) => setClosingDelimiter(e.target.value)}
                          placeholder="Closing delimiter"
                          maxLength={10}
                          className={`p-2 ${colors.inputBg} border ${colors.borderColor} rounded ${colors.textColor} font-mono flex-1 focus:outline-none focus:border-${darkMode ? '[#333333]' : '[#aaaaaa]'} focus:${colors.glowEffect}`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Execute Panel */}
              <div className={`${colors.panelBg} border ${colors.borderColor} rounded p-5 relative overflow-hidden backdrop-blur-md transition-all duration-500 hover:${colors.glowEffect}`}
                onMouseEnter={() => setHoveredElement('execute-panel')}
                onMouseLeave={() => setHoveredElement(null)}
              >
                <div className={`absolute top-0 left-0 right-0 h-[1px] ${hoveredElement === 'execute-panel' ? colors.gradientBorder : (darkMode ? 'bg-gradient-to-r from-[#111111] via-[#333333] to-[#111111]' : 'bg-gradient-to-r from-[#dddddd] via-[#ffffff] to-[#dddddd]')} transition-all duration-500`}></div>
                <h2 className={`text-xl ${colors.headingColor} mb-4 flex items-center transition-colors duration-300`}>
                  <span className={`flex items-center justify-center w-7 h-7 ${colors.buttonBg} border ${colors.borderColor} rounded-full mr-2 text-sm ${colors.textColor}`}>04</span>
                  <i className={`fas fa-terminal mr-2 ${hoveredElement === 'execute-panel' ? (darkMode ? 'text-[#00c6ff]' : 'text-[#3a7bd5]') : ''} transition-colors duration-300`}></i>Execute and Extract
                </h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={encodeMessage}
                    className={`${colors.buttonBg} ${colors.headingColor} border ${colors.borderColor} rounded py-2 px-5 cursor-pointer transition-all duration-300 ${colors.buttonHoverBg} hover:${colors.glowEffect} hover:border-${darkMode ? '[#333333]' : '[#aaaaaa]'} inline-flex items-center text-sm`}
                  >
                    <i className="fas fa-lock mr-2"></i>Encode Payload
                  </button>
                  <button
                    onClick={() => copyToClipboard(encodedText)}
                    className={`${colors.buttonBg} ${colors.headingColor} border ${colors.borderColor} rounded py-2 px-5 cursor-pointer transition-all duration-300 ${colors.buttonHoverBg} hover:${colors.glowEffect} hover:border-${darkMode ? '[#333333]' : '[#aaaaaa]'} inline-flex items-center text-sm`}
                  >
                    <i className="fas fa-copy mr-2"></i>Copy to Clipboard
                  </button>
                </div>
              </div>

              {/* Output Display */}
              <h3 className={`text-base ${colors.headingColor} mb-2 mt-4 flex items-center transition-colors duration-300`}>
                <i className="fas fa-code mr-2"></i>Encoded Output
              </h3>
              <div className={`${colors.buttonBg} ${colors.headingColor} p-4 border ${colors.borderColor} rounded mb-5 font-mono whitespace-pre-wrap break-words max-h-[300px] overflow-y-auto relative transition-colors duration-300`}>
                {encodedText || '// Encoded output will appear here'}
              </div>

              <div className={`mt-7 p-4 ${colors.infoPanelBg} rounded border-l-4 ${colors.borderColor} text-sm transition-colors duration-300`}>
                <h3 className={`text-base ${colors.headingColor} mb-2 flex items-center transition-colors duration-300`}>
                  <i className="fas fa-vial mr-2"></i>Technical Notes
                </h3>
                <p className="mb-2">The enhanced encoder now provides custom delimiter options using alchemical and quantum-themed symbols for improved message encapsulation.</p>
                <p className="mb-2">The decoder has been updated to recognize these custom delimiters when extracting hidden content.</p>
                <p className="mb-2">For maximum compatibility, ensure that both sender and receiver are using the same encoding vector and delimiter configuration.</p>
              </div>

              <h3 className={`text-base ${colors.headingColor} mb-2 mt-4 flex items-center transition-colors duration-300`}>
                <i className="fas fa-key mr-2"></i>Message Decoder
              </h3>
              <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className={`w-full min-h-[160px] p-4 my-2 ${colors.inputBg} ${colors.textColor} border ${colors.borderColor} rounded resize-y font-mono focus:outline-none focus:border-${darkMode ? '[#333333]' : '[#aaaaaa]'} focus:${colors.glowEffect}`}
                placeholder="Paste encoded text (surrogates / notation / tag chars)"
              />
              <button
                onClick={decodeMessage}
                className={`${colors.buttonBg} ${colors.headingColor} border ${colors.borderColor} rounded py-2 px-5 cursor-pointer my-4 transition-all duration-300 ${colors.buttonHoverBg} hover:${colors.glowEffect} hover:border-${darkMode ? '[#333333]' : '[#aaaaaa]'} inline-flex items-center text-sm`}
              >
                <i className="fas fa-unlock-alt mr-2"></i>Decode Message
              </button>
              <div className={`${colors.buttonBg} ${colors.headingColor} p-4 border ${colors.borderColor} rounded mb-5 font-mono whitespace-pre-wrap break-words max-h-[300px] overflow-y-auto relative transition-colors duration-300`}>
                {decodedText || '// Decoded output will appear here'}
              </div>
            </div>
          </section>
        )}
        
        {/* Footer */}
        <div className={`mt-12 pt-5 border-t ${colors.borderColor} text-[#404040] text-xs text-center transition-colors duration-300`}>
          GLYPH Suite • Enhanced Unicode Steganography Tools • v4.0 • Zero Server Footprint
        </div>
      </div>
    </div>
  );
};

export default GlyphSuite;