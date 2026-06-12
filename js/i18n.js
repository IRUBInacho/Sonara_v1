document.addEventListener('DOMContentLoaded', () => {
    // 1. Detect language
    const supportedLangs = ['es', 'en'];
    let currentLang = localStorage.getItem('sonara_lang');

    if (!currentLang) {
        const browserLang = navigator.language.slice(0, 2).toLowerCase();
        currentLang = supportedLangs.includes(browserLang) ? browserLang : 'es'; // default to es
    }

    // 2. Fetch and apply translations
    async function setLanguage(lang) {
        if (!supportedLangs.includes(lang)) lang = 'es';

        try {
            const response = await fetch(`locales/${lang}.json`);
            if (!response.ok) throw new Error(`Could not load locales/${lang}.json`);

            const translations = await response.json();

            // Helper to get nested value by string path (e.g. "hero.title_part1")
            const getNestedValue = (obj, path) => {
                return path.split('.').reduce((acc, part) => acc && acc[part], obj);
            };

            // Update DOM elements
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                const text = getNestedValue(translations, key);
                if (text) {
                    // Use innerHTML to allow basic tags like <br> in translations
                    el.innerHTML = text;
                }
            });

            // Update HTML lang attribute
            document.documentElement.lang = lang;

            // Update UI Switcher
            document.querySelectorAll('.lang-btn').forEach(btn => {
                if (btn.dataset.lang === lang) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            // Save preference
            localStorage.setItem('sonara_lang', lang);
            currentLang = lang;

        } catch (error) {
            console.error("i18n error:", error);
        }
    }

    // 3. Attach events to language switcher buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = e.currentTarget.dataset.lang;
            if (lang !== currentLang) {
                setLanguage(lang);
            }
        });
    });

    // 4. Initial load
    setLanguage(currentLang);
});
