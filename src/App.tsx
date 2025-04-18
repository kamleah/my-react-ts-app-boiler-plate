import { BrowserRouter as Router, Routes } from 'react-router-dom';
import { routes } from './routes';
import Header from './components/header/Header';

const App = () => {

  return (
    <Router>
      <Routes>{routes}</Routes>
    </Router>
  )
};

export default App;