import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function Navbar() {
    return (
        <header>
            <div className="container">
                <nav>
                    <Link to="/" className="logo">
                        <Sparkles className="text-gradient" />
                        <span>Beyond<span className="text-gradient">Chats</span></span>
                    </Link>
                    <div>
                        <a href="https://beyondchats.com" target="_blank" className="btn-outline" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', textDecoration: 'none' }}>Original Blog</a>
                    </div>
                </nav>
            </div>
        </header>
    );
}
