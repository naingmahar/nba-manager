// src/components/providers/ReduxProvider.tsx
'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { useRef } from 'react';
import { makeStore } from '@/store/store';

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<any>(null);

  if (!storeRef.current) {
    const store = makeStore();
    // store.__persistor = persistStore(store);
    storeRef.current = store;
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={storeRef.current.__persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
