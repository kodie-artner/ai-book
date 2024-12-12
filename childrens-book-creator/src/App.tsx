import { useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Login } from './components/Login';
import { BookCreator } from './components/BookCreator';
import { APIConfig } from './types';

function App() {
  const [config, setConfig] = useState<APIConfig | null>(null);

  const handleLogin = (newConfig: APIConfig) => {
    setConfig(newConfig);
  };

  return (
    <ChakraProvider>
      {config ? (
        <BookCreator config={config} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </ChakraProvider>
  );
}

export default App;
