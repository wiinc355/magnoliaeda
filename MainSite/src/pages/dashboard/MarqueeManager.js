import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getMarqueeSettings,
  updateMarqueeSettings,
  getMarqueeMessages,
  createMarqueeMessage,
  updateMarqueeMessage,
  deleteMarqueeMessage
} from '../../api/cmsApi';

const FONT_FAMILIES = [
  'Inter, sans-serif',
  'Georgia, serif',
  '"Trebuchet MS", sans-serif',
  '"Courier New", monospace',
  '"Palatino Linotype", serif',
  '"Verdana", sans-serif'
];

const EMOJIS = ['📢', '🏛️', '🚧', '🎉', '🗓️', '⚠️', '✅', '🚨', '🌟', '📌', '💬', '📍'];

const DEFAULT_STYLE = {
  fontFamily: FONT_FAMILIES[0],
  fontSizePx: 16,
  textAlign: 'left'
};

const BLANK = {
  text: '',
  rich_text: '',
  text_style_json: JSON.stringify(DEFAULT_STYLE),
  link_url: '',
  is_active: 1,
  sort_order: 0,
  publish_at: '',
  expires_at: ''
};

const SITE_OPTIONS = [
  { key: 'mainsite', label: 'MainSite' },
  { key: 'ecodevsite', label: 'EcodevSite' }
];

function localNow() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

function fmtDt(dt) {
  if (!dt) return '-';
  const d = new Date(dt);
  if (isNaN(d)) return dt;
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function plainFromHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html || '';
  return (div.textContent || div.innerText || '').replace(/\s+/g, ' ').trim();
}

function scheduleStatus(item) {
  if (!item.is_active) return 'Inactive';
  const now = localNow();
  const pub = item.publish_at || '';
  const exp = item.expires_at || '';
  if (pub && pub > now) return 'Scheduled';
  if (exp && exp <= now) return 'Expired';
  return 'Active';
}

function badgeClass(s) {
  if (s === 'Active') return 'dash-badge dash-badge-active';
  if (s === 'Scheduled') return 'dash-badge dash-badge-scheduled';
  if (s === 'Expired') return 'dash-badge dash-badge-expired';
  return 'dash-badge dash-badge-inactive';
}

function speedLabel(s) {
  if (s <= 15) return 'Very Fast';
  if (s <= 25) return 'Fast';
  if (s <= 45) return 'Medium';
  if (s <= 75) return 'Slow';
  return 'Very Slow';
}

function parseStyleJson(value) {
  if (!value) return { ...DEFAULT_STYLE };
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    return {
      fontFamily: parsed.fontFamily || DEFAULT_STYLE.fontFamily,
      fontSizePx: Number(parsed.fontSizePx) || DEFAULT_STYLE.fontSizePx,
      textAlign: ['left', 'center', 'right'].includes(parsed.textAlign)
        ? parsed.textAlign
        : DEFAULT_STYLE.textAlign
    };
  } catch (_) {
    return { ...DEFAULT_STYLE };
  }
}

function transformHtmlTextCase(html, mode) {
  if (!html || mode === 'none') return html;
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
  const root = doc.body.firstElementChild;
  if (!root) return html;

  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const fn = mode === 'uppercase'
    ? (s) => s.toUpperCase()
    : (s) => s.toLowerCase();

  let node = walker.nextNode();
  while (node) {
    node.textContent = fn(node.textContent || '');
    node = walker.nextNode();
  }

  return root.innerHTML;
}

