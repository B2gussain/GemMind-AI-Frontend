import App from './App.jsx'
import './index.css'
import './app.css'
import ContextProvider from './context/Context.jsx'
import ReactDOM from "react-dom/client"
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ContextProvider>
    <BrowserRouter><App /></BrowserRouter>
    
  </ContextProvider>,
)
