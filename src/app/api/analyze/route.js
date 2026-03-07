/**
 * API Route: /api/analyze
 * AI-powered alert analysis with rule-based fallback
 */
import { NextResponse } from 'next/server';
import {
    detectNoiseRuleBased,
    categorizeFallback,
    summarizeFallback,
    getDefenseChecklistFallback,
    generateDigestFallback,
    formatCategoryName
} from '../../../lib/aiService';

// Check if OpenAI API key is available
function hasOpenAIKey() {
    return !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here';
}

// Call OpenAI API
async function callOpenAI(messages, maxTokens = 500) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
            messages,
            max_tokens: maxTokens,
            temperature: 0.3
        })
    });

    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { action, text, category, alerts } = body;

        if (!action) {
            return NextResponse.json(
                { error: 'Action parameter is required' },
                { status: 400 }
            );
        }

        // Determine if AI is available
        const aiAvailable = hasOpenAIKey();
        let result;

        switch (action) {
            case 'analyze': {
                // Noise detection + categorization + summary
                if (!text) {
                    return NextResponse.json(
                        { error: 'Text parameter is required for analysis' },
                        { status: 400 }
                    );
                }

                if (aiAvailable) {
                    try {
                        const aiResponse = await callOpenAI([
                            {
                                role: 'system',
                                content: `You are a community safety AI assistant. Analyze the following alert text and provide:
1. isNoise: whether this is noise/venting (true/false)
2. category: one of [cyber_threat, data_breach, scam, theft, infrastructure, weather, community_event, noise, general]
3. severity: one of [critical, high, medium, low, info]
4. summary: a concise 1-2 sentence summary focusing on actionable info
5. confidence: your confidence level (0-1)

Respond ONLY in valid JSON format with these exact keys.`
                            },
                            { role: 'user', content: text }
                        ], 300);

                        const parsed = JSON.parse(aiResponse);
                        result = { ...parsed, method: 'ai' };
                    } catch (aiError) {
                        console.warn('AI analysis failed, falling back to rules:', aiError.message);
                        const noise = detectNoiseRuleBased(text);
                        const cat = categorizeFallback(text);
                        const sum = summarizeFallback(text);
                        result = {
                            isNoise: noise.isNoise,
                            category: cat.category,
                            summary: sum.summary,
                            confidence: Math.max(noise.confidence, cat.confidence),
                            method: 'rule-based',
                            fallbackReason: aiError.message
                        };
                    }
                } else {
                    const noise = detectNoiseRuleBased(text);
                    const cat = categorizeFallback(text);
                    const sum = summarizeFallback(text);
                    result = {
                        isNoise: noise.isNoise,
                        category: cat.category,
                        summary: sum.summary,
                        confidence: Math.max(noise.confidence, cat.confidence),
                        method: 'rule-based',
                        fallbackReason: 'No API key configured'
                    };
                }
                break;
            }

            case 'checklist': {
                const cat = category || 'general';

                if (aiAvailable) {
                    try {
                        const aiResponse = await callOpenAI([
                            {
                                role: 'system',
                                content: `You are a cybersecurity and community safety expert. Generate a proactive defense checklist of 5 specific, actionable steps for the given threat category. Be concise but specific. Respond in JSON format: { "checklist": ["step1", "step2", ...] }`
                            },
                            { role: 'user', content: `Category: ${formatCategoryName(cat)}${text ? `\nContext: ${text}` : ''}` }
                        ], 400);

                        const parsed = JSON.parse(aiResponse);
                        result = { ...parsed, method: 'ai' };
                    } catch (aiError) {
                        console.warn('AI checklist failed, using fallback:', aiError.message);
                        result = {
                            ...getDefenseChecklistFallback(cat),
                            fallbackReason: aiError.message
                        };
                    }
                } else {
                    result = {
                        ...getDefenseChecklistFallback(cat),
                        fallbackReason: 'No API key configured'
                    };
                }
                break;
            }

            case 'digest': {
                if (!alerts || !Array.isArray(alerts)) {
                    return NextResponse.json(
                        { error: 'Alerts array is required for digest' },
                        { status: 400 }
                    );
                }

                if (aiAvailable) {
                    try {
                        const alertSummaries = alerts
                            .filter(a => a.status === 'verified')
                            .slice(0, 10)
                            .map(a => `[${a.severity.toUpperCase()}] ${a.title} (${formatCategoryName(a.category)})`)
                            .join('\n');

                        const aiResponse = await callOpenAI([
                            {
                                role: 'system',
                                content: `You are a calm, empowering community safety AI. Generate a brief safety digest summary from the following verified alerts. Be informative but not alarmist. Highlight critical items first, then provide a reassuring overall assessment. Include the count of critical items and actionable items. Respond in JSON format: { "summary": "...", "criticalCount": N, "actionableCount": N, "topCategories": ["cat1", "cat2"] }`
                            },
                            { role: 'user', content: alertSummaries }
                        ], 500);

                        const parsed = JSON.parse(aiResponse);
                        result = { ...parsed, method: 'ai' };
                    } catch (aiError) {
                        console.warn('AI digest failed, using fallback:', aiError.message);
                        result = {
                            ...generateDigestFallback(alerts),
                            fallbackReason: aiError.message
                        };
                    }
                } else {
                    result = {
                        ...generateDigestFallback(alerts),
                        fallbackReason: 'No API key configured'
                    };
                }
                break;
            }

            default:
                return NextResponse.json(
                    { error: `Unknown action: ${action}` },
                    { status: 400 }
                );
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Analysis error:', error);
        return NextResponse.json(
            { error: 'Analysis failed', details: error.message },
            { status: 500 }
        );
    }
}
