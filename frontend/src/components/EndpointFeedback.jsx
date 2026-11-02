
function EndpointFeedback({ loading, error, activeNav }) {
    if (activeNav === "Beneficiaries") {
        return null;
    }

    return (
        <>
            {error && (
                <p className="beneficiary-error" role="alert">
                    {error}
                </p>
            )}

            {loading && <p>Loading endpoints...</p>}
        </>
    );
}

export default EndpointFeedback;
