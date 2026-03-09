/**
 * Shared formatting utilities for the S-Drone prototype
 */

/**
 * Returns a human-readable relative time string from an ISO date string.
 * Examples: "2m ago", "5h ago", "3d ago", "Jan 15"
 */
export function getRelativeTime(isoDate: string): string {
    const now = new Date();
    const date = new Date(isoDate);
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Returns a time-of-day greeting string.
 */
export function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

/**
 * Formats a Date object to a readable date string.
 * Example: "Friday, 7 March 2026"
 */
/**
 * Formats an ISO date string to a short date like "Jan 27".
 */
export function getShortDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getFormattedDate(date: Date = new Date()): string {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}
