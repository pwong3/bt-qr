import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import UpdateLocation from './Pages/UpdateLocation';
import PrintQR from './Pages/PrintQR';
import NoMatch from './Pages/NoMatch';
import reportWebVitals from './reportWebVitals';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route index element={<Home />} />
          <Route path=':order' element={<UpdateLocation />} />
          <Route path='printQR/:orderNumber' element={<PrintQR />} />
          <Route path='*' element={<NoMatch />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
