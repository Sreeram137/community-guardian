const {
    detectNoiseRuleBased,
    categorizeFallback,
    summarizeFallback,
    getDefenseChecklistFallback,
    generateDigestFallback,
    formatCategoryName,
    getSeverityWeight
} = require('../src/lib/aiService');

describe('Noise Detection — Happy Path', () => {
    test('should identify a clear actionable alert as NOT noise', () => {
        const text = 'Police advisory: multiple vehicle break-ins reported near Maple Park. Thieves targeting electronics left in vehicles. Increased patrols in the area.';

        const result = detectNoiseRuleBased(text);

        expect(result.isNoise).toBe(false);
        expect(result.method).toBe('rule-based');
        expect(result.signalScore).toBeGreaterThan(0);
        expect(result).toHaveProperty('confidence');
        expect(result.confidence).toBeGreaterThanOrEqual(0);
        expect(result.confidence).toBeLessThanOrEqual(1);
    });

    test('should identify venting/complaining as noise', () => {
        const text = 'OMG I can\'t believe how terrible this neighborhood is!!! Everything is annoying and ridiculous. I\'m so tired of living here. Moving out ASAP!!!';

        const result = detectNoiseRuleBased(text);

        expect(result.isNoise).toBe(true);
        expect(result.method).toBe('rule-based');
        expect(result.noiseScore).toBeGreaterThan(0);
    });

    test('should categorize phishing alert correctly', () => {
        const text = 'Warning: residents are receiving phishing emails pretending to be from the local bank. Do not click malicious links.';

        const result = categorizeFallback(text);

        expect(result.category).toBe('cyber_threat');
        expect(result.method).toBe('rule-based');
        expect(result.confidence).toBeGreaterThan(0);
    });

    test('should generate a non-empty summary', () => {
        const text = 'A new ransomware strain has been detected targeting home routers. Users should update firmware immediately. The attack vector uses default credentials on consumer devices.';

        const result = summarizeFallback(text);

        expect(result.summary).toBeDefined();
        expect(result.summary.length).toBeGreaterThan(0);
        expect(result.method).toBe('rule-based');
    });

    test('should return correct defense checklist for cyber_threat', () => {
        const result = getDefenseChecklistFallback('cyber_threat');

        expect(result.checklist).toBeInstanceOf(Array);
        expect(result.checklist.length).toBe(5);
        expect(result.method).toBe('rule-based');
        result.checklist.forEach(item => {
            expect(typeof item).toBe('string');
            expect(item.length).toBeGreaterThan(0);
        });
    });
});

describe('AI Service — Edge Cases', () => {
    test('should handle empty string without crashing', () => {
        const noiseResult = detectNoiseRuleBased('');
        expect(noiseResult).toHaveProperty('isNoise');
        expect(noiseResult.method).toBe('rule-based');

        const catResult = categorizeFallback('');
        expect(catResult).toHaveProperty('category');
        expect(catResult.method).toBe('rule-based');

        const sumResult = summarizeFallback('');
        expect(sumResult).toHaveProperty('summary');
    });

    test('should handle text with only punctuation/symbols', () => {
        const result = detectNoiseRuleBased('!!! ??? ... ### @@@');

        expect(result).toHaveProperty('isNoise');
        expect(result.method).toBe('rule-based');
    });

    test('should handle extremely long text without crashing', () => {
        const longText = 'This is a security advisory about phishing. '.repeat(500);

        const noiseResult = detectNoiseRuleBased(longText);
        expect(noiseResult).toHaveProperty('isNoise');
        expect(noiseResult.isNoise).toBe(false);

        const sumResult = summarizeFallback(longText);
        expect(sumResult.summary.length).toBeLessThanOrEqual(250);
    });

    test('should handle unknown category gracefully', () => {
        const result = getDefenseChecklistFallback('unknown_category_xyz');

        expect(result.checklist).toBeInstanceOf(Array);
        expect(result.checklist.length).toBeGreaterThan(0);
        expect(result.method).toBe('rule-based');
    });

    test('should generate digest from empty alerts array', () => {
        const result = generateDigestFallback([]);

        expect(result.summary).toBeDefined();
        expect(result.summary).toContain('0 verified alert');
        expect(result.criticalCount).toBe(0);
        expect(result.actionableCount).toBe(0);
        expect(result.method).toBe('rule-based');
    });

    test('should handle mixed signal/noise text correctly', () => {
        const text = 'OMG this is so annoying!!! But seriously, there was a phishing scam reported at the local bank. A suspicious breach of the system was discovered.';

        const result = detectNoiseRuleBased(text);

        expect(result.isNoise).toBe(false);
        expect(result.signalScore).toBeGreaterThan(0);
        expect(result.noiseScore).toBeGreaterThan(0);
    });

    test('formatCategoryName should handle unknown categories', () => {
        expect(formatCategoryName('xyz_unknown')).toBe('xyz_unknown');
        expect(formatCategoryName('cyber_threat')).toBe('Cyber Threats');
    });

    test('getSeverityWeight should return 0 for unknown severity', () => {
        expect(getSeverityWeight('critical')).toBe(4);
        expect(getSeverityWeight('unknown')).toBe(0);
    });

    test('should generate digest with real synthetic data', () => {
        const sampleAlerts = [
            { id: '1', title: 'Phishing Alert', severity: 'critical', status: 'verified', actionable: true, category: 'cyber_threat' },
            { id: '2', title: 'Street light out', severity: 'low', status: 'verified', actionable: true, category: 'infrastructure' },
            { id: '3', title: 'Dog barking', severity: 'low', status: 'unverified', actionable: false, category: 'noise' },
        ];

        const result = generateDigestFallback(sampleAlerts);

        expect(result.summary).toContain('2 verified alert');
        expect(result.criticalCount).toBe(1);
        expect(result.method).toBe('rule-based');
    });
});
