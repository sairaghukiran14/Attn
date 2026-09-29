import React, { useState } from 'react';
import { X, Settings as SettingsIcon, Sliders, Bell, Shield, Trash2, Plus, Save, CheckCircle2, MousePointer } from 'lucide-react';
import { AppCategory, AppSettings } from '../types.ts';
import { useTheme, t } from '../utils/theme.tsx';

interface SettingsModalProps { isOpen: boolean; onClose: () => void; settings: AppSettings; onSaveSettings: (settings: Partial<AppSettings>) => void; onClearHistory: () => void; }

const CATEGORIES: AppCategory[] = ['Deep Work', 'Development', 'Communication', 'Research & Reading', 'Social Media', 'Entertainment', 'Utilities'];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSaveSettings, onClearHistory }) => {
  if (!isOpen) return null;
  const { isDark } = useTheme();
  const c = t(isDark);
  const [form, setForm] = useState<AppSettings>({ ...settings });
  const [newPattern, setNewPattern] = useState('');
  const [newType, setNewType] = useState<'app' | 'domain'>('domain');
  const [newCategory, setNewCategory] = useState<AppCategory>('Deep Work');
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = () => { onSaveSettings(form); setShowSaved(true); setTimeout(() => { setShowSaved(false); onClose(); }, 700); };
  const handleAddRule = () => { if (!newPattern.trim()) return; setForm({ ...form, customCategoryRules: [...(form.customCategoryRules || []), { pattern: newPattern.trim(), type: newType, category: newCategory }] }); setNewPattern(''); };
  const handleRemoveRule = (i: number) => setForm({ ...form, customCategoryRules: (form.customCategoryRules || []).filter((_, idx) => idx !== i) });

  const inputStyle = { backgroundColor: c.surfaceAlt, border: `1px solid ${c.borderSub}`, color: c.text };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop-anim" style={{ backgroundColor: c.overlay }}>
      <div className="w-full max-w-xl rounded-xl border overflow-hidden flex flex-col max-h-[80vh] shadow-2xl modal-content-anim" style={{ backgroundColor: c.surface, borderColor: c.border }}>
        <div className="p-4 px-5 border-b flex items-center justify-between" style={{ borderColor: c.border }}>
          <div className="flex items-center space-x-2.5">
            <SettingsIcon className="w-4 h-4" style={{ color: c.textDim }} />
            <div>
              <h2 className="text-sm font-semibold" style={{ color: c.text }}>Settings</h2>
              <p className="text-[10px]" style={{ color: c.textDim }}>Thresholds, alerts, and rules</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md transition-colors" style={{ color: c.textDim }}><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          <div className="space-y-3">
            <h3 className="text-[10px] font-medium uppercase tracking-widest flex items-center gap-1.5" style={{ color: c.textDim }}><Sliders className="w-3 h-3" /> Thresholds</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border" style={{ backgroundColor: c.surfaceAlt, borderColor: c.border }}>
                <label className="text-xs font-medium block mb-1.5" style={{ color: c.textSec }}>Micro-Hop (s)</label>
                <div className="flex items-center space-x-3">
                  <input type="range" min="5" max="30" step="1" value={form.microDistractionThresholdSec} onChange={(e) => setForm({ ...form, microDistractionThresholdSec: parseInt(e.target.value) })} className="flex-1 accent-[#a78bfa]" />
                  <span className="font-mono text-xs font-semibold w-8 text-right" style={{ color: c.accent }}>{form.microDistractionThresholdSec}s</span>
                </div>
              </div>
              <div className="p-3 rounded-lg border" style={{ backgroundColor: c.surfaceAlt, borderColor: c.border }}>
                <label className="text-xs font-medium block mb-1.5" style={{ color: c.textSec }}>Deep Work Min (m)</label>
                <div className="flex items-center space-x-3">
                  <input type="range" min="5" max="30" step="5" value={Math.round(form.deepWorkThresholdSec / 60)} onChange={(e) => setForm({ ...form, deepWorkThresholdSec: parseInt(e.target.value) * 60 })} className="flex-1 accent-[#a78bfa]" />
                  <span className="font-mono text-xs font-semibold w-8 text-right" style={{ color: c.accent }}>{Math.round(form.deepWorkThresholdSec / 60)}m</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[10px] font-medium uppercase tracking-widest flex items-center gap-1.5" style={{ color: c.textDim }}><Bell className="w-3 h-3" /> Alerts & Privacy</h3>
            <div className="p-3 rounded-lg border space-y-3" style={{ backgroundColor: c.surfaceAlt, borderColor: c.border }}>
              <label className="flex items-center justify-between cursor-pointer">
                <div><span className="text-xs font-medium" style={{ color: c.textSec }}>Fragmentation Alerts</span><p className="text-[10px]" style={{ color: c.textGhost }}>Nudge on rapid switching</p></div>
                <input type="checkbox" checked={form.notificationsEnabled} onChange={(e) => setForm({ ...form, notificationsEnabled: e.target.checked })} className="w-4 h-4 accent-[#a78bfa] rounded" />
              </label>
              <div className="pt-2 border-t" style={{ borderColor: c.border }}>
                <label className="flex items-center justify-between cursor-pointer">
                  <div><span className="text-xs font-medium" style={{ color: c.textSec }}>Incognito</span><p className="text-[10px]" style={{ color: c.textGhost }}>Only store domains</p></div>
                  <input type="checkbox" checked={form.incognitoMode} onChange={(e) => setForm({ ...form, incognitoMode: e.target.checked })} className="w-4 h-4 accent-[#c084fc] rounded" />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[10px] font-medium uppercase tracking-widest flex items-center gap-1.5" style={{ color: c.textDim }}><MousePointer className="w-3 h-3" /> Inactivity & Mouse Detection</h3>
            <div className="p-3 rounded-lg border space-y-3" style={{ backgroundColor: c.surfaceAlt, borderColor: c.border }}>
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-medium" style={{ color: c.textSec }}>Pause on Inactivity</span>
                  <p className="text-[10px]" style={{ color: c.textGhost }}>Monitors mouse & keyboard interaction to avoid crediting away time</p>
                </div>
                <input
                  type="checkbox"
                  checked={form.idleDetectionEnabled !== false}
                  onChange={(e) => setForm({ ...form, idleDetectionEnabled: e.target.checked })}
                  className="w-4 h-4 accent-[#a78bfa] rounded"
                />
              </label>
              <div className="pt-2 border-t flex items-center justify-between" style={{ borderColor: c.border }}>
                <div>
                  <span className="text-xs font-medium" style={{ color: c.textSec }}>Inactivity Timeout</span>
                  <p className="text-[10px]" style={{ color: c.textGhost }}>Pause if no mouse move or keystroke</p>
                </div>
                <select
                  value={form.idleThresholdSec || 300}
                  onChange={(e) => setForm({ ...form, idleThresholdSec: parseInt(e.target.value) })}
                  className="px-2 py-1 rounded text-xs border outline-none font-mono"
                  style={{ backgroundColor: c.surface, borderColor: c.border, color: c.text }}
                >
                  <option value={120}>2 minutes</option>
                  <option value={180}>3 minutes</option>
                  <option value={300}>5 minutes (Recommended)</option>
                  <option value={600}>10 minutes</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[10px] font-medium uppercase tracking-widest flex items-center gap-1.5" style={{ color: c.textDim }}><Shield className="w-3 h-3" /> Rules</h3>
            <div className="p-3 rounded-lg border flex items-center gap-2 flex-wrap sm:flex-nowrap" style={{ backgroundColor: c.surfaceAlt, borderColor: c.border }}>
              <input type="text" placeholder="e.g. github.com" value={newPattern} onChange={(e) => setNewPattern(e.target.value)} className="flex-1 min-w-[100px] px-3 py-1.5 rounded-md text-xs focus:outline-none" style={inputStyle} />
              <select value={newType} onChange={(e) => setNewType(e.target.value as any)} className="px-2 py-1.5 rounded-md text-xs focus:outline-none" style={inputStyle}><option value="domain">Domain</option><option value="app">App</option></select>
              <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as any)} className="px-2 py-1.5 rounded-md text-xs focus:outline-none" style={inputStyle}>{CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select>
              <button onClick={handleAddRule} className="px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors" style={{ backgroundColor: c.accent, color: c.bg }}><Plus className="w-3 h-3" /> Add</button>
            </div>
            <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
              {(form.customCategoryRules || []).map((rule, idx) => (
                <div key={idx} className="p-2 px-3 rounded-md border flex items-center justify-between text-xs" style={{ backgroundColor: c.surfaceAlt, borderColor: c.border }}>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono" style={{ color: c.accent }}>{rule.pattern}</span>
                    <span className="text-[9px] uppercase" style={{ color: c.textGhost }}>{rule.type}</span>
                    <span style={{ color: c.textGhost }}>→</span>
                    <span style={{ color: c.textSec }}>{rule.category}</span>
                  </div>
                  <button onClick={() => handleRemoveRule(idx)} className="p-1 transition-colors" style={{ color: c.textGhost }}><Trash2 className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: c.border }}>
            <div><h4 className="text-xs font-medium" style={{ color: c.red }}>Clear History</h4><p className="text-[10px]" style={{ color: c.textGhost }}>Reset all data</p></div>
            <button onClick={() => { if (confirm('Reset all data?')) onClearHistory(); }} className="px-3 py-1.5 rounded-md border text-xs font-medium transition-colors" style={{ backgroundColor: c.alertBg, color: c.red, borderColor: c.alertBdr }}>Reset</button>
          </div>
        </div>

        <div className="p-4 px-5 border-t flex items-center justify-between" style={{ borderColor: c.border }}>
          <button onClick={onClose} className="px-4 py-2 rounded-md text-xs transition-colors" style={{ color: c.textDim }}>Cancel</button>
          <button id="btn-save-settings" onClick={handleSave} className="px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors" style={{ backgroundColor: c.accent, color: c.bg }}>
            {showSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{showSaved ? 'Saved!' : 'Save'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
