import { useState } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { Login } from './components/Login'
import { BookCreator } from './components/BookCreator'
import { APIConfig } from './types'

function App() {
  const [apiConfig, setApiConfig] = useState<APIConfig | null>(null)

  return (
    <ChakraProvider>
      {!apiConfig ? (
        <Login onApiKeySubmit={setApiConfig} />
      ) : (
        <BookCreator apiConfig={apiConfig} />
      )}
    </ChakraProvider>
  )
}

export default App
