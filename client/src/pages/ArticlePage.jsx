import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Sparkles, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ArticlePage() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('enhanced'); // 'enhanced' or 'original'

    useEffect(() => {
        fetch(`http://localhost:3000/api/articles/${id}`)
            .then(res => res.json())
            .then(data => {
                setArticle(data);
                // Default to enhanced if available
                if (!data.is_enhanced) setView('original');
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="loader"></div>;
    if (!article) return <div className="container" style={{ textAlign: 'center', paddingTop: '5rem' }}>Article not found</div>;

    return (
        <div style={{ paddingBottom: '5rem' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '2rem' }}>
                <ArrowLeft size={16} /> Back to Home
            </Link>

            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{article.title}</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {article.is_enhanced && (
                        <button
                            onClick={() => setView('enhanced')}
                            className={view === 'enhanced' ? 'btn' : 'btn-outline'}
                            style={{ padding: '0.5rem 1rem' }}
                        >
                            <Sparkles size={16} /> AI Enhanced
                        </button>
                    )}
                    <button
                        onClick={() => setView('original')}
                        className={view === 'original' ? 'btn' : 'btn-outline'}
                        style={{ padding: '0.5rem 1rem' }}
                    >
                        <FileText size={16} /> Original
                    </button>
                </div>
            </div>

            <div className="glass-card">
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '1.1rem' }}>
                    {view === 'enhanced' ? article.enhanced_content : article.content}
                </div>
            </div>

            {article.cited_sources && view === 'enhanced' && (
                <div className="citation-box">
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Sources Referenced</h3>
                    {JSON.parse(article.cited_sources).map((source, i) => (
                        <a key={i} href={source} target="_blank" rel="noopener noreferrer" className="citation-link">
                            {source}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
