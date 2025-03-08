import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home, LoginPage, TodoPage } from './pages';
import { routes } from './routes';

const App = () => {

  return (
    <Router>
      <Routes>{routes}</Routes>
    </Router>
  )
};

export default App;