
function EndpointTestHistory({
                                 endpointId,
                                 testHistory,
                                 historyLoading,
                                 historyError,
                                 onClose,
                             }) {
    return (
        <section className="panel endpoints-panel">
            <div className="panel-heading endpoint-heading">
                <div>
                    <h2>Test History</h2>
                    <p>Previous test results for endpoint #{endpointId}</p>
                </div>

                <button
                    type="button"
                    className="secondary-button"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>

            {historyLoading ? (
                <p>Loading test history...</p>
            ) : historyError ? (
                <p className="beneficiary-error" role="alert">
                    {historyError}
                </p>
            ) : testHistory.length === 0 ? (
                <p>No test history found for this endpoint.</p>
            ) : (
                <div className="table-scroll">
                    <table>
                        <thead>
                        <tr>
                            <th>TESTED AT</th>
                            <th>STATUS CODE</th>
                            <th>DURATION</th>
                            <th>RESULT</th>
                            <th>ERROR</th>
                        </tr>
                        </thead>

                        <tbody>
                        {testHistory.map((item) => (
                            <tr key={item.id}>
                                <td>{new Date(item.testedAt).toLocaleString()}</td>
                                <td>{item.statusCode ?? "—"}</td>
                                <td>{item.durationMs} ms</td>
                                <td>{item.success ? "Success" : "Failed"}</td>
                                <td>{item.errorMessage || "—"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default EndpointTestHistory;
