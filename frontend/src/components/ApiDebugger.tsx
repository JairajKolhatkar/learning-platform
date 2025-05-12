import React, { useState, useEffect } from 'react';

const ApiDebugger: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [testedUrls, setTestedUrls] = useState<{url: string, success: boolean}[]>([]);
  const [workingUrl, setWorkingUrl] = useState<string | null>(null);

  useEffect(() => {
    const testUrls = [
      'http://localhost:4000/hello',
      'http://localhost:4000/api/debug',
      'http://localhost:8888/test',
      'http://127.0.0.1:4000/api/debug',
      'http://127.0.0.1:8888/test'
    ];
    
    const testAllUrls = async () => {
      const results: {url: string, success: boolean}[] = [];
      let foundWorkingUrl = false;
      
      for (const url of testUrls) {
        try {
          console.log(`ApiDebugger: Testing URL ${url}...`);
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);
          
          const response = await fetch(url, { 
            signal: controller.signal,
            mode: 'cors'
          });
          
          clearTimeout(timeoutId);
          
          const success = response.ok;
          results.push({ url, success });
          
          if (success && !foundWorkingUrl) {
            foundWorkingUrl = true;
            const data = await response.json();
            console.log(`ApiDebugger: Found working URL: ${url}`, data);
            setApiResponse(data);
            setWorkingUrl(url);
            setApiStatus('success');
          }
        } catch (error: any) {
          console.error(`ApiDebugger: Error testing ${url}:`, error);
          results.push({ url, success: false });
          
          // If this is the last URL and we still haven't found a working URL
          if (url === testUrls[testUrls.length - 1] && !foundWorkingUrl) {
            setErrorMessage(`Failed to connect to any API endpoint. Last error: ${error.message}`);
            setApiStatus('error');
          }
        }
      }
      
      setTestedUrls(results);
      
      if (!foundWorkingUrl) {
        setApiStatus('error');
      }
    };

    testAllUrls();
  }, []);

  const handleRetry = () => {
    setApiStatus('loading');
    setTestedUrls([]);
    setWorkingUrl(null);
    window.location.reload();
  };

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '10px', 
      right: '10px', 
      background: apiStatus === 'success' ? '#e6ffe6' : '#ffebeb',
      padding: '10px',
      borderRadius: '5px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      zIndex: 9999,
      maxWidth: '400px',
      maxHeight: '80vh',
      overflow: 'auto'
    }}>
      <h3 style={{ margin: '0 0 10px 0' }}>API Connection Status</h3>
      
      {apiStatus === 'loading' && <p>Testing API connections...</p>}
      
      {apiStatus === 'success' && (
        <div>
          <p style={{ color: 'green', fontWeight: 'bold' }}>✅ Connected to API</p>
          <p>Working URL: {workingUrl}</p>
          {apiResponse?.mongodb && (
            <p>MongoDB: {apiResponse.mongodb.connected ? 'Connected' : 'Disconnected'}</p>
          )}
          
          <details>
            <summary>Connection Details</summary>
            <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
              {testedUrls.map((result, index) => (
                <li key={index} style={{ color: result.success ? 'green' : 'red' }}>
                  {result.success ? '✅' : '❌'} {result.url}
                </li>
              ))}
            </ul>
          </details>
        </div>
      )}
      
      {apiStatus === 'error' && (
        <div>
          <p style={{ color: 'red', fontWeight: 'bold' }}>❌ API Connection Failed</p>
          <p>{errorMessage}</p>
          <p>Possible causes:</p>
          <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
            <li>Backend server not running</li>
            <li>Network/firewall blocking connection</li>
            <li>CORS policy restrictions</li>
          </ul>
          
          <details>
            <summary>Tested URLs</summary>
            <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
              {testedUrls.map((result, index) => (
                <li key={index} style={{ color: result.success ? 'green' : 'red' }}>
                  {result.success ? '✅' : '❌'} {result.url}
                </li>
              ))}
            </ul>
          </details>
          
          <button 
            onClick={handleRetry} 
            style={{ padding: '5px 10px', marginTop: '5px' }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default ApiDebugger; 