export function getPlatformStyle(platform) {
    const STYLES = {
        'Gemini': 'border-purple-500',
        'Claude': 'border-orange-500',
        'ChatGPT': 'border-teal-500',
        'Web (HTML/JS propio)': 'border-blue-500',
        'GitHub Pages': 'border-black',
        'Google Sites': 'border-sky-500',
        'Default': 'border-gray-400'
    };
    if (!platform) return STYLES.Default;
    const key = Object.keys(STYLES).find(k => platform.includes(k) && k !== 'Default');
    return STYLES[key] || STYLES.Default;
}

export function getResourceStyle(tipo) {
    const t = (tipo || '').toLowerCase();
    if (t.includes('imagen') || t.includes('image')) return 'border-fuchsia-500';
    if (t.includes('video')) return 'border-rose-500';
    if (t.includes('audio')) return 'border-emerald-500';
    return 'border-slate-400';
}

export function createFilterLink(text, category) {
    // This will be handled differently in React, for now, just return the text.
    return text;
}
