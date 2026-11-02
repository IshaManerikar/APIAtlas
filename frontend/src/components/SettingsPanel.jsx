import { useEffect, useState } from "react";
import { Bell, Check, Clock3, Monitor, RotateCcw, Save, ShieldCheck } from "lucide-react";

const STORAGE_KEY = "apiatlas-settings";
const defaults = { endpointAlerts: true, incidentAlerts: true, unreadBadge: true, refreshInterval: "manual" };

export function getSavedSettings() {
    try {
        return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
    } catch {
        return defaults;
    }
}

export default function SettingsPanel({ onSettingsChange }) {
    const [settings, setSettings] = useState(getSavedSettings);
    const [saved, setSaved] = useState(false);

    useEffect(() => onSettingsChange?.(settings), [settings, onSettingsChange]);

    function update(name, value) {
        setSettings((current) => ({ ...current, [name]: value }));
        setSaved(false);
    }

    function save(event) {
        event.preventDefault();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        setSaved(true);
    }

    function reset() {
        setSettings(defaults);
        localStorage.removeItem(STORAGE_KEY);
        setSaved(true);
    }

    return (
        <form className="settings-page" onSubmit={save}>
            <div className="settings-intro">
                <div className="settings-intro-icon"><Monitor size={20} /></div>
                <div><h2>Make APIAtlas yours</h2><p>Manage how your workspace updates and when you hear about changes.</p></div>
            </div>

            <section className="settings-card">
                <div className="settings-card-title"><span className="settings-section-icon"><Bell size={17} /></span><div><h3>Notifications</h3><p>Choose which updates appear in your notification center.</p></div></div>
                <SettingToggle title="Endpoint health alerts" detail="Show a notification when an endpoint is down or degraded." checked={settings.endpointAlerts} onChange={(value) => update("endpointAlerts", value)} />
                <SettingToggle title="New incidents" detail="Show an alert when an incident is opened." checked={settings.incidentAlerts} onChange={(value) => update("incidentAlerts", value)} />
                <SettingToggle title="Unread badge" detail="Show the unread count on the notification bell." checked={settings.unreadBadge} onChange={(value) => update("unreadBadge", value)} />
            </section>

            <section className="settings-card">
                <div className="settings-card-title"><span className="settings-section-icon"><Clock3 size={17} /></span><div><h3>Workspace behavior</h3><p>Control how often dashboard data refreshes.</p></div></div>
                <label className="settings-select-row" htmlFor="refresh-interval"><span><strong>Dashboard refresh</strong><small>Automatically reload endpoint health data.</small></span><select id="refresh-interval" value={settings.refreshInterval} onChange={(event) => update("refreshInterval", event.target.value)}><option value="manual">Manual</option><option value="30">Every 30 seconds</option><option value="60">Every minute</option><option value="300">Every 5 minutes</option></select></label>
                <div className="settings-security-note"><ShieldCheck size={16} /><span><strong>Preferences are stored on this device</strong><small>This workspace is in local demo mode. Your choices stay in this browser.</small></span></div>
            </section>

            <div className="settings-footer"><button type="button" className="settings-reset" onClick={reset}><RotateCcw size={14} /> Reset defaults</button><div>{saved && <span className="settings-saved"><Check size={14} /> Preferences saved</span>}<button className="primary-button" type="submit"><Save size={15} /> Save preferences</button></div></div>
        </form>
    );
}

function SettingToggle({ title, detail, checked, onChange }) {
    return <label className="settings-toggle-row"><span><strong>{title}</strong><small>{detail}</small></span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><span className="toggle-control" aria-hidden="true" /></label>;
}
