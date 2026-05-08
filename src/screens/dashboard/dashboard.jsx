import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './dashboard.css'

function BrandBookCard({ book, onClick }) {
    const palette   = book.palette   || {}
    const dna       = book.brand_dna || {}
    const typo      = book.typography || {}
    const swatches  = Object.values(palette).slice(0, 5)
    const date      = new Date(book.created_at).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
    })

    return (
        <div className="bb-card" onClick={() => onClick(book)}>
            <div>
                <p className="bb-card-name">{book.company_name}</p>
                <p className="bb-card-date">{date}</p>
            </div>

            {swatches.length > 0 && (
                <div className="bb-palette-strip">
                    {swatches.map((s, i) => (
                        <div
                            key={i}
                            className="bb-swatch"
                            style={{ background: s.hex }}
                            title={s.name}
                        />
                    ))}
                </div>
            )}

            <div className="bb-card-meta">
                {dna.mood && <span className="bb-tag mood">{dna.mood}</span>}
                {dna.era  && <span className="bb-tag era">{dna.era}</span>}
                {dna.personality?.slice(0, 2).map(p => (
                    <span key={p} className="bb-tag">{p}</span>
                ))}
            </div>

            {(typo.heading || typo.body) && (
                <div className="bb-card-typo">
                    {typo.heading && <div>Heading — {typo.heading.family}</div>}
                    {typo.body    && <div>Body — {typo.body.family}</div>}
                </div>
            )}

            <div className="bb-edits">
                Edits remaining: <span>{book.edits_remaining ?? 3}</span>
            </div>
        </div>
    )
}

function SkeletonCard() {
    return (
        <div className="bb-skeleton">
            <div className="bb-skel-line" style={{ height: 16, width: '60%' }} />
            <div className="bb-skel-line" style={{ height: 10, width: '35%' }} />
            <div className="bb-skel-line" style={{ height: 28 }} />
            <div style={{ display: 'flex', gap: 6 }}>
                <div className="bb-skel-line" style={{ height: 20, width: 60 }} />
                <div className="bb-skel-line" style={{ height: 20, width: 50 }} />
            </div>
        </div>
    )
}

function Dashboard() {
    const navigate  = useNavigate()
    const [user, setUser]       = useState(null)
    const [books, setBooks]     = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError]     = useState('')

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) { navigate('/login'); return }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            setUser(payload)
        } catch {
            localStorage.removeItem('token')
            navigate('/login?error=invalid_token')
            return
        }

        fetchHistory(token)
    }, [navigate])

    const fetchHistory = async (token) => {
        setLoading(true)
        setError('')
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/brand/history`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Failed to load history.')
            setBooks(data.data || [])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const getGreeting = () => {
        const h = new Date().getHours()
        if (h < 12) return 'Good Morning'
        if (h < 18) return 'Good Afternoon'
        return 'Good Evening'
    }

    const handleCardClick = (book) => {
        // Navigate to a detail page if you have one, or expand inline later
        navigate(`/brand/${book.id}`)
    }

    return (
        <div className="dashboard-container">
            
            {/* ── Greeting + CTA ── */}
            <div className="dashboard-top">
                <div>0
                    <h1 className="dashboard_header1">
                        {getGreeting()}{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
                    </h1>
                    <h2 className="dashboard_header2">Your brand book library</h2>
                </div>
                <button
                    className="dashboard_cta_btn"
                    onClick={() => navigate('/generate')}
                >
                    + New Brand Book
                </button>
            </div>

            {/* ── Error ── */}
            {error && <div className="dashboard-error">{error}</div>}

            {/* ── Library ── */}
            {loading ? (
                <div className="dashboard-grid">
                    {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                </div>
            ) : books.length === 0 ? (
                <div className="dashboard-empty">
                    <p>You haven't generated any brand books yet.</p>
                    <button
                        className="dashboard-empty-btn"
                        onClick={() => navigate('/generate')}
                    >
                        Create your first one →
                    </button>
                </div>
            ) : (
                <>
                    <p className="dashboard-library-header">
                        {books.length} brand book{books.length !== 1 ? 's' : ''}
                    </p>
                    <div className="dashboard-grid">
                        {books.map(book => (
                            <BrandBookCard
                                key={book.id}
                                book={book}
                                onClick={handleCardClick}
                            />
                        ))}
                    </div>
                </>
            )}

        </div>
    )
}

export default Dashboard