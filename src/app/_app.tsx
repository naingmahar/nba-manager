import '@/styles/globals.css';
import React, { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { useStore } from 'react-redux';
import { AppStore, wrapper } from '../store/store';
// import { wrapper, AppStore } from '@/store/store'; // Import typed store wrapper

// Define a type for the store which includes the custom __persistor property
interface CustomAppStore extends AppStore {
    __persistor?: any;
}

function MyApp({ Component, pageProps }: AppProps) {
  // Get the Redux store instance from the context provided by next-redux-wrapper
  const store = useStore() as CustomAppStore;
  
  // State to handle client-side mounting (avoids hydration errors with PersistGate)
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Render a simple loading state initially to prevent hydration mismatch 
    // while Redux-Persist is setting up on the client side.
    return <Component {...pageProps} />; 
  }

  return (
    <Provider store={store}>
      {/* PersistGate waits until the persisted state has been retrieved and rehydrated 
        before rendering the app components. This ensures state persistence on reload.
      */}
      <PersistGate loading={null} persistor={store.__persistor}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

// Wrap the app component with the Next.js Redux wrapper
export default wrapper.withRedux(MyApp);