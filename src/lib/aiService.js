const NOISE_KEYWORDS = [
    'omg', 'lol', 'ugh', 'annoying', 'ridiculous', 'terrible',
    'moving out', 'hate', 'worst', 'can\'t believe', 'so tired',
    'unacceptable', 'disgusting', 'whatever', 'smh'
];

const ACTIONABLE_KEYWORDS = [
    'breach', 'phishing', 'scam', 'ransomware', 'theft', 'stolen',
    'warning', 'advisory', 'alert', 'emergency', 'evacuation',
    'vulnerability', 'exploit', 'compromised', 'malware', 'flood',
    'fire', 'outage', 'shutdown', 'hazard', 'recall'
];

const CATEGORY_KEYWORDS = {
    cyber_threat: ['phishing', 'malware', 'ransomware', 'hack', 'exploit', 'vulnerability', 'trojan', 'ddos', 'botnet', 'router', 'wifi', 'network'],
    data_breach: ['breach', 'leak', 'exposed', 'compromised data', 'personal information', 'credentials'],
    scam: ['scam', 'fraud', 'impersonat', 'fake', 'ponzi', 'gift card', 'irs', 'social security'],
    theft: ['theft', 'stolen', 'break-in', 'burglary', 'robbery', 'shoplifting', 'package theft'],
    infrastructure: ['street light', 'road', 'water main', 'power outage', 'infrastructure', 'construction', 'sewer', 'bridge'],
    weather: ['flood', 'storm', 'tornado', 'hurricane', 'weather', 'lightning', 'snow', 'ice', 'heat wave'],
    community_event: ['training', 'event', 'workshop', 'meeting', 'volunteer', 'fundraiser', 'celebration'],
};

const SEVERITY_WEIGHT = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
    info: 0
};

const DEFENSE_CHECKLISTS = {
    cyber_threat: [
        'Change all default passwords on routers and IoT devices immediately',
        'Enable two-factor authentication on all important accounts',
        'Update router firmware to the latest version',
        'Run a full antivirus scan on all connected devices',
        'Consider using a VPN for sensitive online activities'
    ],
    data_breach: [
        'Check if your email appears on haveibeenpwned.com',
        'Change passwords for any accounts associated with the breached service',
        'Enable credit monitoring and consider a credit freeze',
        'Watch for suspicious emails that may use leaked information',
        'Report any unauthorized account activity immediately'
    ],
    scam: [
        'Do not provide personal information to unsolicited callers or visitors',
        'Verify the identity of anyone claiming to be from an organization',
        'Report scam attempts to local police and the FTC at reportfraud.ftc.gov',
        'Warn elderly family members and neighbors about the specific scam',
        'Block suspicious phone numbers and email addresses'
    ],
    theft: [
        'Secure valuables and avoid leaving packages unattended',
        'Install or check security cameras and motion-activated lights',
        'Report all incidents to local police for pattern tracking',
        'Consider a package lockbox or alternative delivery location',
        'Coordinate with neighbors for mutual surveillance'
    ],
    infrastructure: [
        'Follow official guidance from local authorities',
        'Report the issue to the relevant city department',
        'Use alternative routes if roads are affected',
        'Keep emergency supplies accessible',
        'Stay informed through official city communication channels'
    ],
    weather: [
        'Follow all evacuation orders from local authorities',
        'Prepare an emergency go-bag with essentials',
        'Charge all devices and have backup power ready',
        'Know the location of your nearest emergency shelter',
        'Check on elderly or vulnerable neighbors'
    ],
    general: [
        'Stay informed through official community channels',
        'Report concerns to appropriate authorities',
        'Maintain emergency contact information',
        'Review your household emergency plan',
        'Connect with neighborhood watch programs'
    ]
};

export function detectNoiseRuleBased(text) {
    const lowerText = text.toLowerCase();

    let noiseScore = 0;
    let signalScore = 0;

    NOISE_KEYWORDS.forEach(keyword => {
        if (lowerText.includes(keyword)) noiseScore += 1;
    });

    ACTIONABLE_KEYWORDS.forEach(keyword => {
        if (lowerText.includes(keyword)) signalScore += 2;
    });

    const exclamationCount = (text.match(/!/g) || []).length;
    const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;

    if (exclamationCount > 3) noiseScore += 2;
    if (capsRatio > 0.3 && text.length > 20) noiseScore += 1;

    if (text.length < 50 && signalScore === 0) noiseScore += 1;

    const isNoise = noiseScore > signalScore;

    return {
        isNoise,
        confidence: Math.min(0.95, Math.abs(noiseScore - signalScore) / (noiseScore + signalScore + 1)),
        noiseScore,
        signalScore,
        method: 'rule-based'
    };
}

export function categorizeFallback(text) {
    const lowerText = text.toLowerCase();
    let bestCategory = 'general';
    let bestScore = 0;

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        let score = 0;
        keywords.forEach(keyword => {
            if (lowerText.includes(keyword)) score += 1;
        });
        if (score > bestScore) {
            bestScore = score;
            bestCategory = category;
        }
    }

    return {
        category: bestCategory,
        confidence: Math.min(0.9, bestScore * 0.25),
        method: 'rule-based'
    };
}

export function summarizeFallback(text) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const summary = sentences.slice(0, 2).join(' ').trim();

    return {
        summary: summary.length > 200 ? summary.substring(0, 200) + '...' : summary,
        method: 'rule-based'
    };
}

export function getDefenseChecklistFallback(category) {
    const checklist = DEFENSE_CHECKLISTS[category] || DEFENSE_CHECKLISTS.general;
    return {
        checklist,
        method: 'rule-based'
    };
}

export function generateDigestFallback(alerts) {
    const verified = alerts.filter(a => a.status === 'verified');
    const actionable = verified.filter(a => a.actionable);
    const critical = actionable.filter(a => ['critical', 'high'].includes(a.severity));

    const categoryCounts = {};
    verified.forEach(a => {
        categoryCounts[a.category] = (categoryCounts[a.category] || 0) + 1;
    });

    const topCategories = Object.entries(categoryCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([cat]) => formatCategoryName(cat));

    let summary = `Your community has ${verified.length} verified alert${verified.length !== 1 ? 's' : ''}. `;

    if (critical.length > 0) {
        summary += `⚠️ ${critical.length} require${critical.length === 1 ? 's' : ''} immediate attention. `;
    }

    if (topCategories.length > 0) {
        summary += `Top concerns: ${topCategories.join(', ')}. `;
    }

    summary += actionable.length > 0
        ? `${actionable.length} alert${actionable.length !== 1 ? 's' : ''} have actionable steps you can take.`
        : 'No immediately actionable items at this time.';

    return {
        summary,
        criticalCount: critical.length,
        actionableCount: actionable.length,
        topCategories,
        method: 'rule-based'
    };
}

export function formatCategoryName(category) {
    const names = {
        cyber_threat: 'Cyber Threats',
        data_breach: 'Data Breaches',
        scam: 'Scams & Fraud',
        theft: 'Theft',
        infrastructure: 'Infrastructure',
        weather: 'Weather',
        community_event: 'Community Events',
        noise: 'Noise/Venting',
        general: 'General'
    };
    return names[category] || category;
}

export function getSeverityWeight(severity) {
    return SEVERITY_WEIGHT[severity] || 0;
}
