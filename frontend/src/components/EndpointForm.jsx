function EndpointForm({
                          endpointName,
                          setEndpointName,
                          endpointUrl,
                          setEndpointUrl,
                          endpointMethod,
                          setEndpointMethod,
                          requestBody,
                          setRequestBody,
                          onSubmit,
                          onCancel,
                          isEditing = false,
                      }) {
    const bodyRequired = ["POST", "PUT", "PATCH"].includes(endpointMethod);

    return (
        <form className="endpoint-form" onSubmit={onSubmit}>
            <div>
                <label htmlFor="endpoint-name">Endpoint name</label>
                <input
                    id="endpoint-name"
                    value={endpointName}
                    onChange={(event) => setEndpointName(event.target.value)}
                    placeholder="e.g. Incident API"
                    required
                />
            </div>

            <div>
                <label htmlFor="endpoint-url">Endpoint URL</label>
                <input
                    id="endpoint-url"
                    type="url"
                    value={endpointUrl}
                    onChange={(event) => setEndpointUrl(event.target.value)}
                    placeholder="http://localhost:8080/api/incidents"
                    required
                />
            </div>

            <div>
                <label htmlFor="endpoint-method">HTTP method</label>
                <select
                    id="endpoint-method"
                    value={endpointMethod}
                    onChange={(event) => setEndpointMethod(event.target.value)}
                    required
                >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                    <option value="DELETE">DELETE</option>
                </select>
            </div>

            {bodyRequired && (
                <div>
                    <label htmlFor="endpoint-request-body">
                        Request body (JSON)
                    </label>
                    <textarea
                        id="endpoint-request-body"
                        value={requestBody}
                        onChange={(event) => setRequestBody(event.target.value)}
                        placeholder={'{\n  "title": "API test incident",\n  "description": "Created by APIAtlas"\n}'}
                        rows={6}
                    />
                    <small>
                        Enter valid JSON for POST, PUT, or PATCH requests.
                    </small>
                </div>
            )}

            <div className="endpoint-form-actions">
                <button className="primary-button" type="submit">
                    {isEditing ? "Update endpoint" : "Add endpoint"}
                </button>

                <button
                    className="cancel-button"
                    type="button"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default EndpointForm;