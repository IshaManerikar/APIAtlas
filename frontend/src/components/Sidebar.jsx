
import {
    Activity,
    AlertTriangle,
    ChevronDown,
    FolderKanban,
    LayoutDashboard,
    Network,
    Settings,
    Zap,
} from "lucide-react";

function Sidebar({
                     activeNav,
                     setActiveNav,
                     endpointList,
                     profile,
                     incidentCount
                 }) {

    return (
        <aside className="sidebar">
            <div className="brand">
                <div className="brand-icon">
                    <Activity size={22} />
                </div>
                <span>
          API<span className="brand-light">Atlas</span>
        </span>
                <span className="brand-version">BETA</span>
            </div>

            <div className="workspace-label">WORKSPACE</div>

            <button
                type="button"
                className="workspace-switch"
                onClick={() => setActiveNav("Overview")}
                aria-label="Go to workspace overview"
            >
                <div className="workspace-avatar">A</div>
                <div className="workspace-info">
                    <strong>Acme Engineering</strong>
                    <span>Free workspace</span>
                </div>
                <ChevronDown size={15} />
            </button>

            <div className="nav-label">MONITORING</div>

            <nav className="navigation">
                <button
                    type="button"
                    className={`nav-item ${activeNav === "Overview" ? "active" : ""}`}
                    onClick={() => setActiveNav("Overview")}
                >
                    <LayoutDashboard size={18} />
                    Overview
                </button>

                <button
                    type="button"
                    className={`nav-item ${
                        activeNav === "Beneficiaries" ? "active" : ""
                    }`}
                    onClick={() => {
                        setActiveNav("Beneficiaries");
                    }}
                >
                </button>

                <button
                    type="button"
                    className={`nav-item ${activeNav === "Endpoints" ? "active" : ""}`}
                    onClick={() => setActiveNav("Endpoints")}
                >
                    <Network size={18} />
                    Endpoints
                    <span className="nav-count">{endpointList.length}</span>
                </button>
                <button
                    type="button"
                    className={`nav-item ${activeNav === "Collections" ? "active" : ""}`}
                    onClick={() => setActiveNav("Collections")}
                >
                    <FolderKanban size={18} />
                    Collections
                </button>

                <button
                    type="button"
                    className={`nav-item ${activeNav === "Incidents" ? "active" : ""}`}
                    onClick={() => setActiveNav("Incidents")}

                >
                    <AlertTriangle size={18} />
                    Incidents
                    <span className="nav-badge">{incidentCount}</span>
                </button>
            </nav>

            <div className="nav-label">PREFERENCES</div>

            <nav className="navigation">
                <button
                    type="button"
                    className={`nav-item ${activeNav === "Settings" ? "active" : ""}`}
                    onClick={() => setActiveNav("Settings")}
                >
                    <Settings size={18} />
                    Settings
                </button>
            </nav>

            <div className="sidebar-bottom">
                <div className="upgrade-card">
                    <Zap size={18} />
                    <strong>Need more power?</strong>
                    <p>
                        Monitor more endpoints and unlock advanced analytics.
                    </p>
                    <button
                        type="button"
                        onClick={() =>
                            window.alert("Plans will be available in a future version.")
                        }
                    >
                        Explore plans <span>→</span>
                    </button>
                </div>

                <div
                    className={`profile nav-profile ${
                        activeNav === "Profile" ? "active" : ""
                    }`}
                    onClick={() => setActiveNav("Profile")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setActiveNav("Profile");
                        }
                    }}
                >
                    <div className="profile-avatar">
                        {profile?.profileImageUrl ? (
                            <img
                                src={profile.profileImageUrl}
                                alt={profile.fullName || "Profile"}
                            />
                        ) : (
                            profile?.fullName
                                ?.split(" ")
                                .map((name) => name[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase() || "IM"
                        )}
                    </div>

                    <div className="profile-info">
                        <strong>{profile?.fullName || "APIAtlas Developer"}</strong>
                        <span>{profile?.email || "developer@example.com"}</span>
                    </div>

                    <Settings size={17} className="profile-settings" />
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
