import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { BASE_URL } from './processing/constants';
import { RouterApp } from './router-app';
import './style/index.scss';

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <BrowserRouter basename={BASE_URL}>
      <Routes>
        <Route path="*" element={<RouterApp />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
