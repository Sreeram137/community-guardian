import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function loadAlerts() {
    const dataPath = path.join(process.cwd(), 'data', 'synthetic_alerts.json');
    try {
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

let alertsStore = null;
function getAlerts() {
    if (!alertsStore) {
        alertsStore = loadAlerts();
    }
    return alertsStore;
}

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const alerts = getAlerts();
        const alert = alerts.find(a => a.id === id);

        if (!alert) {
            return NextResponse.json(
                { error: 'Alert not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ alert });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch alert' },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const alerts = getAlerts();
        const index = alerts.findIndex(a => a.id === id);

        if (index === -1) {
            return NextResponse.json(
                { error: 'Alert not found' },
                { status: 404 }
            );
        }

        const errors = [];
        if (body.title !== undefined && body.title.trim().length < 5) {
            errors.push('Title must be at least 5 characters');
        }
        if (body.description !== undefined && body.description.trim().length < 10) {
            errors.push('Description must be at least 10 characters');
        }

        if (errors.length > 0) {
            return NextResponse.json({ errors }, { status: 400 });
        }

        alerts[index] = {
            ...alerts[index],
            ...body,
            id: alerts[index].id,
            updatedAt: new Date().toISOString()
        };

        return NextResponse.json({ alert: alerts[index] });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update alert' },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        const alerts = getAlerts();
        const index = alerts.findIndex(a => a.id === id);

        if (index === -1) {
            return NextResponse.json(
                { error: 'Alert not found' },
                { status: 404 }
            );
        }

        alerts.splice(index, 1);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete alert' },
            { status: 500 }
        );
    }
}
