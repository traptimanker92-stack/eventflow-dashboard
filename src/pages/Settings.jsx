import React, { useRef } from 'react';
import { useEventContext } from '../context/EventContext';
import { exportToJSON } from '../utils/exportUtils';
import {
  Settings as SettingsIcon,
  Download,
  Upload,
  RotateCcw,
  Database,
  Code2,
  Sliders,
} from 'lucide-react';

export const Settings = () => {
  const {
    settings,
    setSettings,
    events,
    registrations,
    resetToDemoData,
    importData,
    openConfirmModal,
    showToast,
  } = useEventContext();

  const fileInputRef = useRef(null);

  const handleExportBackup = () => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings,
      events,
      registrations,
    };
    exportToJSON(backup, `eventflow-backup-${Date.now()}.json`);
    showToast('Backup Created', 'JSON file containing all events and attendees has been downloaded.');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (json.events || json.registrations) {
          importData(json);
        } else {
          showToast('Invalid File', 'The selected JSON does not match the EventFlow schema.', 'error');
        }
      } catch (err) {
        showToast('Parse Error', 'Failed to read JSON file.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetData = () => {
    openConfirmModal({
      title: 'Reset to Sample Demo Data?',
      message:
        'This will reset your local database to the pristine demo dataset. Any custom events or attendees added will be replaced.',
      confirmText: 'Reset Database',
      isDanger: true,
      onConfirm: resetToDemoData,
    });
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          System Settings & Data Controls
        </h2>
        <p className="text-xs sm:text-sm text-gray-400">
          Configure interface preferences, manage LocalStorage state, and export/import system snapshots
        </p>
      </div>

      {/* Grid of Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Data Management & Backup */}
        <div className="glass-card rounded-3xl p-6 border border-gray-800/80 flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">LocalStorage Persistence</h3>
                <p className="text-xs text-gray-400">Manage browser client-side database</p>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              All events, attendees, and operational records are automatically persisted in your browser's LocalStorage. You can export complete backups or restore previous saves anytime.
            </p>

            <div className="space-y-2.5">
              <button
                onClick={handleExportBackup}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-900/90 hover:bg-gray-800 border border-gray-700/80 text-xs font-bold text-gray-200 hover:text-white transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Download className="w-4 h-4 text-indigo-400" />
                  <span>Export JSON Backup ({events.length} Events, {registrations.length} Attendees)</span>
                </div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold">JSON</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-900/90 hover:bg-gray-800 border border-gray-700/80 text-xs font-bold text-gray-200 hover:text-white transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Upload className="w-4 h-4 text-cyan-400" />
                  <span>Restore / Import JSON File</span>
                </div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Upload</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800">
            <button
              onClick={handleResetData}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-rose-200 text-xs font-bold transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Sample Demo Dataset</span>
            </button>
          </div>
        </div>

        {/* Section 2: UI Preferences */}
        <div className="glass-card rounded-3xl p-6 border border-gray-800/80 flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-fuchsia-600/20 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Interface & Visual Effects</h3>
                <p className="text-xs text-gray-400">Customize dashboard interactions</p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {/* Animation Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-900/90 border border-gray-800">
                <div>
                  <p className="text-xs font-bold text-white">Micro-Interactions & Confetti</p>
                  <p className="text-[11px] text-gray-400">Play particle animations on event creations</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSettings({ ...settings, enableAnimations: !settings.enableAnimations })
                  }
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    settings.enableAnimations ? 'bg-indigo-600' : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      settings.enableAnimations ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Default View Mode */}
              <div className="p-3.5 rounded-2xl bg-gray-900/90 border border-gray-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Default Event Layout</p>
                  <p className="text-[11px] text-gray-400">Preferred view format on the Events page</p>
                </div>
                <select
                  value={settings.defaultView || 'grid'}
                  onChange={(e) =>
                    setSettings({ ...settings, defaultView: e.target.value })
                  }
                  className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-xl text-xs font-semibold text-gray-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="grid">Grid Cards</option>
                  <option value="table">Dense Table</option>
                </select>
              </div>

              {/* Rows Per Page */}
              <div className="p-3.5 rounded-2xl bg-gray-900/90 border border-gray-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Attendee Pagination</p>
                  <p className="text-[11px] text-gray-400">Records visible per page in roster</p>
                </div>
                <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
                  8 rows
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300">
            ✓ Preferences are saved automatically to your profile state.
          </div>
        </div>
      </div>

      {/* Portfolio Showcase Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-indigo-500/30 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-fuchsia-600 p-0.5 shadow-glow-brand flex items-center justify-center">
              <div className="w-full h-full bg-gray-950/80 rounded-[14px] flex items-center justify-center">
                <Code2 className="w-6 h-6 text-indigo-300" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">EventFlow Architecture & Tech Stack</h3>
              <p className="text-xs text-indigo-400 font-semibold">Modern Frontend Portfolio Project</p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Portfolio Showcase Ready
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-gray-900/80 border border-gray-800">
            <p className="text-gray-400 text-[11px]">Framework</p>
            <p className="font-bold text-white mt-0.5">React 18 + Vite</p>
          </div>
          <div className="p-3 rounded-2xl bg-gray-900/80 border border-gray-800">
            <p className="text-gray-400 text-[11px]">Styling</p>
            <p className="font-bold text-white mt-0.5">Tailwind CSS</p>
          </div>
          <div className="p-3 rounded-2xl bg-gray-900/80 border border-gray-800">
            <p className="text-gray-400 text-[11px]">Icons & Charts</p>
            <p className="font-bold text-white mt-0.5">Lucide + Recharts</p>
          </div>
          <div className="p-3 rounded-2xl bg-gray-900/80 border border-gray-800">
            <p className="text-gray-400 text-[11px]">Data Engine</p>
            <p className="font-bold text-white mt-0.5">Reactive LocalStorage</p>
          </div>
        </div>
      </div>
    </div>
  );
};
