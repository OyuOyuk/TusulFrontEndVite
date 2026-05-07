import './Generate.css'
import { useState, useRef } from 'react'

const STEPS = [
    { label: 'Company' },
    { label: 'Personality' },
    { label: 'Extras' },
    { label: 'Generate' },
]

function Generate() {
    const [step, setStep] = useState(0)

    // Form state
    const [companyName, setCompanyName] = useState('')
    const [industry, setIndustry]       = useState('')
    const [audience, setAudience]       = useState('')
    const [values, setValues]           = useState('')
    const [vibe, setVibe]               = useState('')
    const [notes, setNotes]             = useState('')
    const [generateLogo, setGenerateLogo] = useState(false)
    const [logoFile, setLogoFile]       = useState(null)

    // UI state
    const [error, setError]             = useState('')
    const [loading, setLoading]         = useState(false)
    const [progress, setProgress]       = useState(0)
    const [logEntries, setLogEntries]   = useState([])
    const [result, setResult]           = useState(null)

    const fileInputRef = useRef(null)

    // ── Validation ──────────────────────────────────────────────
    const validators = {
        0: () => {
            if (!companyName.trim()) return 'Company name is required.'
            if (!industry.trim())   return 'Industry is required.'
            if (!audience.trim())   return 'Target audience is required.'
            return ''
        },
        1: () => {
            if (!values.trim()) return 'Core values are required.'
            if (!vibe.trim())   return 'Desired vibe is required.'
            return ''
        },
    }

    const goNext = () => {
        const validate = validators[step]
        if (validate) {
            const err = validate()
            if (err) { setError(err); return }
        }
        setError('')
        setStep(s => s + 1)
    }

    const goBack = () => {
        setError('')
        setStep(s => s - 1)
    }

    // ── SSE generation ──────────────────────────────────────────
    const startGeneration = async () => {
        setError('')
        setLoading(true)
        setProgress(0)
        setLogEntries([])
        setResult(null)

        const formData = new FormData()
        formData.append('companyName', companyName.trim())
        formData.append('industry', industry.trim())
        formData.append('values', values.trim())
        formData.append('audience', audience.trim())
        formData.append('vibe', vibe.trim())
        formData.append('generateLogo', generateLogo ? 'true' : 'false')
        if (notes.trim()) formData.append('notes', notes.trim())
        if (logoFile)     formData.append('logo', logoFile)

        const token = localStorage.getItem('token')

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/brand/text`,
                {
                    method: 'POST',
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    body: formData,
                }
            )

            if (!response.ok) {
                const data = await response.json().catch(() => ({}))
                throw new Error(data.message || 'Generation failed.')
            }

            const reader  = response.body.getReader()
            const decoder = new TextDecoder()
            let buffer = ''
            let brandBook = null

            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                buffer += decoder.decode(value, { stream: true })
                const lines = buffer.split('\n')
                buffer = lines.pop()

                for (const line of lines) {
                    if (!line.startsWith('data:')) continue
                    try {
                        const event = JSON.parse(line.slice(5).trim())
                        setProgress(event.progress ?? 0)

                        if (event.step !== 'done') {
                            setLogEntries(prev => {
                                const updated = prev.map(e => ({ ...e, status: 'done' }))
                                return [...updated, { message: event.message, status: 'active' }]
                            })
                        }

                        if (event.step === 'done' && event.data) {
                            brandBook = event.data
                        }
                    } catch {}
                }
            }

            if (brandBook) {
                setResult(brandBook)
                setLogEntries(prev => prev.map(e => ({ ...e, status: 'done' })))
                setProgress(100)
            } else {
                throw new Error('No result received. Please try again.')
            }
        } catch (err) {
            setError(err.message || 'Something went wrong.')
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    const reset = () => {
        setStep(0)
        setResult(null)
        setLogEntries([])
        setProgress(0)
        setError('')
        setCompanyName(''); setIndustry(''); setAudience('')
        setValues(''); setVibe(''); setNotes('')
        setGenerateLogo(false); setLogoFile(null)
    }

    const StepIndicator = () => (
        <div className="gen_steps">
            {STEPS.map((s, i) => {
                const isDone   = i < step
                const isActive = i === step
                return (
                    <div key={i} className="gen_step_item">
                        <div className={`gen_step_dot ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                            {isDone ? '✓' : i + 1}
                        </div>
                        <span className={`gen_step_label ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                            {s.label}
                        </span>
                        {i < STEPS.length - 1 && (
                            <div className={`gen_step_line ${isDone ? 'done' : ''}`} />
                        )}
                    </div>
                )
            })}
        </div>
    )

    // ── Render ──────────────────────────────────────────────────
    return (
        <div className="generate_container">
            <div className="generate_island">
                <StepIndicator />

                {/* ── Result ── */}
                {result && (
                    <div className="gen_form">
                        <div className="gen_result_name">{result.companyName}</div>

                        {result.palette && (
                            <div className="gen_result_section">
                                <div className="gen_result_section_title">Color Palette</div>
                                <div className="gen_swatches">
                                    {Object.entries(result.palette).map(([role, val]) => (
                                        <div key={role} className="gen_swatch">
                                            <div className="gen_swatch_color" style={{ background: val.hex }} />
                                            <div className="gen_swatch_hex">{val.hex}</div>
                                            <div className="gen_swatch_name">{val.name || role}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {result.typography && (
                            <div className="gen_result_section">
                                <div className="gen_result_section_title">Typography</div>
                                <div className="gen_typo_list">
                                    {Object.entries(result.typography).map(([role, val]) => (
                                        <div key={role} className="gen_typo_item">
                                            <span className="gen_typo_role">{role}</span>
                                            <span className="gen_typo_family">{val.family}</span>
                                            <span className="gen_typo_meta">
                                                {val.weight} · {val.size}{val.lineHeight ? ` · lh ${val.lineHeight}` : ''}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {result.brandDNA && (
                            <div className="gen_result_section">
                                <div className="gen_result_section_title">Brand DNA</div>
                                <div className="gen_tags">
                                    {result.brandDNA.mood && (
                                        <span className="gen_tag mood">{result.brandDNA.mood}</span>
                                    )}
                                    {result.brandDNA.era && (
                                        <span className="gen_tag era">{result.brandDNA.era}</span>
                                    )}
                                    {result.brandDNA.personality?.map(p => (
                                        <span key={p} className="gen_tag">{p}</span>
                                    ))}
                                    {result.brandDNA.avoidances?.map(a => (
                                        <span key={a} className="gen_tag avoid">avoid: {a}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {result.logoPrompt && (
                            <div className="gen_result_section">
                                <div className="gen_result_section_title">Logo Concept Prompt</div>
                                <p className="gen_logo_prompt">{result.logoPrompt}</p>
                            </div>
                        )}

                        <button className="gen_reset_link" onClick={reset}>
                            Generate another →
                        </button>
                    </div>
                )}

                {/* ── Loading / progress ── */}
                {loading && !result && (
                    <div className="gen_form">
                        <h1 className="gen_header">Building your identity...</h1>
                        <p className="gen_subheader">This usually takes 10–20 seconds.</p>
                        <div className="gen_progress_bar_wrap">
                            <div className="gen_progress_bar_fill" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="gen_log">
                            {logEntries.map((e, i) => (
                                <div key={i} className={`gen_log_entry ${e.status}`}>
                                    <div className="gen_log_dot" />
                                    <span>{e.message}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Step 0: Company info ── */}
                {!loading && !result && step === 0 && (
                    <div key="step0" className="gen_form">
                        <h1 className="gen_header">Let's build your brand</h1>
                        <h3 className="gen_subheader">Start with the basics.</h3>

                        <div className="input_row">
                            <div className="input_group">
                                <label className="gen_label">Company Name *</label>
                                <input
                                    className={`gen_input ${error && !companyName.trim() ? 'input_error' : ''}`}
                                    type="text"
                                    placeholder="e.g. Arcadia Studio"
                                    value={companyName}
                                    onChange={e => { setCompanyName(e.target.value); setError('') }}
                                />
                            </div>
                            <div className="input_group">
                                <label className="gen_label">Industry *</label>
                                <input
                                    className={`gen_input ${error && !industry.trim() ? 'input_error' : ''}`}
                                    type="text"
                                    placeholder="e.g. Creative Agency"
                                    value={industry}
                                    onChange={e => { setIndustry(e.target.value); setError('') }}
                                />
                            </div>
                        </div>

                        <div className="input_group">
                            <label className="gen_label">Target Audience *</label>
                            <input
                                className={`gen_input ${error && !audience.trim() ? 'input_error' : ''}`}
                                type="text"
                                placeholder="e.g. Independent musicians aged 20–35"
                                value={audience}
                                onChange={e => { setAudience(e.target.value); setError('') }}
                            />
                        </div>

                        {error && <p className="gen_error">{error}</p>}

                        <div className="gen_nav">
                            <button className="gen_btn_next" onClick={goNext}>Next →</button>
                        </div>
                    </div>
                )}

                {/* ── Step 1: Personality ── */}
                {!loading && !result && step === 1 && (
                    <div key="step1" className="gen_form">
                        <h1 className="gen_header">Brand personality</h1>
                        <h3 className="gen_subheader">What does your brand stand for?</h3>

                        <div className="input_group">
                            <label className="gen_label">Core Values *</label>
                            <textarea
                                className={`gen_input ${error && !values.trim() ? 'input_error' : ''}`}
                                rows={3}
                                placeholder="e.g. Innovation, transparency, community-driven"
                                value={values}
                                onChange={e => { setValues(e.target.value); setError('') }}
                            />
                        </div>

                        <div className="input_group">
                            <label className="gen_label">Desired Vibe *</label>
                            <textarea
                                className={`gen_input ${error && !vibe.trim() ? 'input_error' : ''}`}
                                rows={3}
                                placeholder="e.g. Bold, minimal, warm, trustworthy, playful"
                                value={vibe}
                                onChange={e => { setVibe(e.target.value); setError('') }}
                            />
                        </div>

                        {error && <p className="gen_error">{error}</p>}

                        <div className="gen_nav">
                            <button className="gen_btn_back" onClick={goBack}>← Back</button>
                            <button className="gen_btn_next" onClick={goNext}>Next →</button>
                        </div>
                    </div>
                )}

                {/* ── Step 2: Extras ── */}
                {!loading && !result && step === 2 && (
                    <div key="step2" className="gen_form">
                        <h1 className="gen_header">Design preferences</h1>
                        <h3 className="gen_subheader">Optional extras to fine-tune your brand.</h3>

                        <div className="input_group">
                            <label className="gen_label">Extra Design Notes</label>
                            <textarea
                                className="gen_input"
                                rows={3}
                                placeholder="e.g. Avoid blue tones, prefer serif fonts, earthy palette"
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                            />
                        </div>

                        <div className="input_group">
                            <label className="gen_label">Existing Logo (optional)</label>
                            <div className="gen_file_drop">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={e => setLogoFile(e.target.files[0] || null)}
                                />
                                <div className="gen_file_text">
                                    <strong>Click to upload</strong> or drag & drop<br />
                                    PNG, JPEG, WebP · max 5MB
                                </div>
                                {logoFile && (
                                    <div className="gen_file_name">{logoFile.name}</div>
                                )}
                            </div>
                        </div>

                        <div className="gen_toggle_row">
                            <div>
                                <div className="gen_toggle_label">Generate logo concept</div>
                                <div className="gen_toggle_sub">Creates a prompt for an AI logo image</div>
                            </div>
                            <label className="toggle_switch">
                                <input
                                    type="checkbox"
                                    checked={generateLogo}
                                    onChange={e => setGenerateLogo(e.target.checked)}
                                />
                                <span className="toggle_track" />
                            </label>
                        </div>

                        <div className="gen_nav">
                            <button className="gen_btn_back" onClick={goBack}>← Back</button>
                            <button className="gen_btn_next" onClick={goNext}>Review →</button>
                        </div>
                    </div>
                )}

                {/* ── Step 3: Review & generate ── */}
                {!loading && !result && step === 3 && (
                    <div key="step3" className="gen_form">
                        <h1 className="gen_header">Ready to generate</h1>
                        <h3 className="gen_subheader">Everything look right?</h3>

                        {[
                            ['Company',   companyName],
                            ['Industry',  industry],
                            ['Audience',  audience],
                            ['Values',    values],
                            ['Vibe',      vibe],
                            notes && ['Notes', notes],
                        ].filter(Boolean).map(([key, val]) => (
                            <div key={key} className="gen_review_row">
                                <span className="gen_review_key">{key}</span>
                                <span className="gen_review_val">{val}</span>
                            </div>
                        ))}

                        {error && <p className="gen_error">{error}</p>}

                        <div className="gen_nav">
                            <button className="gen_btn_back" onClick={goBack}>← Back</button>
                            <button
                                className="gen_btn_next"
                                onClick={startGeneration}
                                disabled={loading}
                            >
                                Generate Brand Book
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default Generate