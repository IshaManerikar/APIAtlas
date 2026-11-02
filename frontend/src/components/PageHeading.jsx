
import { Plus } from "lucide-react";

function PageHeading({ activeNav, onAddEndpoint }) {
    return (
        <section className="page-heading">
            <div>
                <div className="eyebrow">MONITORING OVERVIEW</div>

                <h1>
                    {activeNav === "Overview"
                        ? "Good afternoon, Developer"
                        : activeNav}
                </h1>

                <p>
                    {activeNav === "Overview"
                        ? "Here's what's happening with your APIs today."
                        : `Manage and review your API ${activeNav.toLowerCase()}.`}
                </p>
            </div>

            {activeNav === "Endpoints" && (
                <button
                    className="primary-button"
                    onClick={onAddEndpoint}
                >
                    <Plus size={17} /> Add endpoint
                </button>
            )}
        </section>
    );
}

export default PageHeading;