export default function MarqueeManager() {
  const { siteKey } = useParams();
  const selectedSite = siteKey === 'ecodevsite' ? 'ecodevsite' : 'mainsite';
  const [settings, setSettings] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [editorHtml, setEditorHtml] = useState('');
  const [editorStyle, setEditorStyle] = useState({ ...DEFAULT_STYLE });
  const [textColor, setTextColor] = useState('#1f2937');
  const [highlightColor, setHighlightColor] = useState('#fff2a8');

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [canUndoSettings, setCanUndoSettings] = useState(false);
  const [composeCase, setComposeCase] = useState('none');
  const [spellCheckEnabled, setSpellCheckEnabled] = useState(true);

  const [dragId, setDragId] = useState(null);

  const editorRef = useRef(null);
  const settingsHistoryRef = useRef([]);

  function notifyMarqueeUpdated() {
    window.dispatchEvent(new Event('marquee:updated'));
  }

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([getMarqueeSettings(selectedSite), getMarqueeMessages(selectedSite)])
      .then(([s, m]) => {
        setSettings(s);
        setMessages(m);
        settingsHistoryRef.current = [];
        setCanUndoSettings(false);
      })
      .catch(() => setError('Could not load marquee data.'))
      .finally(() => setLoading(false));
  }, [selectedSite]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (editing === null || !editorRef.current) return;
    editorRef.current.innerHTML = form.rich_text || '';
    setEditorHtml(form.rich_text || '');
  }, [editing, form.rich_text]);

  useEffect(() => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    // Toggling focus helps Safari/Chrome reinitialize native spellcheck.
    requestAnimationFrame(() => editorRef.current && editorRef.current.blur());
  }, [spellCheckEnabled]);

  async function saveSettings(patch, options = {}) {
    if (!settings) return;
    const { skipHistory = false } = options;
    const previous = settings;
    const next = { ...settings, ...patch };

    if (!skipHistory) {
      settingsHistoryRef.current.push(previous);
      if (settingsHistoryRef.current.length > 30) settingsHistoryRef.current.shift();
      setCanUndoSettings(true);
    }

    setSettings(next);
    setSettingsSaving(true);
    setSettingsSaved(false);
    try {
      await updateMarqueeSettings(next, selectedSite);
      notifyMarqueeUpdated();
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 1500);
    } catch (_) {
      setSettings(previous);
      if (!skipHistory) {
        settingsHistoryRef.current.pop();
        setCanUndoSettings(settingsHistoryRef.current.length > 0);
      }
      alert('Failed to save marquee settings.');
    } finally {
      setSettingsSaving(false);
    }
  }

  async function undoLastSettingsChange() {
    if (settingsSaving) return;
    const previous = settingsHistoryRef.current.pop();
    if (!previous) return;
    setCanUndoSettings(settingsHistoryRef.current.length > 0);
    await saveSettings(previous, { skipHistory: true });
  }

  function openNew() {
    const nextOrder = messages.reduce((m, x) => Math.max(m, x.sort_order || 0), 0) + 10;
    const next = { ...BLANK, sort_order: nextOrder, text_style_json: JSON.stringify(DEFAULT_STYLE) };
    setForm(next);
    setEditorStyle({ ...DEFAULT_STYLE });
    setEditorHtml('');
    setComposeCase('none');
    setEditing('new');
    setSaveError(null);
  }

  function openEdit(m) {
    const style = parseStyleJson(m.text_style_json);
    const rich = m.rich_text || '';
    setForm({
      text: m.text || plainFromHtml(rich),
      rich_text: rich,
      text_style_json: m.text_style_json || JSON.stringify(style),
      link_url: m.link_url || '',
      is_active: m.is_active === undefined ? 1 : m.is_active,
      sort_order: m.sort_order || 0,
      publish_at: m.publish_at || '',
      expires_at: m.expires_at || ''
    });
    setEditorStyle(style);
    setEditorHtml(rich);
    setComposeCase('none');
    setEditing(m.id);
    setSaveError(null);
  }

  function cancelEdit() {
    setEditing(null);
    setSaveError(null);
  }

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  function applyCommand(command, value = null) {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    setEditorHtml(editorRef.current.innerHTML);
  }

  function applyBlockStyle(patch) {
    setEditorStyle((prev) => ({ ...prev, ...patch }));
  }

  function insertEmoji(emoji) {
    applyCommand('insertText', emoji);
  }

  function handleEditorInput(e) {
    setEditorHtml(e.currentTarget.innerHTML);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    const rich = editorRef.current ? editorRef.current.innerHTML : editorHtml;
    const transformedRich = transformHtmlTextCase(rich, composeCase);
    const plain = plainFromHtml(transformedRich);

    if (!plain) {
      setSaving(false);
      setSaveError('Message text is required.');
      return;
    }

    const payload = {
      ...form,
      text: plain.slice(0, 600),
      rich_text: transformedRich,
      text_style_json: JSON.stringify(editorStyle)
    };

    try {
      if (editing === 'new') await createMarqueeMessage(payload, selectedSite);
      else await updateMarqueeMessage(editing, payload, selectedSite);
      setEditing(null);
      notifyMarqueeUpdated();
      load();
    } catch (err) {
      setSaveError(err.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this marquee message?')) return;
    try {
      await deleteMarqueeMessage(id, selectedSite);
      notifyMarqueeUpdated();
      load();
    } catch (err) {
      alert('Delete failed: ' + (err.message || 'Unknown error'));
    }
  }

  async function toggleActive(m) {
    try {
      await updateMarqueeMessage(m.id, {
        ...m,
        text: m.text || plainFromHtml(m.rich_text || ''),
        is_active: m.is_active ? 0 : 1
      }, selectedSite);
      notifyMarqueeUpdated();
      load();
    } catch (_) {
      alert('Failed to toggle message.');
    }
  }

  async function handleDrop(targetId) {
    if (!dragId || dragId === targetId) return;
    const list = [...messages];
    const from = list.findIndex((m) => m.id === dragId);
    const to = list.findIndex((m) => m.id === targetId);
    if (from < 0 || to < 0) return;

    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);

    const reordered = list.map((m, idx) => ({ ...m, sort_order: (idx + 1) * 10 }));
    setMessages(reordered);

    try {
      await Promise.all(
        reordered.map((m) => updateMarqueeMessage(m.id, {
          ...m,
          text: m.text || plainFromHtml(m.rich_text || '')
        }, selectedSite))
      );
      notifyMarqueeUpdated();
      load();
    } catch (_) {
      alert('Could not save new order.');
      load();
    } finally {
      setDragId(null);
    }
  }

  const stats = useMemo(() => {
    return messages.reduce((acc, m) => {
      acc.total++;
      const s = scheduleStatus(m);
      if (s === 'Active') acc.active++;
      else if (s === 'Scheduled') acc.scheduled++;
      else if (s === 'Expired') acc.expired++;
      else acc.inactive++;
      return acc;
    }, { total: 0, active: 0, scheduled: 0, expired: 0, inactive: 0 });
  }, [messages]);

  if (loading) return <div className="dash-content"><p className="dash-loading">Loading marquee...</p></div>;
  if (error) return <div className="dash-content"><p className="dash-error">{error}</p></div>;

  if (editing !== null) {
    return (
      <div className="dash-content">
        <div className="dash-page-header">
          <h1 className="dash-page-title">
            {editing === 'new' ? 'Compose Marquee Message' : 'Edit Marquee Message'}
            {' '}
            for {SITE_OPTIONS.find((s) => s.key === selectedSite)?.label || 'MainSite'}
          </h1>
          <button type="button" className="dash-btn dash-btn-secondary" onClick={cancelEdit}>Cancel</button>
        </div>

        <form className="dash-form mq-editor-form" onSubmit={handleSubmit}>
          <div className="mq-editor-shell">
            <div className="mq-editor-toolbar">
              <button type="button" className="mq-tool-btn" onClick={() => applyCommand('undo')}>Undo</button>
              <button type="button" className="mq-tool-btn" onClick={() => applyCommand('redo')}>Redo</button>
              <button type="button" className="mq-tool-btn" onClick={() => applyCommand('bold')}><b>B</b></button>
              <button type="button" className="mq-tool-btn" onClick={() => applyCommand('italic')}><i>I</i></button>
              <button type="button" className="mq-tool-btn" onClick={() => applyCommand('underline')}><u>U</u></button>
              <button type="button" className="mq-tool-btn" onClick={() => applyCommand('insertUnorderedList')}>• List</button>
              <button type="button" className="mq-tool-btn" onClick={() => applyCommand('insertOrderedList')}>1. List</button>
              <button type="button" className="mq-tool-btn" onClick={() => applyCommand('justifyLeft')}>Left</button>
              <button type="button" className="mq-tool-btn" onClick={() => applyCommand('justifyCenter')}>Center</button>
              <button type="button" className="mq-tool-btn" onClick={() => applyCommand('justifyRight')}>Right</button>

              <label className="mq-tool-label">
                Font
                <select
                  value={editorStyle.fontFamily}
                  onChange={(e) => {
                    applyBlockStyle({ fontFamily: e.target.value });
                    applyCommand('fontName', e.target.value.split(',')[0].replace(/"/g, '').trim());
                  }}
                >
                  {FONT_FAMILIES.map((f) => <option key={f} value={f}>{f.split(',')[0].replace(/"/g, '')}</option>)}
                </select>
              </label>

              <label className="mq-tool-label">
                Size
                <select
                  value={editorStyle.fontSizePx}
                  onChange={(e) => applyBlockStyle({ fontSizePx: Number(e.target.value) })}
                >
                  <option value={14}>Small</option>
                  <option value={16}>Medium</option>
                  <option value={20}>Large</option>
                  <option value={24}>X-Large</option>
                  <option value={28}>XX-Large</option>
                </select>
              </label>

              <label className="mq-tool-label">
                Custom px
                <input
                  type="number"
                  min={12}
                  max={64}
                  value={editorStyle.fontSizePx}
                  onChange={(e) => applyBlockStyle({ fontSizePx: Number(e.target.value) || 16 })}
                />
              </label>

              <label className="mq-tool-label">
                Text
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => {
                    setTextColor(e.target.value);
                    applyCommand('foreColor', e.target.value);
                  }}
                />
              </label>

              <label className="mq-tool-label">
                Highlight
                <input
                  type="color"
                  value={highlightColor}
                  onChange={(e) => {
                    setHighlightColor(e.target.value);
                    applyCommand('hiliteColor', e.target.value);
                  }}
                />
              </label>

              <div className="mq-emoji-row" role="group" aria-label="Insert emoji">
                {EMOJIS.map((emoji) => (
                  <button key={emoji} type="button" className="mq-emoji-btn" onClick={() => insertEmoji(emoji)}>{emoji}</button>
                ))}
              </div>
            </div>

            <div
              ref={editorRef}
              className="mq-rich-editor"
              contentEditable={true}
              role="textbox"
              aria-multiline="true"
              tabIndex={0}
              lang="en-US"
              suppressContentEditableWarning
              spellCheck={spellCheckEnabled}
              autoCorrect="on"
              autoCapitalize="sentences"
              data-enable-grammarly="true"
              onInput={handleEditorInput}
              style={{
                fontFamily: editorStyle.fontFamily,
                fontSize: `${editorStyle.fontSizePx}px`,
                textAlign: editorStyle.textAlign
              }}
            />
          </div>

          <div className="dash-form-row dash-form-check">
            <input
              id="mq-spell-check"
              type="checkbox"
              checked={spellCheckEnabled}
              onChange={(e) => setSpellCheckEnabled(e.target.checked)}
            />
            <label htmlFor="mq-spell-check">Auto spell check while composing</label>
          </div>

          <div className="dash-form-row">
            <label className="dash-label" htmlFor="mq-compose-case">Auto Case (for this message)</label>
            <select
              id="mq-compose-case"
              className="dash-input"
              value={composeCase}
              onChange={(e) => {
                const mode = e.target.value;
                setComposeCase(mode);
                if (mode !== 'none' && editorRef.current) {
                  const nextHtml = transformHtmlTextCase(editorRef.current.innerHTML, mode);
                  editorRef.current.innerHTML = nextHtml;
                  setEditorHtml(nextHtml);
                }
              }}
              style={{ maxWidth: 280 }}
            >
              <option value="none">No change</option>
              <option value="uppercase">Make all text uppercase</option>
              <option value="lowercase">Make all text lowercase</option>
            </select>
          </div>

          <div className="dash-form-row">
            <label className="dash-label" htmlFor="mq-link">Link URL (optional)</label>
            <input
              id="mq-link"
              name="link_url"
              className="dash-input"
              value={form.link_url}
              onChange={(e) => setField('link_url', e.target.value)}
              placeholder="/events or https://..."
            />
          </div>

          <div className="dash-form-row">
            <label className="dash-label" htmlFor="mq-order">Display Order</label>
            <input
              id="mq-order"
              name="sort_order"
              type="number"
              className="dash-input"
              value={form.sort_order}
              onChange={(e) => setField('sort_order', e.target.value)}
              style={{ maxWidth: 180 }}
            />
            <p className="dash-schedule-hint">Tip: you can drag rows in the table to reorder quickly.</p>
          </div>

          <div className="dash-form-section-label">Scheduling</div>
          <div className="dash-schedule-hint">
            Leave both blank to publish immediately. Set Publish At to delay; set Expires At to auto-remove.
          </div>

          <div className="dash-form-cols">
            <div className="dash-form-row">
              <label className="dash-label" htmlFor="mq-publish">Publish At</label>
              <input
                id="mq-publish"
                name="publish_at"
                type="datetime-local"
                className="dash-input"
                value={form.publish_at}
                onChange={(e) => setField('publish_at', e.target.value)}
              />
            </div>
            <div className="dash-form-row">
              <label className="dash-label" htmlFor="mq-expires">Expires At</label>
              <input
                id="mq-expires"
                name="expires_at"
                type="datetime-local"
                className="dash-input"
                value={form.expires_at}
                onChange={(e) => setField('expires_at', e.target.value)}
              />
            </div>
          </div>

          <div className="dash-form-row dash-form-check">
            <input
              id="mq-active"
              name="is_active"
              type="checkbox"
              checked={!!form.is_active}
              onChange={(e) => setField('is_active', e.target.checked ? 1 : 0)}
            />
            <label htmlFor="mq-active">Active (eligible to display)</label>
          </div>

          <div className="mq-editor-preview-card">
            <div className="mq-editor-preview-title">Live Preview</div>
            <div
              className="mq-editor-preview-body"
              style={{
                fontFamily: editorStyle.fontFamily,
                fontSize: `${editorStyle.fontSizePx}px`,
                textAlign: editorStyle.textAlign
              }}
              dangerouslySetInnerHTML={{ __html: editorHtml || '<span style="opacity:.65">Start typing your marquee message...</span>' }}
            />
          </div>

          {saveError && <p className="dash-error">{saveError}</p>}

          <div className="dash-form-actions">
            <button type="submit" className="dash-btn dash-btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Message'}
            </button>
            <button type="button" className="dash-btn dash-btn-secondary" onClick={cancelEdit}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="dash-content">
      <div className="dash-page-header">
        <h1 className="dash-page-title">
          Marquee Manager: {SITE_OPTIONS.find((s) => s.key === selectedSite)?.label || 'MainSite'}
        </h1>
        <button type="button" className="dash-btn dash-btn-primary" onClick={openNew}>+ New Message</button>
      </div>

      <div className="mq-controls-card">
        <div className="mq-controls-row">
          <label className="mq-toggle">
            <input
              type="checkbox"
              checked={!!settings?.is_enabled}
              onChange={(e) => saveSettings({ is_enabled: e.target.checked ? 1 : 0 })}
            />
            <span className="mq-toggle-slider" />
          </label>
          <div className="mq-controls-label">
            <strong>
              {SITE_OPTIONS.find((s) => s.key === selectedSite)?.label || 'MainSite'} Marquee {settings?.is_enabled ? 'Running' : 'Stopped'}
            </strong>
            <span className="mq-controls-sub">
              {settings?.is_enabled ? 'Currently visible on every public page.' : 'Hidden from all public pages.'}
            </span>
          </div>
          <button
            type="button"
            className="dash-btn dash-btn-secondary"
            onClick={undoLastSettingsChange}
            disabled={!canUndoSettings || settingsSaving}
          >
            Undo Last Change
          </button>
          {settingsSaving && <span className="mq-saving">Saving...</span>}
          {settingsSaved && <span className="mq-saved">Saved</span>}
        </div>

        <div className="mq-controls-row mq-controls-speed">
          <label htmlFor="mq-speed" className="mq-speed-label">
            <strong>Speed</strong>
            <span className="mq-controls-sub">{settings?.duration_seconds}s per loop - {speedLabel(settings?.duration_seconds || 40)}</span>
          </label>
          <input
            id="mq-speed"
            type="range"
            min={10}
            max={120}
            step={5}
            value={settings?.duration_seconds || 40}
            onChange={(e) => saveSettings({ duration_seconds: Number(e.target.value) })}
            className="mq-speed-slider"
          />
        </div>

        <div className="mq-controls-row mq-controls-colors">
          <label className="mq-color-field">
            <span className="mq-controls-sub">Background</span>
            <input
              type="color"
              value={settings?.background_color || '#0a4f90'}
              onChange={(e) => saveSettings({ background_color: e.target.value })}
            />
          </label>
          <label className="mq-color-field">
            <span className="mq-controls-sub">Text</span>
            <input
              type="color"
              value={settings?.text_color || '#ffffff'}
              onChange={(e) => saveSettings({ text_color: e.target.value })}
            />
          </label>
          <div
            className="mq-preview"
            style={{
              background: settings?.background_color || '#0a4f90',
              color: settings?.text_color || '#ffffff'
            }}
          >
            <span>Preview - City announcements scroll here</span>
          </div>
        </div>

      </div>

      <div className="sub-stat-row">
        <div className="sub-stat"><span className="sub-stat-num">{stats.total}</span><span>Total</span></div>
        <div className="sub-stat sub-stat-green"><span className="sub-stat-num">{stats.active}</span><span>Active</span></div>
        <div className="sub-stat sub-stat-yellow"><span className="sub-stat-num">{stats.scheduled}</span><span>Scheduled</span></div>
        <div className="sub-stat sub-stat-grey"><span className="sub-stat-num">{stats.expired + stats.inactive}</span><span>Off Air</span></div>
      </div>

      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Drag</th>
              <th>Order</th>
              <th>Text</th>
              <th>Link</th>
              <th>Status</th>
              <th>Publish At</th>
              <th>Expires At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr><td colSpan={8} className="dash-empty-cell">No marquee messages yet. Click + New Message to add one.</td></tr>
            ) : messages.map((m) => {
              const status = scheduleStatus(m);
              return (
                <tr
                  key={m.id}
                  draggable
                  onDragStart={() => setDragId(m.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(m.id)}
                  className={dragId === m.id ? 'mq-row-dragging' : ''}
                >
                  <td className="mq-drag-cell" title="Drag to reorder">::</td>
                  <td>{m.sort_order}</td>
                  <td className="dash-td-primary">{m.text}</td>
                  <td>{m.link_url ? <code style={{ fontSize: '0.8rem' }}>{m.link_url}</code> : '-'}</td>
                  <td><span className={badgeClass(status)}>{status}</span></td>
                  <td className="dash-td-schedule">{fmtDt(m.publish_at)}</td>
                  <td className="dash-td-schedule">{fmtDt(m.expires_at)}</td>
                  <td className="dash-td-actions">
                    <button type="button" className="dash-action-btn" onClick={() => toggleActive(m)}>
                      {m.is_active ? 'Disable' : 'Enable'}
                    </button>
                    <button type="button" className="dash-action-btn" onClick={() => openEdit(m)}>Edit</button>
                    <button type="button" className="dash-action-btn dash-action-delete" onClick={() => handleDelete(m.id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
