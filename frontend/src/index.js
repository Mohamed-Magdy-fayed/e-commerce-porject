import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { StoreProvider } from './context/store/StoreContext';

const container = document.getElementById('root')
const root = ReactDOM.createRoot(container)
root.render(
    <BrowserRouter>
        <StoreProvider>
            <App />
        </StoreProvider>
    </BrowserRouter>
)

reportWebVitals();
