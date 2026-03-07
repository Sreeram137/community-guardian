/**
 * API Route: /api/alerts
 * Handles CRUD operations for community safety alerts
 */
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Load initial data from synthetic dataset
function loadAlerts() {
    const dataPath = path.join(process.cwd(), 'data', 'synthetic_alerts.json');
    try {
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading alerts:', error);
        return [];
    }
}

// In-memory store (resets on server restart — acceptable for prototype)
let alertsStore = null;

function getAlerts() {
    if (!alertsStore) {
        alertsStore = loadAlerts();
    }
    return alertsStore;
}

// GET — Retrieve all alerts with optional filtering
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const severity = searchParams.get('severity');
        const search = searchParams.get('search');
        const status = searchParams.get('status');

        let alerts = [...getAlerts()];

        // Apply filters
        if (category && category !== 'all') {
            alerts = alerts.filter(a => a.category === category);
        }

        if (severity && severity !== 'all') {
            alerts = alerts.filter(a => a.severity === severity);
        }

        if (status && status !== 'all') {
            alerts = alerts.filter(a => a.status === status);
        }

        if (search) {
            const lowerSearch = search.toLowerCase();
            alerts = alerts.filter(a =>
                a.title.toLowerCase().includes(lowerSearch) ||
                a.description.toLowerCase().includes(lowerSearch) ||
                a.location.toLowerCase().includes(lowerSearch) ||
                a.tags.some(t => t.toLowerCase().includes(lowerSearch))
            );
        }

        // Sort by timestamp (newest first) and severity
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
        alerts.sort((a, b) => {
            const severityDiff = (severityOrder[a.severity] || 5) - (severityOrder[b.severity] || 5);
            if (severityDiff !== 0) return severityDiff;
            return new Date(b.timestamp) - new Date(a.timestamp);
        });

        return NextResponse.json({ alerts, total: alerts.length });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch alerts' },
            { status: 500 }
        );
    }
}

// POST — Create a new alert
export async function POST(request) {
    try {
        const body = await request.json();

        // Input validation
        const errors = [];
        if (!body.title || body.title.trim().length < 5) {
            errors.push('Title must be at least 5 characters');
        }
        if (!body.description || body.description.trim().length < 10) {
            errors.push('Description must be at least 10 characters');
        }
        if (!body.category) {
            errors.push('Category is required');
        }
        if (!body.severity) {
            errors.push('Severity is required');
        }
        if (!body.location || body.location.trim().length < 2) {
            errors.push('Location is required');
        }

        if (errors.length > 0) {
            return NextResponse.json(
                { errors },
                { status: 400 }
            );
        }

        const alerts = getAlerts();
        const newAlert = {
            id: `alert-${Date.now()}`,
            title: body.title.trim(),
            description: body.description.trim(),
            category: body.category,
            severity: body.severity,
            source: body.source || 'User Report',
            location: body.location.trim(),
            timestamp: new Date().toISOString(),
            status: 'unverified',
            actionable: body.actionable ?? true,
            tags: body.tags || []
        };

        alerts.unshift(newAlert);

        return NextResponse.json({ alert: newAlert }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create alert' },
            { status: 500 }
        );
    }
}
