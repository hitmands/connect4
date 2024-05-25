import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Connect4 } from './ui/application';

const outlet = document.getElementById('outlet')!;

createRoot(outlet).render(
  <StrictMode>
    <Connect4 />
  </StrictMode>,
);
