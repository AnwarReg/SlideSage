// Settings management with localStorage persistence

export interface UserSettings {
  darkMode: boolean;
  autoSaveSummaries: boolean;
}

const SETTINGS_KEY = 'slidesage-settings';

const defaultSettings: UserSettings = {
  darkMode: false,
  autoSaveSummaries: true
};

export const settingsApi = {
  getSettings: (): UserSettings => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return { ...defaultSettings, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
    return defaultSettings;
  },

  saveSettings: (settings: UserSettings): void => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  updateSetting: <K extends keyof UserSettings>(
    key: K, 
    value: UserSettings[K]
  ): UserSettings => {
    const current = settingsApi.getSettings();
    const updated = { ...current, [key]: value };
    settingsApi.saveSettings(updated);
    return updated;
  }
};