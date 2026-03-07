'use client';

import { useState, useEffect, useCallback } from 'react';

// ================================================================
// UTILITY HELPERS
// ================================================================

const CATEGORIES = [
    { value: 'all', label: '🔍 All Categories' },
    { value: 'cyber_threat', label: '🛡 Cyber Threats' },
    { value: 'data_breach', label: '🔓 Data Breaches' },
    { value: 'scam', label: '⚠️ Scams & Fraud' },
    { value: 'theft', label: '📦 Theft' },
    { value: 'infrastructure', label: '🏗 Infrastructure' },
    { value: 'weather', label: '🌦 Weather' },
    { value: 'community_event', label: '🤝 Community' },
    { value: 'general', label: '📋 General' },
];

const SEVERITIES = [
    { value: 'all', label: 'All Severities' },
    { value: 'critical', label: '🔴 Critical' },
    { value: 'high', label: '🟠 High' },
    { value: 'medium', label: '🟡 Medium' },
    { value: 'low', label: '🟢 Low' },
    { value: 'info', label: '🔵 Info' },
];

function formatCategoryName(category) {
    const names = {
        cyber_threat: '🛡 Cyber Threat',
        data_breach: '🔓 Data Breach',
        scam: '⚠️ Scam',
        theft: '📦 Theft',
        infrastructure: '🏗 Infrastructure',
        weather: '🌦 Weather',
        community_event: '🤝 Community',
        noise: '🔇 Noise',
        general: '📋 General'
    };
    return names[category] || category;
}

function getCategoryBadgeClass(category) {
    const map = {
        cyber_threat: 'badge-cyber',
        data_breach: 'badge-breach',
        scam: 'badge-scam',
        theft: 'badge-theft',
        infrastructure: 'badge-infra',
        weather: 'badge-weather',
        community_event: 'badge-community',
        noise: 'badge-noise',
        general: 'badge-general',
    };
    return map[category] || 'badge-general';
}

