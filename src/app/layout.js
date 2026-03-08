import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'SafeSignal — AI-Powered Safety & Digital Wellness',
    description: 'An intelligent community safety platform that aggregates local safety and digital security data, using AI to filter noise and provide calm, actionable safety digests.',
    keywords: ['community safety', 'digital wellness', 'AI', 'security alerts', 'neighborhood safety'],
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div id="app-root">
                    {children}
                </div>
            </body>
        </html>
    );
}
