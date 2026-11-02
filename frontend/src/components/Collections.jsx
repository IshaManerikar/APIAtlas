import {
    FolderKanban,
    Plus,
    Search,
    ArrowLeft,
    Pencil,
    Save,
    Check,
    Play
} from "lucide-react";

import "./Collections.css";
import { useEffect, useState } from "react";

import {
    getCollections,
    createCollection,
    updateCollection,
    runCollection
} from "../api/collections";

function Collections({ endpointList = [] }) {
    const [search, setSearch] = useState("");
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [selectedCollection, setSelectedCollection] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [runningCollectionId, setRunningCollectionId] = useState(null);
    const [runResult, setRunResult] = useState(null);
    const [runError, setRunError] = useState("");
    const [form, setForm] = useState({
        name: "",
        description: "",
        endpointIds: [],
    });

    const isEditing = selectedCollection !== null;

    const filteredCollections = collections.filter((collection) =>
        (collection.name || "")
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const loadCollections = async () => {
        try {
            setError("");

            const data = await getCollections();
            setCollections(Array.isArray(data) ? data : []);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                error.message ||
                "Failed to load collections."
            );
        }
    };

    useEffect(() => {
        let ignore = false;

        const fetchCollections = async () => {
            try {
                const data = await getCollections();

                if (!ignore) {
                    setCollections(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                if (!ignore) {
                    setError(
                        error.response?.data?.message ||
                        error.message ||
                        "Failed to load collections."
                    );
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        fetchCollections();

        return () => {
            ignore = true;
        };
    }, []);

    const openCreateForm = () => {
        setSelectedCollection(null);

        setForm({
            name: "",
            description: "",
            endpointIds: [],
        });

        setError("");
        setShowForm(true);
    };

    const openCollection = (collection) => {
        setSelectedCollection(collection);

        setForm({
            name: collection.name || "",
            description: collection.description || "",
            endpointIds: (collection.endpoints || []).map(
                (endpoint) => endpoint.id
            ),
        });

        setError("");
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setSelectedCollection(null);
        setError("");
    };

    const toggleEndpoint = (endpointId) => {
        setForm((previous) => ({
            ...previous,
            endpointIds: previous.endpointIds.includes(endpointId)
                ? previous.endpointIds.filter((id) => id !== endpointId)
                : [...previous.endpointIds, endpointId],
        }));
    };

    const handleSaveCollection = async (event) => {
        event.preventDefault();

        if (!form.name.trim()) {
            setError("Collection name is required.");
            return;
        }

        const requestData = {
            name: form.name.trim(),
            description: form.description.trim(),
            endpointIds: form.endpointIds,
        };

        try {
            setSaving(true);
            setError("");

            if (isEditing) {
                await updateCollection(
                    selectedCollection.id,
                    requestData
                );
            } else {
                await createCollection(requestData);
            }

            await loadCollections();
            closeForm();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Failed to save collection."
            );
        } finally {
            setSaving(false);
        }
    };
    const handleRunCollection = async (event, collection) => {
        event.stopPropagation();

        try {
            setRunningCollectionId(collection.id);
            setRunResult(null);
            setRunError("");

            const result = await runCollection(collection.id);

            setRunResult(result);
        } catch (error) {
            setRunError(
                error.response?.data?.message ||
                error.message ||
                "Failed to execute collection."
            );
        } finally {
            setRunningCollectionId(null);
        }
    };

    return (
        <section className="collections-page">

            {!showForm ? (
                <>
                    <div className="collections-header">
                        <div>
                            <h1>Collections</h1>
                            <p>
                                Organize your API endpoints into collections.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="collections-create-button"
                            onClick={openCreateForm}
                        >
                            <Plus size={18} />
                            Create Collection
                        </button>
                    </div>

                    {error && (
                        <div className="collection-error">
                            {error}
                        </div>
                    )}

                    <div className="collections-toolbar">
                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search collections..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />
                    </div>

                    {loading ? (
                        <p className="collection-loading">
                            Loading collections...
                        </p>
                    ) : filteredCollections.length === 0 ? (
                        <div className="collections-empty-state">
                            <FolderKanban size={42} />

                            <h2>
                                {search
                                    ? "No matching collections"
                                    : "No collections yet"}
                            </h2>

                            <p>
                                {search
                                    ? "Try another search term."
                                    : "Create your first collection to organize related endpoints."}
                            </p>
                        </div>
                    ) : (
                        <div className="collections-grid">
                            {filteredCollections.map((collection) => (
                                <article
                                    className="collection-card"
                                    key={collection.id}
                                    onClick={() => openCollection(collection)}
                                >
                                    <div className="collection-card-icon">
                                        <FolderKanban size={22} />
                                    </div>

                                    <div className="collection-card-title">
                                        <h2>{collection.name}</h2>
                                        <Pencil size={15} />
                                    </div>

                                    <p>
                                        {collection.description ||
                                            "No description provided."}
                                    </p>

                                    <div className="collection-card-footer">
                                        <span>
                                            {collection.endpoints?.length || 0} endpoints
                                        </span>

                                        <span>
                                            {collection.createdAt
                                                ? new Date(
                                                    collection.createdAt
                                                ).toLocaleDateString()
                                                : ""}
                                        </span>
                                        <button
                                            type="button"
                                            className="collection-run-button"
                                            disabled={runningCollectionId !== null}
                                            onClick={(event) =>
                                                handleRunCollection(event, collection)
                                            }
                                        >
                                            <Play size={15} />

                                            {runningCollectionId === collection.id
                                                ? "Running..."
                                                : "Run"}
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                    {runError && (
                        <div className="collection-error">
                            {runError}
                        </div>
                    )}

                    {runResult && (
                        <div className="collection-run-results">
                            <div className="collection-run-header">
                                <div>
                                    <h2>{runResult.collectionName}</h2>
                                    <p>Collection execution results</p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setRunResult(null)}
                                >
                                    Close
                                </button>
                            </div>

                            <div className="collection-run-summary">
                                <div>
                                    <span>Total Endpoints</span>
                                    <strong>{runResult.totalEndpoints}</strong>
                                </div>

                                <div>
                                    <span>Passed</span>
                                    <strong className="run-passed">
                                        {runResult.passed}
                                    </strong>
                                </div>

                                <div>
                                    <span>Failed</span>
                                    <strong className="run-failed">
                                        {runResult.failed}
                                    </strong>
                                </div>

                                <div>
                                    <span>Total Duration</span>
                                    <strong>{runResult.totalDurationMs} ms</strong>
                                </div>
                            </div>

                            <div className="collection-run-table-wrapper">
                                <table className="collection-run-table">
                                    <thead>
                                    <tr>
                                        <th>Endpoint</th>
                                        <th>Method</th>
                                        <th>HTTP Status</th>
                                        <th>Response Time</th>
                                        <th>Result</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {runResult.results?.map((result) => (
                                        <tr key={result.endpointId}>
                                            <td>{result.endpointName}</td>
                                            <td>{result.method}</td>
                                            <td>
                                                {result.statusCode ?? "—"}
                                            </td>
                                            <td>{result.durationMs} ms</td>
                                            <td>
                                <span className={
                                    result.success
                                        ? "run-status-passed"
                                        : "run-status-failed"
                                }>
                                    {result.success ? "PASSED" : "FAILED"}
                                </span>

                                                {result.errorMessage && (
                                                    <p className="run-error-message">
                                                        {result.errorMessage}
                                                    </p>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="collection-editor">

                    <div className="collection-editor-header">
                        <button
                            type="button"
                            className="collection-back-button"
                            onClick={closeForm}
                        >
                            <ArrowLeft size={18} />
                            Back to Collections
                        </button>

                        <h1>
                            {isEditing
                                ? "Edit Collection"
                                : "Create Collection"}
                        </h1>

                        <p>
                            Manage your collection details and API endpoints.
                        </p>
                    </div>

                    {error && (
                        <div className="collection-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSaveCollection}>

                        <div className="collection-editor-section">
                            <h2>Collection Details</h2>

                            <label htmlFor="collection-name">
                                Collection name
                            </label>

                            <input
                                id="collection-name"
                                type="text"
                                placeholder="e.g. Payment APIs"
                                value={form.name}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        name: event.target.value,
                                    })
                                }
                                required
                            />

                            <label htmlFor="collection-description">
                                Description
                            </label>

                            <textarea
                                id="collection-description"
                                placeholder="Describe this collection..."
                                rows={3}
                                value={form.description}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        description: event.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="collection-editor-section">
                            <div className="collection-endpoints-header">
                                <div>
                                    <h2>Manage Endpoints</h2>
                                    <p>
                                        Select the endpoints you want in this collection.
                                    </p>
                                </div>

                                <span>
                                    {form.endpointIds.length} selected
                                </span>
                            </div>

                            {endpointList.length === 0 ? (
                                <p className="collection-loading">
                                    No monitored endpoints available.
                                </p>
                            ) : (
                                <div className="collection-endpoint-list">
                                    {endpointList.map((endpoint) => {
                                        const selected =
                                            form.endpointIds.includes(endpoint.id);

                                        return (
                                            <label
                                                key={endpoint.id}
                                                className={`collection-endpoint-item ${
                                                    selected ? "selected" : ""
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selected}
                                                    onChange={() =>
                                                        toggleEndpoint(endpoint.id)
                                                    }
                                                />

                                                <div className="collection-endpoint-info">
                                                    <strong>
                                                        {endpoint.name}
                                                    </strong>

                                                    <span>
                                                        {endpoint.method || "GET"}{" "}
                                                        {endpoint.url}
                                                    </span>
                                                </div>

                                                {selected && (
                                                    <Check
                                                        size={18}
                                                        className="collection-endpoint-check"
                                                    />
                                                )}
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="collection-editor-actions">
                            <button
                                type="button"
                                className="collection-cancel-button"
                                onClick={closeForm}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="collections-create-button"
                                disabled={saving}
                            >
                                <Save size={17} />

                                {saving
                                    ? "Saving..."
                                    : isEditing
                                        ? "Save Changes"
                                        : "Create Collection"}
                            </button>
                        </div>

                    </form>
                </div>
            )}
        </section>
    );
}

export default Collections;