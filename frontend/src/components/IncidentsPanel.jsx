
import { useEffect, useState } from "react";
import {
    getIncidents,
    createIncident,
    updateIncidentStatus,
    updateIncident,
    deleteIncident,
} from "../api/incidents";

const initialForm = {
    title: "",
    description: "",
    apiName: "",
    severity: "MEDIUM",
};

function IncidentsPanel({ onIncidentChange }) {
    const [incidents, setIncidents] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function loadIncidents() {
        try {
            const data = await getIncidents(statusFilter || undefined);
            setIncidents(data);
            setError("");
        } catch (err) {
            setError(
                err.message || "Unable to load incidents. Check the backend connection."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let cancelled = false;

        async function fetchIncidents() {
            try {
                const data = await getIncidents(statusFilter || undefined);

                if (!cancelled) {
                    setIncidents(data);
                    setError("");
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.message || "Unable to load incidents. Check the backend connection."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchIncidents();

        return () => {
            cancelled = true;
        };
    }, [statusFilter]);
    function handleChange(event) {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    }

    function openCreateForm() {
        setEditingId(null);
        setForm(initialForm);
        setShowForm(true);
        setError("");
        setSuccess("");
    }

    function openEditForm(incident) {
        setEditingId(incident.id);
        setForm({
            title: incident.title || "",
            description: incident.description || "",
            apiName: incident.apiName || "",
            severity: incident.severity || "MEDIUM",
        });
        setShowForm(true);
        setError("");
        setSuccess("");
    }

    function cancelForm() {
        setShowForm(false);
        setEditingId(null);
        setForm(initialForm);
        setError("");
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            if (editingId !== null) {
                await updateIncident(editingId, form);
                setSuccess(`Incident #${editingId} updated successfully.`);
            } else {
                await createIncident(form);
                setSuccess("Incident created successfully.");
            }

            setShowForm(false);
            setEditingId(null);
            setForm(initialForm);
            await loadIncidents();
        } catch (err) {
            setError(err.message || "Unable to save incident.");
        } finally {
            setSaving(false);
        }
    }

    async function handleStatusChange(id, status) {
        setError("");
        setSuccess("");

        try {
            await updateIncidentStatus(id, status);
            setSuccess(`Incident #${id} status updated successfully.`);

            await loadIncidents();
            await onIncidentChange?.();
        } catch (err) {
            setError(err.message || "Unable to update incident status.");
        }
    }

    async function handleDelete(incident) {
        const confirmed = window.confirm(
            `Are you sure you want to delete incident #${incident.id} — "${incident.title}"? This action cannot be undone.`
        );

        if (!confirmed) return;

        setDeletingId(incident.id);
        setError("");
        setSuccess("");

        try {
            await deleteIncident(incident.id);

            if (editingId === incident.id) {
                cancelForm();
            }

            setSuccess(`Incident #${incident.id} deleted successfully.`);
            await loadIncidents();
        } catch (err) {
            setError(err.message || "Unable to delete incident.");
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <section className="settings-panel incidents-panel">
            <div className="incidents-heading">
                <div>
                    <h2>Incidents</h2>
                    <p className="muted">Monitor and manage API incidents.</p>
                </div>

                <button
                    type="button"
                    onClick={showForm ? cancelForm : openCreateForm}
                >
                    {showForm ? "Cancel" : "+ Create incident"}
                </button>
            </div>

            <div className="incidents-toolbar">
                <label htmlFor="incident-status-filter">Filter by status</label>
                <select
                    id="incident-status-filter"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                >
                    <option value="">All statuses</option>
                    <option value="OPEN">Open</option>
                    <option value="INVESTIGATING">Investigating</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                </select>
            </div>

            {error && <p role="alert" className="incident-error">{error}</p>}
            {success && <p role="status" className="incident-success">{success}</p>}

            {showForm && (
                <form className="incident-form" onSubmit={handleSubmit}>
                    <h3>{editingId !== null ? "Edit incident" : "Create incident"}</h3>

                    <label htmlFor="incident-title">Title *</label>
                    <input
                        id="incident-title"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        maxLength={200}
                    />

                    <label htmlFor="incident-api">Affected API / service *</label>
                    <input
                        id="incident-api"
                        name="apiName"
                        value={form.apiName}
                        onChange={handleChange}
                        required
                        maxLength={150}
                    />

                    <label htmlFor="incident-severity">Severity *</label>
                    <select
                        id="incident-severity"
                        name="severity"
                        value={form.severity}
                        onChange={handleChange}
                        required
                    >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="CRITICAL">Critical</option>
                    </select>

                    <label htmlFor="incident-description">Description</label>
                    <textarea
                        id="incident-description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={3}
                    />

                    <div className="incident-form-actions">
                        <button type="submit" disabled={saving}>
                            {saving
                                ? "Saving..."
                                : editingId !== null
                                    ? "Save changes"
                                    : "Create incident"}
                        </button>

                        <button
                            type="button"
                            onClick={cancelForm}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <p>Loading incidents...</p>
            ) : incidents.length === 0 ? (
                <p className="muted">No incidents found.</p>
            ) : (
                <div className="incidents-list">
                    {incidents.map((incident) => (
                        <article className="incident-card" key={incident.id}>
                            <div className="incident-card-main">
                                <div className="incident-title-row">
                                    <span
                                        className={`status-dot ${
                                            incident.status === "OPEN"
                                                ? "down-dot"
                                                : incident.status === "INVESTIGATING"
                                                    ? "degraded-dot"
                                                    : ""
                                        }`}
                                    />
                                    <h3>{incident.title}</h3>
                                </div>

                                <p className="muted">
                                    {incident.apiName} · Incident #{incident.id}
                                </p>

                                {incident.description && <p>{incident.description}</p>}

                                <div className="incident-meta">
                                    <span
                                        className={`incident-severity severity-${(
                                            incident.severity || "medium"
                                        ).toLowerCase()}`}
                                    >
                                        {incident.severity}
                                    </span>

                                    <span
                                        className={`incident-status status-${(
                                            incident.status || "open"
                                        ).toLowerCase()}`}
                                    >
                                        {(incident.status || "OPEN").replace("_", " ")}
                                    </span>

                                    <span className="muted">
                                        {incident.createdAt
                                            ? new Date(incident.createdAt).toLocaleString()
                                            : ""}
                                    </span>
                                </div>
                            </div>

                            <div className="incident-actions">
                                {incident.status !== "CLOSED" && (
                                    <>
                                        <label htmlFor={`status-${incident.id}`}>
                                            Update status
                                        </label>
                                        <select
                                            id={`status-${incident.id}`}
                                            value={incident.status}
                                            onChange={(event) =>
                                                handleStatusChange(
                                                    incident.id,
                                                    event.target.value
                                                )
                                            }
                                        >
                                            <option value="OPEN">Open</option>
                                            <option value="INVESTIGATING">Investigating</option>
                                            <option value="RESOLVED">Resolved</option>
                                            <option value="CLOSED">Closed</option>
                                        </select>
                                    </>
                                )}

                                <div className="incident-card-buttons">
                                    <button
                                        type="button"
                                        onClick={() => openEditForm(incident)}
                                        disabled={deletingId === incident.id}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(incident)}
                                        disabled={deletingId === incident.id}
                                    >
                                        {deletingId === incident.id
                                            ? "Deleting..."
                                            : "Delete"}
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

export default IncidentsPanel;
