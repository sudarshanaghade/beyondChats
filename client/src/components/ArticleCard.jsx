import { Link } from 'react-router-dom';
import { Sparkles, ExternalLink } from 'lucide-react';

export default function ArticleCard({ article }) {
    // Parsing date roughly
    const date = new Date(article.date_published || Date.now()).toLocaleDateString();

    return (
        <div className="glass-card">
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                <span>{date}</span>
                {article.is_enhanced && <span style={{ color: 'var(--accent)', display: 'flex', gap: '0.2rem', alignItems: 'center' }}><Sparkles size={12} /> AI Enhanced</span>}
            </div>

            <h3 style={{ marginBottom: '0.5rem' }}>{article.title}</h3>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {article.is_enhanced ? article.enhanced_content : article.content}
            </p>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <Link to={`/article/${article.id}`} className="btn">
                    Read More
                </Link>
                <a href={article.link} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%' }}>
                    <ExternalLink size={16} />
                </a>
            </div>
        </div>
    );
}
