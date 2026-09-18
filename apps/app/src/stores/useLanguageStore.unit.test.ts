import {
  syncDocumentLanguage,
  useLanguageStore,
} from '@/stores/useLanguageStore';

jest.mock('@/i18n', () => ({
  __esModule: true,
  default: {
    changeLanguage: jest.fn(),
  },
}));

import i18n from '@/i18n';

describe('stores/useLanguageStore (unit)', () => {
  beforeEach(() => {
    useLanguageStore.setState({ language: 'ko' });
    (i18n.changeLanguage as jest.Mock).mockClear();
    document.documentElement.lang = 'ko';
  });

  it('syncDocumentLanguage no-ops for empty values', () => {
    syncDocumentLanguage(undefined);
    syncDocumentLanguage(null);
    syncDocumentLanguage('');
    expect(i18n.changeLanguage).not.toHaveBeenCalled();
  });

  it('syncDocumentLanguage updates i18n and document lang', () => {
    syncDocumentLanguage('en');
    expect(i18n.changeLanguage).toHaveBeenCalledWith('en');
    expect(document.documentElement.lang).toBe('en');
  });

  it('setLanguage updates store and document', () => {
    useLanguageStore.getState().setLanguage('ja');
    expect(useLanguageStore.getState().language).toBe('ja');
    expect(i18n.changeLanguage).toHaveBeenCalledWith('ja');
    expect(document.documentElement.lang).toBe('ja');
  });
});
