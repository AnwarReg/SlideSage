import { useState, useEffect } from 'react';
import { settingsApi, UserSettings } from '../lib/settings';

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(settingsApi.getSettings());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load settings on component mount
    setSettings(settingsApi.getSettings());
  }, []);

  const handleToggle = (key: keyof UserSettings) => {
    const newValue = !settings[key];
    const updatedSettings = settingsApi.updateSetting(key, newValue);
    setSettings(updatedSettings);
    
    // Show saved indicator
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const resetSettings = () => {
    const defaultSettings = { darkMode: false, autoSaveSummaries: true };
    settingsApi.saveSettings(defaultSettings);
    setSettings(defaultSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Customize your SlideSage experience</p>
      </div>

      {/* Save Indicator */}
      {saved && (
        <div className="mb-6 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700">
          ✓ Settings saved automatically
        </div>
      )}

      {/* Settings List */}
      <div className="bg-white border rounded-lg divide-y">
        {/* Dark Mode Setting */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium mb-1">🌙 Dark Mode</h3>
              <p className="text-sm text-gray-600">
                Use dark theme throughout the application
              </p>
            </div>
            <button
              onClick={() => handleToggle('darkMode')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.darkMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="mt-3 text-sm text-gray-500">
            Status: {settings.darkMode ? 'Enabled' : 'Disabled'}
            {settings.darkMode && ' (Note: Dark mode styling not implemented in this MVP)'}
          </div>
        </div>

        {/* Auto-save Setting */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium mb-1">💾 Auto-save Summaries</h3>
              <p className="text-sm text-gray-600">
                Automatically save generated summaries and analysis results
              </p>
            </div>
            <button
              onClick={() => handleToggle('autoSaveSummaries')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoSaveSummaries ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoSaveSummaries ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="mt-3 text-sm text-gray-500">
            Status: {settings.autoSaveSummaries ? 'Enabled' : 'Disabled'}
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="mt-8 bg-white border rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">⚙️ Advanced</h3>
        <div className="space-y-4">
          <button
            onClick={resetSettings}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
          >
            Reset to Defaults
          </button>
          
          <div className="text-sm text-gray-500">
            <p className="mb-2"><strong>Current Settings:</strong></p>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
              {JSON.stringify(settings, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* MVP Note */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">📝 MVP Note</h4>
        <p className="text-sm text-blue-700">
          These settings are saved to localStorage and will persist between sessions. 
          In the full version, these preferences would be saved to your user profile on the server.
        </p>
      </div>
    </div>
  );
}