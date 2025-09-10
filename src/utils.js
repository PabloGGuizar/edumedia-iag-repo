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

export function getResourceGradient(tipo) {
    const t = (tipo || '').toLowerCase();
    if (t.includes('imagen') || t.includes('image')) return 'bg-gradient-to-r from-fuchsia-500 to-fuchsia-300';
    if (t.includes('video')) return 'bg-gradient-to-r from-rose-500 to-rose-300';
    if (t.includes('audio')) return 'bg-gradient-to-r from-emerald-500 to-emerald-300';
    return 'bg-gradient-to-r from-slate-400 to-slate-300';
}

export function createFilterLink(text, category) {
    // This will be handled differently in React, for now, just return the text.
    return text;
}
