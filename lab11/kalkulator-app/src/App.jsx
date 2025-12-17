import React, { useState, useEffect } from 'react';

const FONT_SIZES = {
  small: '0.8em',
  medium: '1em',
  large: '1.2em'
};


const AppHeader = ({ authorName = "Mateusz Kabała", onFontSizeChange, currentSize }) => {
  return (
    <header style={{ 
        borderBottom: '2px solid #333', 
        padding: '10px 20px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
    }}>
      <h1 style={{ margin: 0, fontSize: '1.5em' }}>
        Aplikacja Kalkulator - Autor: **{authorName }**
      </h1>

      <div>
        <span style={{ marginRight: '10px' }}>Zmień rozmiar:</span>
        <span 
          onClick={() => onFontSizeChange('small')} 
          style={{ 
            fontSize: FONT_SIZES.small, 
            cursor: 'pointer', 
            marginRight: '15px', 
            fontWeight: currentSize === 'small' ? 'bold' : 'normal',
            border: currentSize === 'small' ? '1px solid #333' : 'none',
            padding: '2px 4px'
          }}
        >A</span>
        
        <span 
          onClick={() => onFontSizeChange('medium')} 
          style={{ 
            fontSize: FONT_SIZES.medium, 
            cursor: 'pointer', 
            marginRight: '15px', 
            fontWeight: currentSize === 'medium' ? 'bold' : 'normal',
            border: currentSize === 'medium' ? '1px solid #333' : 'none',
            padding: '2px 4px'
          }}
        >A</span>
        
        <span 
          onClick={() => onFontSizeChange('large')} 
          style={{ 
            fontSize: FONT_SIZES.large, 
            cursor: 'pointer',
            fontWeight: currentSize === 'large' ? 'bold' : 'normal',
            border: currentSize === 'large' ? '1px solid #333' : 'none',
            padding: '2px 4px'
          }}
        >A</span>
      </div>
    </header>
  );
};

const AppActionButton = ({ label, onClick, disabled }) => {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      style={{ margin: '5px', padding: '10px 20px', cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      {label}
    </button>
  );
};

const AppCalculationHistory = ({ history, onRestore }) => {
  if (history.length === 0) return <p>Brak historii działań.</p>;

  return (
    <div style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
      <h3>Historia działań</h3>
      <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'inherit' }}>
        <thead>
          <tr>
            <th>#</th>
            <th>A</th>
            <th>B</th>
            <th>Operacja</th>
            <th>Wynik</th>
            <th>Porównanie</th>
            <th>Akcja</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.a}</td>
              <td>{item.b}</td>
              <td>{item.operation}</td>
              <td>{item.result}</td>
              <td>{item.comparison}</td>
              <td>
                <button onClick={() => onRestore(index)} style={{ fontSize: 'inherit' }}>
                  Przywróć ten stan
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AppCalculator = ({ fontSizeStyle }) => {
  const [numA, setNumA] = useState('');
  const [numB, setNumB] = useState('');

  const [result, setResult] = useState('');
  
  const [comparisonMsg, setComparisonMsg] = useState('');
  
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (numA === '' || numB === '') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setComparisonMsg('');
      return;
    }

    const valA = parseFloat(numA);
    const valB = parseFloat(numB);

    if (isNaN(valA) || isNaN(valB)) {
      setComparisonMsg('Wprowadź poprawne liczby');
    } else if (valA > valB) {
      setComparisonMsg('Liczba A jest większa od liczby B');
    } else if (valA < valB) {
      setComparisonMsg('Liczba A jest mniejsza od liczby B');
    } else {
      setComparisonMsg('Liczba A jest równa liczbie B');
    }
  }, [numA, numB]);

  const handleCalculation = (operation) => {
    if (numA === '' || numB === '') {
        alert("Wypełnij oba pola!");
        return;
    }

    const valA = parseFloat(numA);
    const valB = parseFloat(numB);

    if (isNaN(valA) || isNaN(valB)) {
        alert("Wprowadź poprawne wartości liczbowe!");
        return;
    }
    
    if (operation === '/' && valB === 0) {
      alert("Nie można dzielić przez 0!");
      return;
    }

    let calcResult = 0;
    switch (operation) {
      case '+': calcResult = valA + valB; break;
      case '-': calcResult = valA - valB; break;
      case '*': calcResult = valA * valB; break;
      case '/': calcResult = valA / valB; break;
      default: return;
    }

    setResult(calcResult);

    const currentComparison = comparisonMsg; 
    const newHistoryItem = {
      id: Date.now(), 
      a: numA,
      b: numB,
      operation: operation,
      result: calcResult,
      comparison: currentComparison
    };

    setHistory([...history, newHistoryItem]);
  };

  const handleRestore = (index) => {
    const itemToRestore = history[index];
    
    setNumA(itemToRestore.a.toString());
    setNumB(itemToRestore.b.toString());
    setResult(itemToRestore.result);

    const newHistory = history.slice(0, index + 1);
    setHistory(newHistory);
  };

  const isInputEmpty = numA === '' || numB === '' || isNaN(parseFloat(numA)) || isNaN(parseFloat(numB));

  return (
    <div 
        style={{ 
            border: '1px solid #ddd', 
            padding: '20px', 
            maxWidth: '600px', 
            margin: '0 auto', 
            fontSize: fontSizeStyle 
        }}
    >
      <h2>Kalkulator</h2>
      
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block' }}>Etykieta A:
          <input 
            type="number" 
            value={numA} 
            onChange={(e) => setNumA(e.target.value)} 
            style={{ marginLeft: '10px', fontSize: 'inherit' }}
          />
        </label>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block' }}>Etykieta B:
          <input 
            type="number" 
            value={numB} 
            onChange={(e) => setNumB(e.target.value)} 
            style={{ marginLeft: '10px', fontSize: 'inherit' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <AppActionButton label="Dodaj (+)" onClick={() => handleCalculation('+')} disabled={isInputEmpty} />
        <AppActionButton label="Odejmij (-)" onClick={() => handleCalculation('-')} disabled={isInputEmpty} />
        <AppActionButton label="Mnóż (*)" onClick={() => handleCalculation('*')} disabled={isInputEmpty} />
        <AppActionButton label="Dziel (/)" onClick={() => handleCalculation('/')} disabled={isInputEmpty} />
      </div>

      <div style={{ marginBottom: '10px', padding: '10px', background: '#f0f0f0' }}>
        <strong>Wynik działania: </strong> 
        <span>{result !== '' ? result : '-'}</span>
      </div>

      <div style={{ marginBottom: '20px', padding: '10px', background: '#e6f7ff', border: '1px solid #91d5ff' }}>
        <strong>Status porównania: </strong>
        <span>{comparisonMsg || '-'}</span>
      </div>
      <AppCalculationHistory history={history} onRestore={handleRestore} />
    </div>
  );
};

const App = () => {
    const [fontSizeKey, setFontSizeKey] = useState('medium'); 
    const fontSizeStyle = FONT_SIZES[fontSizeKey]; 
    
    const handleFontSizeChange = (key) => {
        setFontSizeKey(key);
    };

    return (
        <div className="App">
            <AppHeader 
                authorName="[Mateusz Kabała]" 
                onFontSizeChange={handleFontSizeChange}
                currentSize={fontSizeKey}
            />
            <AppCalculator fontSizeStyle={fontSizeStyle} />
        </div>
    );
};

export default App;