function timeAgo(timestamp) {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

// ================================================================
// LOCATION SELECTOR COMPONENT
// ================================================================

function LocationSelector({ currentLocation, onLocationChange, locations }) {
    const [isOpen, setIsOpen] = useState(false);
    const [customLocation, setCustomLocation] = useState('');

    const handleSelect = (location) => {
        onLocationChange(location);
        setIsOpen(false);
    };

    const handleCustomSubmit = (e) => {
        e.preventDefault();
        if (customLocation.trim()) {
            onLocationChange(customLocation.trim());
            setCustomLocation('');
            setIsOpen(false);
        }
    };

    return (
        <div className="location-selector" id="location-selector">
            <button
                className="location-btn"
                onClick={() => setIsOpen(!isOpen)}
                id="location-toggle-btn"
            >
                <span className="location-icon">📍</span>
                <span className="location-text">{currentLocation || 'All Locations'}</span>
                <span className={`location-arrow ${isOpen ? 'open' : ''}`}>▾</span>
            </button>

            {isOpen && (
                <>
                    <div className="location-backdrop" onClick={() => setIsOpen(false)} />
                    <div className="location-dropdown" id="location-dropdown">
                        <div className="location-dropdown-header">
                            <span className="location-dropdown-title">📍 Select Community Area</span>
                        </div>

                        {/* Custom location input */}
                        <form onSubmit={handleCustomSubmit} className="location-custom-form">
                            <input
                                className="location-custom-input"
                                type="text"
                                placeholder="Enter custom location..."
                                value={customLocation}
                                onChange={(e) => setCustomLocation(e.target.value)}
                                id="custom-location-input"
                            />
                            <button type="submit" className="location-custom-btn" disabled={!customLocation.trim()}>Go</button>
                        </form>

                        {/* Location list */}
                        <div className="location-list">
                            <button
                                className={`location-option ${!currentLocation ? 'active' : ''}`}
                                onClick={() => handleSelect('')}
                                id="location-all"
                            >
                                <span>🌐</span>
                                <span>All Locations</span>
                                {!currentLocation && <span className="location-check">✓</span>}
                            </button>
                            {locations.map(loc => (
                                <button
                                    key={loc}
                                    className={`location-option ${currentLocation === loc ? 'active' : ''}`}
                                    onClick={() => handleSelect(loc)}
                                >
                                    <span>📍</span>
                                    <span>{loc}</span>
                                    {currentLocation === loc && <span className="location-check">✓</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// ================================================================
// TOAST NOTIFICATION COMPONENT
// ================================================================

function ToastContainer({ toasts }) {
    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <div key={toast.id} className={`toast toast-${toast.type}`}>
                    <span>{toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}</span>
                    <span>{toast.message}</span>
                </div>
            ))}
        </div>
    );
}

// ================================================================
// CREATE ALERT MODAL
// ================================================================

function CreateAlertModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'general',
        severity: 'medium',
        location: '',
        source: 'User Report',
        tags: ''
    });
    const [errors, setErrors] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Client-side validation
        const validationErrors = [];
        if (formData.title.trim().length < 5) validationErrors.push('Title must be at least 5 characters');
        if (formData.description.trim().length < 10) validationErrors.push('Description must be at least 10 characters');
        if (formData.location.trim().length < 2) validationErrors.push('Location is required');

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }

        await onSubmit({
            ...formData,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        });

        setFormData({
            title: '', description: '', category: 'general',
            severity: 'medium', location: '', source: 'User Report', tags: ''
        });
        setIsSubmitting(false);
    };

    return (
        <div className="modal-overlay" onClick={onClose} id="create-alert-modal">
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">📝 Report New Alert</h2>
                    <button className="modal-close" onClick={onClose} id="close-modal-btn">×</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {errors.length > 0 && (
                            <div style={{ marginBottom: '16px' }}>
                                {errors.map((err, i) => (
                                    <p key={i} className="form-error">⚠️ {err}</p>
                                ))}
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label" htmlFor="alert-title">Alert Title *</label>
                            <input
                                id="alert-title"
                                className="form-input"
                                type="text"
                                placeholder="Brief, descriptive title..."
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="alert-description">Description *</label>
                            <textarea
                                id="alert-description"
                                className="form-textarea"
                                placeholder="Detailed description of the alert..."
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="alert-category">Category *</label>
                                <select
                                    id="alert-category"
                                    className="form-select"
                                    value={formData.category}
                                    onChange={(e) => handleChange('category', e.target.value)}
                                >
                                    {CATEGORIES.filter(c => c.value !== 'all').map(cat => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="alert-severity">Severity *</label>
                                <select
                                    id="alert-severity"
                                    className="form-select"
                                    value={formData.severity}
                                    onChange={(e) => handleChange('severity', e.target.value)}
                                >
                                    {SEVERITIES.filter(s => s.value !== 'all').map(sev => (
                                        <option key={sev.value} value={sev.value}>{sev.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="alert-location">Location *</label>
                            <input
                                id="alert-location"
                                className="form-input"
                                type="text"
                                placeholder="e.g., Downtown, Oak Avenue..."
                                value={formData.location}
                                onChange={(e) => handleChange('location', e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="alert-source">Source</label>
                            <input
                                id="alert-source"
                                className="form-input"
                                type="text"
                                placeholder="e.g., User Report, Police, News..."
                                value={formData.source}
                                onChange={(e) => handleChange('source', e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="alert-tags">Tags (comma-separated)</label>
                            <input
                                id="alert-tags"
                                className="form-input"
                                type="text"
                                placeholder="e.g., phishing, email, urgent"
                                value={formData.tags}
                                onChange={(e) => handleChange('tags', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" id="submit-alert-btn" disabled={isSubmitting}>
                            {isSubmitting ? '⏳ Submitting...' : '🛡 Submit Alert'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ================================================================
// ALERT CARD COMPONENT
// ================================================================

function AlertCard({ alert, onClick, isNoise }) {
    return (
        <div
            className={`alert-card severity-${alert.severity} ${isNoise ? 'noise' : ''}`}
            onClick={() => onClick(alert)}
            id={`alert-card-${alert.id}`}
        >
            <div className="alert-header">
                <h3 className="alert-title">
                    {isNoise && '🔇 '}
                    {alert.title}
                </h3>
                <div className="alert-badges">
                    <span className={`badge badge-${alert.severity}`}>
                        {alert.severity}
                    </span>
                    <span className={`badge-category ${getCategoryBadgeClass(alert.category)}`}>
                        {formatCategoryName(alert.category)}
                    </span>
                </div>
            </div>

            <p className="alert-description">
                {alert.description.length > 200
                    ? alert.description.substring(0, 200) + '...'
                    : alert.description}
            </p>

            <div className="alert-meta">
                <span className="alert-meta-item">📍 {alert.location}</span>
                <span className="alert-meta-item">🕐 {timeAgo(alert.timestamp)}</span>
                <span className="alert-meta-item">📰 {alert.source}</span>
                <span className="alert-meta-item" style={{
                    color: alert.status === 'verified' ? 'var(--color-low)' : 'var(--color-medium)'
                }}>
                    {alert.status === 'verified' ? '✅ Verified' : '⏳ Unverified'}
                </span>
            </div>

            {alert.tags && alert.tags.length > 0 && (
                <div className="alert-tags">
                    {alert.tags.map(tag => (
                        <span key={tag} className="tag">#{tag}</span>
                    ))}
                </div>
            )}
        </div>
    );
}

// ================================================================
// ALERT DETAIL VIEW
// ================================================================

function AlertDetail({ alert, onBack, onUpdate, aiStatus }) {
    const [analysis, setAnalysis] = useState(null);
    const [checklist, setChecklist] = useState(null);
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);
    const [loadingChecklist, setLoadingChecklist] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ ...alert });

    const runAnalysis = useCallback(async () => {
        setLoadingAnalysis(true);
        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'analyze', text: `${alert.title}. ${alert.description}` })
            });
            const data = await res.json();
            setAnalysis(data);
        } catch (error) {
            setAnalysis({ error: 'Analysis failed', method: 'error' });
        }
        setLoadingAnalysis(false);
    }, [alert]);

    const getChecklist = useCallback(async () => {
        setLoadingChecklist(true);
        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'checklist',
                    category: alert.category,
                    text: alert.description
                })
            });
            const data = await res.json();
            setChecklist(data);
        } catch (error) {
            setChecklist({ checklist: ['Unable to generate checklist'], method: 'error' });
        }
        setLoadingChecklist(false);
    }, [alert]);

    useEffect(() => {
        runAnalysis();
        getChecklist();
    }, [runAnalysis, getChecklist]);

    const handleSave = async () => {
        await onUpdate(alert.id, editData);
        setIsEditing(false);
    };

    return (
        <div className="alert-detail">
            <button className="alert-detail-back" onClick={onBack} id="back-to-alerts-btn">
                ← Back to Alerts
            </button>

            <div className="alert-detail-header">
                <div className="alert-badges" style={{ marginBottom: '8px' }}>
                    <span className={`badge badge-${alert.severity}`}>{alert.severity}</span>
                    <span className={`badge-category ${getCategoryBadgeClass(alert.category)}`}>
                        {formatCategoryName(alert.category)}
                    </span>
                    <span style={{
                        fontSize: '0.75rem',
                        color: alert.status === 'verified' ? 'var(--color-low)' : 'var(--color-medium)'
                    }}>
                        {alert.status === 'verified' ? '✅ Verified' : '⏳ Unverified'}
                    </span>
                </div>

                {isEditing ? (
                    <input
                        className="form-input"
                        value={editData.title}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        style={{ fontSize: '1.5rem', fontWeight: 700 }}
                    />
                ) : (
                    <h1 className="alert-detail-title">{alert.title}</h1>
                )}
            </div>

            <div className="alert-detail-content">
                <div className="alert-detail-main">
                    {/* Description */}
                    <div className="detail-section">
                        <h3 className="detail-section-title">📋 Full Report</h3>
                        {isEditing ? (
                            <textarea
                                className="form-textarea"
                                value={editData.description}
                                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                style={{ minHeight: '150px' }}
                            />
                        ) : (
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.925rem' }}>
                                {alert.description}
                            </p>
                        )}
                    </div>

                    {/* AI Analysis */}
                    <div className={`ai-analysis ${analysis?.method === 'rule-based' ? 'ai-analysis-fallback' : ''}`}>
                        <div className="ai-analysis-header">
                            {loadingAnalysis ? (
                                <div className="ai-loading">
                                    <div className="ai-loading-dots">
                                        <span></span><span></span><span></span>
                                    </div>
                                    <span>Analyzing alert...</span>
                                </div>
                            ) : (
                                <>
                                    {analysis?.method === 'ai' ? '🤖 AI Analysis' : '⚙️ Rule-Based Analysis'}
                                    {analysis?.method === 'rule-based' && (
                                        <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: 8 }}>
                                            (Fallback: {analysis.fallbackReason || 'AI unavailable'})
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                        {!loadingAnalysis && analysis && (
                            <div className="ai-analysis-content">
                                {analysis.summary && (
                                    <p style={{ marginBottom: '12px' }}><strong>Summary:</strong> {analysis.summary}</p>
                                )}
                                {analysis.isNoise !== undefined && (
                                    <p style={{ marginBottom: '8px' }}>
                                        <strong>Signal Assessment:</strong>{' '}
                                        {analysis.isNoise
                                            ? '🔇 This appears to be noise/venting rather than an actionable alert.'
                                            : '📡 This appears to be an actionable, legitimate alert.'}
                                    </p>
                                )}
                                {analysis.confidence !== undefined && (
                                    <p>
                                        <strong>Confidence:</strong>{' '}
                                        <span style={{
                                            color: analysis.confidence > 0.7 ? 'var(--color-low)' : 'var(--color-medium)'
                                        }}>
                                            {(analysis.confidence * 100).toFixed(0)}%
                                        </span>
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Defense Checklist */}
                    <div className="detail-section">
                        <h3 className="detail-section-title">
                            🛡 Proactive Defense Checklist
                            {checklist?.method === 'rule-based' && (
                                <span style={{ fontSize: '0.7rem', fontWeight: 400, color: 'var(--color-medium)', marginLeft: 8 }}>
                                    RULE-BASED FALLBACK
                                </span>
                            )}
                            {checklist?.method === 'ai' && (
                                <span style={{ fontSize: '0.7rem', fontWeight: 400, color: 'var(--accent-primary)', marginLeft: 8 }}>
                                    AI-GENERATED
                                </span>
                            )}
                        </h3>
                        {loadingChecklist ? (
                            <div className="ai-loading">
                                <div className="ai-loading-dots">
                                    <span></span><span></span><span></span>
                                </div>
                                <span>Generating defense steps...</span>
                            </div>
                        ) : checklist?.checklist ? (
                            <ol className="checklist">
                                {checklist.checklist.map((step, i) => (
                                    <li key={i} className="checklist-item">
                                        <span className="checklist-number">{i + 1}</span>
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ol>
                        ) : null}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="alert-detail-sidebar">
                    {/* Actions */}
                    <div className="detail-section">
                        <h3 className="detail-section-title">⚡ Actions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {isEditing ? (
                                <>
                                    <button className="btn btn-primary btn-sm" onClick={handleSave} id="save-edit-btn">
                                        💾 Save Changes
                                    </button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => { setIsEditing(false); setEditData({ ...alert }); }}>
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(true)} id="edit-alert-btn">
                                    ✏️ Edit Alert
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Alert Info */}
                    <div className="detail-section">
                        <h3 className="detail-section-title">ℹ️ Alert Details</h3>
                        <div className="detail-field">
                            <span className="detail-field-label">Source</span>
                            <span className="detail-field-value">{alert.source}</span>
                        </div>
                        <div className="detail-field">
                            <span className="detail-field-label">Location</span>
                            <span className="detail-field-value">{alert.location}</span>
                        </div>
                        <div className="detail-field">
                            <span className="detail-field-label">Reported</span>
                            <span className="detail-field-value">{timeAgo(alert.timestamp)}</span>
                        </div>
                        <div className="detail-field">
                            <span className="detail-field-label">Status</span>
                            <span className="detail-field-value">{alert.status}</span>
                        </div>
                        <div className="detail-field">
                            <span className="detail-field-label">Actionable</span>
                            <span className="detail-field-value">{alert.actionable ? 'Yes' : 'No'}</span>
                        </div>
                    </div>

                    {/* Tags */}
                    {alert.tags && alert.tags.length > 0 && (
                        <div className="detail-section">
                            <h3 className="detail-section-title">🏷 Tags</h3>
                            <div className="alert-tags">
                                {alert.tags.map(tag => (
                                    <span key={tag} className="tag">#{tag}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* AI Status */}
                    <div className="detail-section">
                        <h3 className="detail-section-title">🤖 AI Engine Status</h3>
                        <div className="detail-field">
                            <span className="detail-field-label">Mode</span>
                            <span className="detail-field-value" style={{
                                color: aiStatus === 'ai' ? 'var(--color-low)' : 'var(--color-medium)'
                            }}>
                                {aiStatus === 'ai' ? '🟢 AI Active' : '🟡 Fallback'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ================================================================
// DIGEST VIEW
// ================================================================

function DigestView({ alerts, aiStatus }) {
    const [digest, setDigest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDigest() {
            try {
                const res = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'digest', alerts })
                });
                const data = await res.json();
                setDigest(data);
            } catch (error) {
                setDigest({ summary: 'Unable to generate digest.', method: 'error' });
            }
            setLoading(false);
        }
        if (alerts.length > 0) {
            fetchDigest();
        } else {
            setLoading(false);
        }
    }, [alerts]);

    const verified = alerts.filter(a => a.status === 'verified');
    const critical = verified.filter(a => ['critical', 'high'].includes(a.severity));
    const categoryCounts = {};
    verified.forEach(a => {
        categoryCounts[a.category] = (categoryCounts[a.category] || 0) + 1;
    });

    return (
        <div>
            {/* Summary */}
            <div className="digest-section">
                <h2 className="digest-title">
                    📊 Your Safety Digest
                    {digest?.method && (
                        <span className={`badge ${digest.method === 'ai' ? 'badge-info' : 'badge-medium'}`}>
                            {digest.method === 'ai' ? '🤖 AI Generated' : '⚙️ Rule-Based'}
                        </span>
                    )}
                </h2>
                {loading ? (
                    <div className="ai-loading">
                        <div className="ai-loading-dots">
                            <span></span><span></span><span></span>
                        </div>
                        <span>Generating your personalized safety digest...</span>
                    </div>
                ) : (
                    <div className="digest-summary">
                        {digest?.summary || 'No alerts to summarize.'}
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-value">{verified.length}</div>
                    <div className="stat-label">Verified Alerts</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🚨</div>
                    <div className="stat-value" style={{ color: 'var(--color-critical)' }}>{critical.length}</div>
                    <div className="stat-label">Critical / High</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🛡</div>
                    <div className="stat-value">{Object.keys(categoryCounts).length}</div>
                    <div className="stat-label">Categories</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📡</div>
                    <div className="stat-value" style={{ color: aiStatus === 'ai' ? 'var(--color-low)' : 'var(--color-medium)' }}>
                        {aiStatus === 'ai' ? 'AI' : 'Rules'}
                    </div>
                    <div className="stat-label">Engine Mode</div>
                </div>
            </div>

            {/* Category Breakdown */}
            <div className="digest-section">
                <h3 className="digest-title">📂 Alert Categories</h3>
                <div className="alerts-list">
                    {Object.entries(categoryCounts)
                        .sort(([, a], [, b]) => b - a)
                        .map(([category, count]) => (
                            <div key={category} className="alert-card" style={{ cursor: 'default' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className={`badge-category ${getCategoryBadgeClass(category)}`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                                        {formatCategoryName(category)}
                                    </span>
                                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                        {count}
                                    </span>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* Critical Alerts */}
            {critical.length > 0 && (
                <div className="digest-section">
                    <h3 className="digest-title" style={{ color: 'var(--color-critical)' }}>🚨 Requires Immediate Attention</h3>
                    <div className="alerts-list">
                        {critical.map(alert => (
                            <div key={alert.id} className={`alert-card severity-${alert.severity}`} style={{ cursor: 'default' }}>
                                <div className="alert-header">
                                    <h3 className="alert-title">{alert.title}</h3>
                                    <span className={`badge badge-${alert.severity}`}>{alert.severity}</span>
                                </div>
                                <p className="alert-description">{alert.description.substring(0, 150)}...</p>
                                <div className="alert-meta">
                                    <span className="alert-meta-item">📍 {alert.location}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ================================================================
// MAIN APP
// ================================================================

export default function Home() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filterNoisy, setFilterNoisy] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [severityFilter, setSeverityFilter] = useState('all');
    const [toasts, setToasts] = useState([]);
    const [aiStatus, setAiStatus] = useState('checking');
    const [noiseResults, setNoiseResults] = useState({});
    const [userLocation, setUserLocation] = useState('');

    // Extract unique locations from alerts for the dropdown
    const uniqueLocations = [...new Set(alerts.map(a => a.location).filter(Boolean))].sort();

    const addToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    // Fetch alerts
    const fetchAlerts = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (categoryFilter !== 'all') params.set('category', categoryFilter);
            if (severityFilter !== 'all') params.set('severity', severityFilter);
            if (searchQuery) params.set('search', searchQuery);

            const res = await fetch(`/api/alerts?${params}`);
            const data = await res.json();
            setAlerts(data.alerts || []);
        } catch (error) {
            addToast('Failed to fetch alerts', 'error');
        }
        setLoading(false);
    }, [categoryFilter, severityFilter, searchQuery, addToast]);

    // Check AI status
    useEffect(() => {
        async function checkAI() {
            try {
                const res = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'analyze', text: 'test alert for status check' })
                });
                const data = await res.json();
                setAiStatus(data.method === 'ai' ? 'ai' : 'fallback');
            } catch {
                setAiStatus('fallback');
            }
        }
        checkAI();
    }, []);

    // Analyze noise for all alerts
    useEffect(() => {
        async function analyzeNoise() {
            const results = {};
            for (const alert of alerts) {
                try {
                    const res = await fetch('/api/analyze', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'analyze', text: `${alert.title}. ${alert.description}` })
                    });
                    const data = await res.json();
                    results[alert.id] = data.isNoise;
                } catch {
                    results[alert.id] = false;
                }
            }
            setNoiseResults(results);
        }
        if (alerts.length > 0) {
            analyzeNoise();
        }
    }, [alerts]);

    useEffect(() => {
        fetchAlerts();
    }, [fetchAlerts]);

    // Create alert
    const handleCreateAlert = async (formData) => {
        try {
            const res = await fetch('/api/alerts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (res.ok) {
                addToast('Alert created successfully!', 'success');
                setShowCreateModal(false);
                fetchAlerts();
            } else {
                addToast(data.errors?.join(', ') || 'Failed to create alert', 'error');
            }
        } catch (error) {
            addToast('Failed to create alert', 'error');
        }
    };

    // Update alert
    const handleUpdateAlert = async (id, data) => {
        try {
            const res = await fetch(`/api/alerts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                const result = await res.json();
                addToast('Alert updated successfully!', 'success');
                setSelectedAlert(result.alert);
                fetchAlerts();
            } else {
                addToast('Failed to update alert', 'error');
            }
        } catch (error) {
            addToast('Failed to update alert', 'error');
        }
    };

    // Filter displayed alerts
    let displayedAlerts = filterNoisy
        ? alerts.filter(a => !noiseResults[a.id])
        : alerts;

    // Apply location filter
    if (userLocation) {
        displayedAlerts = displayedAlerts.filter(a =>
            a.location && a.location.toLowerCase().includes(userLocation.toLowerCase())
        );
    }

    const noiseCount = Object.values(noiseResults).filter(Boolean).length;

    return (
        <>
            {/* HEADER */}
            <header className="header">
                <div className="header-inner">
                    <div className="header-brand">
                        <div className="header-logo">🛡</div>
                        <div>
                            <div className="header-title">Community Guardian</div>
                            <div className="header-subtitle">AI-Powered Safety & Digital Wellness</div>
                        </div>
                    </div>
                    <div className="header-actions">
                        <LocationSelector
                            currentLocation={userLocation}
                            onLocationChange={setUserLocation}
                            locations={uniqueLocations}
                        />
                        <div className={`header-status ${aiStatus === 'fallback' ? 'fallback' : ''}`}>
                            <span className="status-dot"></span>
                            {aiStatus === 'ai' ? 'AI Active' : aiStatus === 'checking' ? 'Checking...' : 'Fallback Mode'}
                        </div>
                        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)} id="create-alert-btn">
                            + Report Alert
                        </button>
                    </div>
                </div>
            </header>

            <main className="app-container" style={{ paddingTop: '24px', paddingBottom: '48px' }}>
                {/* Navigation Tabs */}
                <nav className="nav-tabs" id="main-nav">
                    <button
                        className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('dashboard'); setSelectedAlert(null); }}
                        id="tab-dashboard"
                    >
                        📊 Dashboard
                    </button>
                    <button
                        className={`nav-tab ${activeTab === 'alerts' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('alerts'); setSelectedAlert(null); }}
                        id="tab-alerts"
                    >
                        🔔 All Alerts ({alerts.length})
                    </button>
                    <button
                        className={`nav-tab ${activeTab === 'digest' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('digest'); setSelectedAlert(null); }}
                        id="tab-digest"
                    >
                        📰 Safety Digest
                    </button>
                </nav>

                {/* Alert Detail View */}
                {selectedAlert ? (
                    <AlertDetail
                        alert={selectedAlert}
                        onBack={() => setSelectedAlert(null)}
                        onUpdate={handleUpdateAlert}
                        aiStatus={aiStatus}
                    />
                ) : (
                    <>
                        {/* DASHBOARD TAB */}
                        {activeTab === 'dashboard' && (
                            <>
                                {/* Stats Grid */}
                                <div className="stats-grid">
                                    <div className="stat-card">
                                        <div className="stat-icon">📊</div>
                                        <div className="stat-value">{alerts.length}</div>
                                        <div className="stat-label">Total Alerts</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-icon">🚨</div>
                                        <div className="stat-value" style={{ color: 'var(--color-critical)' }}>
                                            {alerts.filter(a => ['critical', 'high'].includes(a.severity)).length}
                                        </div>
                                        <div className="stat-label">Critical / High</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-icon">✅</div>
                                        <div className="stat-value" style={{ color: 'var(--color-low)' }}>
                                            {alerts.filter(a => a.status === 'verified').length}
                                        </div>
                                        <div className="stat-label">Verified</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-icon">🔇</div>
                                        <div className="stat-value" style={{ color: 'var(--text-muted)' }}>
                                            {noiseCount}
                                        </div>
                                        <div className="stat-label">Filtered as Noise</div>
                                    </div>
                                </div>

                                {/* Noise Filter Toggle */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h2 className="page-title">Recent Alerts</h2>
                                    <button
                                        className={`noise-toggle ${filterNoisy ? 'active' : ''}`}
                                        onClick={() => setFilterNoisy(!filterNoisy)}
                                        id="noise-filter-toggle"
                                    >
                                        <div className="toggle-switch"></div>
                                        <span>🔇 Filter Noise ({noiseCount})</span>
                                    </button>
                                </div>

                                {/* Recent Alerts */}
                                {loading ? (
                                    <div className="empty-state">
                                        <div className="ai-loading">
                                            <div className="ai-loading-dots">
                                                <span></span><span></span><span></span>
                                            </div>
                                            <span>Loading alerts...</span>
                                        </div>
                                    </div>
                                ) : displayedAlerts.length === 0 ? (
                                    <div className="empty-state">
                                        <div className="empty-state-icon">🛡</div>
                                        <div className="empty-state-title">All clear!</div>
                                        <div className="empty-state-text">
                                            No alerts match your current filters. Your community is looking safe.
                                        </div>
                                    </div>
                                ) : (
                                    <div className="alerts-list">
                                        {displayedAlerts.slice(0, 8).map(alert => (
                                            <AlertCard
                                                key={alert.id}
                                                alert={alert}
                                                onClick={setSelectedAlert}
                                                isNoise={noiseResults[alert.id]}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {/* ALERTS TAB */}
                        {activeTab === 'alerts' && (
                            <>
                                <div className="page-header">
                                    <h2 className="page-title">🔔 All Community Alerts</h2>
                                </div>

                                {/* Filters */}
                                <div className="filter-bar">
                                    <div className="search-input-wrapper">
                                        <span className="search-icon">🔍</span>
                                        <input
                                            className="search-input"
                                            type="text"
                                            placeholder="Search alerts by title, description, location, or tags..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            id="search-input"
                                        />
                                    </div>
                                    <select
                                        className="filter-select"
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                        id="category-filter"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                    <select
                                        className="filter-select"
                                        value={severityFilter}
                                        onChange={(e) => setSeverityFilter(e.target.value)}
                                        id="severity-filter"
                                    >
                                        {SEVERITIES.map(sev => (
                                            <option key={sev.value} value={sev.value}>{sev.label}</option>
                                        ))}
                                    </select>
                                    <button
                                        className={`noise-toggle ${filterNoisy ? 'active' : ''}`}
                                        onClick={() => setFilterNoisy(!filterNoisy)}
                                    >
                                        <div className="toggle-switch"></div>
                                        <span>🔇 Noise</span>
                                    </button>
                                </div>

                                {/* Alert List */}
                                {loading ? (
                                    <div className="empty-state">
                                        <div className="ai-loading">
                                            <div className="ai-loading-dots">
                                                <span></span><span></span><span></span>
                                            </div>
                                            <span>Loading alerts...</span>
                                        </div>
                                    </div>
                                ) : displayedAlerts.length === 0 ? (
                                    <div className="empty-state">
                                        <div className="empty-state-icon">🔍</div>
                                        <div className="empty-state-title">No alerts found</div>
                                        <div className="empty-state-text">
                                            Try adjusting your filters or search query.
                                        </div>
                                    </div>
                                ) : (
                                    <div className="alerts-list">
                                        {displayedAlerts.map(alert => (
                                            <AlertCard
                                                key={alert.id}
                                                alert={alert}
                                                onClick={setSelectedAlert}
                                                isNoise={noiseResults[alert.id]}
                                            />
                                        ))}
                                    </div>
                                )}

                                <div style={{ textAlign: 'center', marginTop: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    Showing {displayedAlerts.length} of {alerts.length} alerts
                                    {noiseCount > 0 && filterNoisy && ` (${noiseCount} noise alerts hidden)`}
                                </div>
                            </>
                        )}

                        {/* DIGEST TAB */}
                        {activeTab === 'digest' && (
                            <DigestView alerts={alerts} aiStatus={aiStatus} />
                        )}
                    </>
                )}
            </main>

            {/* Modals & Toasts */}
            <CreateAlertModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateAlert}
            />
            <ToastContainer toasts={toasts} />
        </>
    );
}
