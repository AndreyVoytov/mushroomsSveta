import localizationSourceIds from '../../generated/localizationSourceIds';

export type SupportedLanguage = 'ru' | 'en' | 'es' | 'tr' | 'pt' | 'ar' | 'id' | 'fr' | 'ja' | 'it' | 'de' | 'hi';
export type SupportedTextLanguage = 'ru' | 'en' | 'tr';
export type TextDirection = 'ltr' | 'rtl';

interface LocalizationBundle {
    language: SupportedLanguage;
    direction?: TextDirection;
    entries?: { [id: string]: string };
}

export default class LocalizationService {

    public static readonly SUPPORTED_LANGUAGES: SupportedLanguage[] = ['ru', 'en', 'es', 'tr', 'pt', 'ar', 'id', 'fr', 'ja', 'it', 'de', 'hi'];
    public static readonly YANDEX_RECOMMENDED_LANGUAGES: SupportedLanguage[] = ['en', 'es', 'tr', 'pt', 'ar', 'id', 'fr', 'ja', 'it', 'de', 'hi'];

    private static language: SupportedLanguage = 'ru';
    private static direction: TextDirection = 'ltr';
    private static entries: { [id: string]: string } = {};

    public static async bootstrap(): Promise<void> {
        this.language = this.detectLanguage();
        const bundle = await this.loadBundleWithFallback(this.language);
        this.entries = bundle.entries || {};
        this.direction = bundle.direction || 'ltr';

        if (typeof document !== 'undefined' && document.documentElement) {
            document.documentElement.lang = this.language;
            document.documentElement.dir = this.direction;
            document.title = this.get('ui.gameTitle', 'Грибы!');
        }
    }

    public static getLanguage(): SupportedLanguage {
        return this.language;
    }

    public static getTextLanguage(): SupportedTextLanguage {
        if (this.language === 'ru') {
            return 'ru';
        }
        if (this.language === 'tr') {
            return 'tr';
        }
        return 'en';
    }

    public static getDirection(): TextDirection {
        return this.direction;
    }

    public static isRussian(): boolean {
        return this.getTextLanguage() === 'ru';
    }

    public static isTurkish(): boolean {
        return this.getTextLanguage() === 'tr';
    }

    public static isEnglishLike(): boolean {
        return this.getTextLanguage() === 'en';
    }

    public static text(value: string): string {
        if (!value) {
            return value;
        }

        const sourceId = localizationSourceIds[this.normalizeKey(value)];
        if (!sourceId) {
            return value;
        }

        return this.get(sourceId, value);
    }

    public static get(id: string, fallback?: string, params?: { [key: string]: string | number }): string {
        const entry = id ? this.entries[id] : null;
        const resolved = entry !== undefined && entry !== null ? entry : (fallback || id);
        return this.applyParams(resolved, params);
    }

    public static tr(value: string, params?: { [key: string]: string | number }): string {
        return this.applyParams(this.text(value), params);
    }

    private static applyParams(value: string, params?: { [key: string]: string | number }): string {
        if (!params) {
            return value;
        }

        let result = value;
        Object.keys(params).forEach(key => {
            const safeValue = params[key] === null || params[key] === undefined ? '' : String(params[key]);
            result = result.split('{' + key + '}').join(safeValue);
        });
        return result;
    }

    private static detectLanguage(): SupportedLanguage {
        const forcedLanguage = this.readLanguageFromUrl();
        if (forcedLanguage) {
            return forcedLanguage;
        }

        if (typeof navigator !== 'undefined') {
            const candidates = (navigator.languages || []).concat([navigator.language || '']);
            for (let i = 0; i < candidates.length; i++) {
                const detected = this.normalizeLanguage(candidates[i]);
                if (detected) {
                    return detected;
                }
            }
        }

        return 'ru';
    }

    private static readLanguageFromUrl(): SupportedLanguage {
        if (typeof window === 'undefined' || !window.location) {
            return null;
        }

        const query = window.location.search || '';
        const match = query.match(/[?&]lang=([^&#]+)/i);
        if (!match || !match[1]) {
            return null;
        }

        try {
            return this.normalizeLanguage(decodeURIComponent(match[1]));
        } catch (_error) {
            return this.normalizeLanguage(match[1]);
        }
    }

    private static normalizeLanguage(value: string): SupportedLanguage {
        if (!value) {
            return null;
        }

        const raw = value.toLowerCase().replace(/_/g, '-').trim();
        const direct = raw.split('-')[0];
        const alias = direct === 'in' ? 'id' : direct;

        if (this.SUPPORTED_LANGUAGES.indexOf(alias as SupportedLanguage) !== -1) {
            return alias as SupportedLanguage;
        }

        return null;
    }

    private static async loadBundleWithFallback(language: SupportedLanguage): Promise<LocalizationBundle> {
        try {
            return await this.loadBundle(language);
        } catch (_error) {
            if (language !== 'en') {
                try {
                    return await this.loadBundle('en');
                } catch (_fallbackError) {
                    // ignore
                }
            }
        }

        return {
            language: language,
            direction: 'ltr',
            entries: {}
        };
    }

    private static normalizeKey(value: string): string {
        return value
            .replace(/\r\n?/g, '\n')
            .replace(/[ \t]*\n[ \t]*/g, '\n')
            .replace(/[ \t]+$/gm, '')
            .replace(/[ \t]{2,}/g, ' ')
            .trim();
    }

    private static loadBundle(language: SupportedLanguage): Promise<LocalizationBundle> {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open('GET', 'assets/localization/' + language + '.json', true);
            request.onreadystatechange = () => {
                if (request.readyState !== 4) {
                    return;
                }

                if (request.status >= 200 && request.status < 300) {
                    try {
                        const parsed = JSON.parse(request.responseText);
                        resolve({
                            language: parsed.language || language,
                            direction: parsed.direction || 'ltr',
                            entries: parsed.entries || {}
                        });
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    reject(new Error('Could not load localization bundle for ' + language));
                }
            };
            request.send();
        });
    }
}
