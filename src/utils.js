export function getPlatformStyle(platform) {
    const STYLES = {
        'Gemini': 'border-purple-500 dark:border-purple-400',
        'Claude': 'border-orange-500 dark:border-orange-400',
        'ChatGPT': 'border-teal-500 dark:border-teal-400',
        'Web (HTML/JS propio)': 'border-blue-500 dark:border-blue-400',
        'GitHub Pages': 'border-black dark:border-gray-200',
        'Google Sites': 'border-sky-500 dark:border-sky-400',
        'Default': 'border-gray-400 dark:border-gray-500'
    };
    if (!platform) return STYLES.Default;
    const key = Object.keys(STYLES).find(k => platform.includes(k) && k !== 'Default');
    return STYLES[key] || STYLES.Default;
}

export function createFilterLink(text, category) {
    // This will be handled differently in React, for now, just return the text.
    return text;
}
