import { useEffect, useState } from 'react';
import ArticleCard from '../components/ArticleCard';

export default function HomePage() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3000/api/articles')
            .then(res => res.json())
            .then(data => {
                setArticles(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch articles", err);
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <h1>Beyond<span className="text-gradient">Chats</span> Blog</h1>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                    Explore the latest insights on Chatbots, AI, and Customer Support.
                    Enhanced by AI for your reading pleasure.
                </p>
            </div>

            {loading ? (
                <div className="loader"></div>
            ) : (
                <div className="grid">
                    {articles.map(article => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            )}
        </div>
    );
}
