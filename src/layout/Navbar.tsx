import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">My App</h1>
            <nav>
                <Link to="/todos" className="text-white mr-4">Todos</Link>
                <Link to="/" className="text-white">Home</Link>
            </nav>
        </header>
    );
}

export default Navbar;
