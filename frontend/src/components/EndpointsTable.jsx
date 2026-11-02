import {
    Search,
    Plus,
    Play,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useState } from "react";

const PAGE_SIZE = 3;

function EndpointsTable({
                            filteredEndpoints,
                            search,
                            setSearch,
                            setShowForm,
                            openTestHistory,
                            onTestEndpoint,
                            testingEndpointIds,
                            onEditEndpoint,
                            onDeleteEndpoint,
                            deletingEndpointIds = [],
                        }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSearch, setPageSearch] = useState(search);

    const effectivePage = Math.min(
        currentPage,
        Math.max(1, Math.ceil(filteredEndpoints.length / PAGE_SIZE))
    );

    const totalPages = Math.ceil(filteredEndpoints.length / PAGE_SIZE);
    const startIndex = (effectivePage - 1) * PAGE_SIZE;

    const paginatedEndpoints = filteredEndpoints.slice(
        startIndex,
        startIndex + PAGE_SIZE
    );

    if (pageSearch !== search) {
        setPageSearch(search);
        setCurrentPage(1);
    }


    return (
        <section className="panel endpoints-panel">
            <div className="panel-heading endpoint-heading">
                <div>
                    <h2>Monitored endpoints</h2>
                    <p>Monitor and manage your API services</p>
                </div>

                <div className="endpoint-actions">
                    <label className="search-box">
                        <Search size={16} />
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search endpoints..."
                        />
                    </label>

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() => setShowForm(true)}
                    >
                        <Plus size={16} /> Add
                    </button>
                </div>
            </div>

            <div className="table-scroll">
                <table>
                    <thead>
                    <tr>
                        <th>ENDPOINT</th>
                        <th>METHOD</th>
                        <th>STATUS</th>
                        <th>LATENCY</th>
                        <th>UPTIME</th>
                        <th>LAST CHECK</th>
                        <th>ACTIONS</th>
                    </tr>
                    </thead>

                    <tbody>
                    {paginatedEndpoints.map((endpoint) => {
                        const result = endpoint.lastTestResult;
                        const isTesting = testingEndpointIds.includes(endpoint.id);
                        const isDeleting = deletingEndpointIds.includes(endpoint.id);

                        const status = result
                            ? result.success
                                ? "OPERATIONAL"
                                : "DOWN"
                            : endpoint.status || "PENDING";

                        const latency = result?.durationMs;

                        return (
                            <tr key={endpoint.id}>
                                <td>
                                    <div className="endpoint-name">
                                        {endpoint.name}
                                    </div>
                                    <div className="endpoint-url">
                                        {endpoint.url}
                                    </div>
                                </td>

                                <td>
                                        <span
                                            className={`method method-${(
                                                endpoint.method || "GET"
                                            ).toLowerCase()}`}
                                        >
                                            {endpoint.method || "GET"}
                                        </span>
                                </td>

                                <td>
                                        <span
                                            className={`status-pill ${String(
                                                status
                                            ).toLowerCase()}`}
                                        >
                                            <span />
                                            {isTesting ? "TESTING" : status}
                                        </span>

                                    {result?.errorMessage && (
                                        <div className="muted">
                                            {result.errorMessage}
                                        </div>
                                    )}
                                </td>

                                <td>
                                    {latency != null ? `${latency} ms` : "—"}
                                </td>

                                <td>
                                    {result?.uptime != null
                                        ? `${result.uptime}%`
                                        : "—"}
                                </td>

                                <td className="last-checked">
                                    {result?.testedAt
                                        ? new Date(
                                            result.testedAt
                                        ).toLocaleString()
                                        : "Not tested"}
                                </td>

                                <td>
                                    <div className="endpoint-actions endpoint-row-actions">
                                        <button
                                            type="button"
                                            className="secondary-button"
                                            disabled={isTesting || isDeleting}
                                            onClick={() =>
                                                onTestEndpoint(endpoint.id)
                                            }
                                        >
                                            <Play size={14} />
                                            {isTesting ? "Testing..." : "Test"}
                                        </button>

                                        <button
                                            type="button"
                                            className="secondary-button"
                                            disabled={isDeleting}
                                            onClick={() =>
                                                openTestHistory(endpoint.id)
                                            }
                                        >
                                            History
                                        </button>

                                        <button
                                            type="button"
                                            className="secondary-button"
                                            onClick={() =>
                                                onEditEndpoint(endpoint)
                                            }
                                            title="Edit endpoint"
                                        >
                                            <Pencil size={14} />
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            className="secondary-button delete-endpoint-button"
                                            disabled={isTesting || isDeleting}
                                            onClick={() =>
                                                onDeleteEndpoint(endpoint)
                                            }
                                            title="Delete endpoint"
                                        >
                                            <Trash2 size={14} />
                                            {isDeleting
                                                ? "Deleting..."
                                                : "Delete"}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}

                    {filteredEndpoints.length === 0 && (
                        <tr>
                            <td colSpan={7} className="empty-state">
                                No endpoints match your search.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>


            <div className="pagination">
    <span className="pagination-info">
        {filteredEndpoints.length === 0
            ? "No endpoints"
            : `Showing ${startIndex + 1}–${Math.min(
                startIndex + PAGE_SIZE,
                filteredEndpoints.length
            )} of ${filteredEndpoints.length} endpoints`}
    </span>

                <div className="pagination-actions">
                    <button
                        type="button"
                        className="secondary-button"
                        disabled={effectivePage <= 1}
                        onClick={() => setCurrentPage(effectivePage - 1)}
                    >
                        <ChevronLeft size={16} />
                        Previous
                    </button>

                    <span className="page-indicator">
            Page {effectivePage} of {Math.max(1, totalPages)}
        </span>

                    <button
                        type="button"
                        className="secondary-button"
                        disabled={effectivePage >= totalPages || totalPages === 0}
                        onClick={() => setCurrentPage(effectivePage + 1)}
                    >
                        Next
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </section>
    );
}

export default EndpointsTable;
