import { useEffect, useState } from "react";
import "./App.css";
import EndpointsTable from "./components/EndpointsTable";
import EndpointTestHistory from "./components/EndpointTestHistory";
import EndpointForm from "./components/EndpointForm";
import DashboardSummary from "./components/DashboardSummary";
import DashboardAnalytics from "./components/DashboardAnalytics";
import PageHeading from "./components/PageHeading";
import Topbar from "./components/Topbar.jsx";
import Sidebar from "./components/Sidebar";
import SettingsPanel from "./components/SettingsPanel";
import IncidentsPanel from "./components/IncidentsPanel";
import EndpointFeedback from "./components/EndpointFeedback";
import ProfilePanel from "./components/ProfilePanel";
import { getProfile } from "./api/profile";
import Collections from "./components/Collections";
import { getSavedSettings } from "./components/SettingsPanel";
import { getIncidents } from "./api/incidents";

import {
  getEndpoints,
  registerEndpoint,
  updateEndpoint,
  deleteEndpoint,
  getEndpointTestHistory,
  testEndpoint,
} from "./api/endpoints";


function App() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [endpointList, setEndpointList] = useState([]);
  const [endpointName, setEndpointName] = useState("");
  const [endpointUrl, setEndpointUrl] = useState("");

  const [selectedEndpointId, setSelectedEndpointId] = useState(null);
  const [testHistory, setTestHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  const [endpointMethod, setEndpointMethod] = useState("GET");
  const [requestBody, setRequestBody] = useState("");

  const [profile, setProfile] = useState(null);

  const [testingEndpointIds, setTestingEndpointIds] = useState([]);

  const [editingEndpointId, setEditingEndpointId] = useState(null);
  const [deletingEndpointIds, setDeletingEndpointIds] = useState([]);

  const [averageLatency, setAverageLatency] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [settings, setSettings] = useState(getSavedSettings);
  useEffect(() => {
    getProfile()
        .then((data) => setProfile(data))
        .catch((error) => console.error("Failed to load profile:", error));
  }, []);
  const [endpointLoading, setEndpointLoading] = useState(false);
  const [endpointError, setEndpointError] = useState("");
  const [incidentCount, setIncidentCount] = useState(0);

  const loadIncidentCount = async () => {
    try {
      const incidents = await getIncidents();

      setIncidentCount(
          incidents.filter(
              (incident) => incident.status === "OPEN"
          ).length
      );
    } catch (error) {
      console.error("Failed to load incident count:", error);
    }
  };


  async function loadAverageLatency(endpoints) {
    try {
      const histories = await Promise.all(
          endpoints.map(async (endpoint) => {
            const history = await getEndpointTestHistory(endpoint.id);

            // Handle an API response that wraps the history in `data`
            return Array.isArray(history)
                ? history
                : Array.isArray(history?.data)
                    ? history.data
                    : [];
          })
      );

      const tests = histories.flat();

      console.log("Total test records:", tests.length);
      console.log("Test records:", tests);

      // Availability: successful tests / all tests
      if (tests.length === 0) {
        setAvailability(null);
      } else {
        const successfulTests = tests.filter(
            (test) => test.success === true
        ).length;

        const calculatedAvailability =
            (successfulTests / tests.length) * 100;

        console.log("Calculated availability:", calculatedAvailability);
        setAvailability(calculatedAvailability);
      }

      // Average latency from successful tests
      const durations = tests
          .filter((test) => test.success === true)
          .map((test) => test.durationMs)
          .filter(
              (duration) =>
                  typeof duration === "number" &&
                  Number.isFinite(duration) &&
                  duration >= 0
          );

      setAverageLatency(
          durations.length
              ? durations.reduce((sum, duration) => sum + duration, 0) /
              durations.length
              : null
      );
    } catch (error) {
      console.error("Failed to calculate dashboard metrics:", error);
      setAvailability(null);
      setAverageLatency(null);
    }
  }

  const filteredEndpoints = endpointList.filter((endpoint) =>
      `${endpoint.name} ${endpoint.url} ${endpoint.status}`
          .toLowerCase()
          .includes(search.toLowerCase()),
  );

  const operationalCount = endpointList.filter(
      (endpoint) => String(endpoint.status || "").toUpperCase() === "OPERATIONAL",
  ).length;

  const loadEndpoints = async () => {
    try {
      setEndpointLoading(true);
      setEndpointError("");

      const data = await getEndpoints();
      setEndpointList(data);

      await loadAverageLatency(data);
      await loadIncidentCount();
    } catch (error) {
      setEndpointError(
          error.response?.data?.message ||
          "Failed to load endpoints. Please check the backend."
      );
    } finally {
      setEndpointLoading(false);
    }
  };

  const openTestHistory = async (endpointId) => {
    setSelectedEndpointId(endpointId);
    setHistoryLoading(true);
    setHistoryError("");
    setTestHistory([]);

    try {
      const history = await getEndpointTestHistory(endpointId);
      setTestHistory(history);
    } catch (error) {
      setHistoryError(
          error.response?.data?.message || "Failed to load test history."
      );
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleTestEndpoint = async (endpointId) => {
    setTestingEndpointIds((previous) => [...previous, endpointId]);

    try {
      const result = await testEndpoint(endpointId);

      let uptime = null;

      try {
        const response = await getEndpointTestHistory(endpointId);

        const history = Array.isArray(response)
            ? response
            : Array.isArray(response?.data)
                ? response.data
                : [];

        if (history.length > 0) {
          const successfulTests = history.filter(
              (test) => test.success === true
          ).length;

          uptime = Number(
              ((successfulTests / history.length) * 100).toFixed(2)
          );
        }
      } catch (historyError) {
        console.error("Failed to load endpoint test history:", historyError);
      }

      const updatedResult = {
        ...result,
        uptime,
      };

      setEndpointList((previous) =>
          previous.map((endpoint) =>
              endpoint.id === endpointId
                  ? {
                    ...endpoint,
                    status: result.success ? "OPERATIONAL" : "DOWN",
                    lastTestResult: updatedResult,
                  }
                  : endpoint
          )
      );

      return updatedResult;
    } catch (error) {
      setEndpointList((previous) =>
          previous.map((endpoint) =>
              endpoint.id === endpointId
                  ? {
                    ...endpoint,
                    status: "DOWN",
                  }
                  : endpoint
          )
      );

      throw error;
    } finally {
      setTestingEndpointIds((previous) =>
          previous.filter((id) => id !== endpointId)
      );
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEndpoints();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (settings.refreshInterval === "manual") return undefined;
    const timer = window.setInterval(loadEndpoints, Number(settings.refreshInterval) * 1000);
    return () => window.clearInterval(timer);
  }, [settings.refreshInterval]);

  function resetEndpointForm() {
    setEndpointName("");
    setEndpointUrl("");
    setEndpointMethod("GET");
    setRequestBody("");
    setEditingEndpointId(null);
    setShowForm(false);
  }

  function handleOpenCreateForm() {
    setEndpointName("");
    setEndpointUrl("");
    setEndpointMethod("GET");
    setRequestBody("");
    setEditingEndpointId(null);
    setEndpointError("");
    setShowForm(true);
  }

  function handleEditEndpoint(endpoint) {
    console.log("Selected endpoint:", endpoint);

    setEditingEndpointId(endpoint.id);
    setEndpointName(endpoint.name ?? "");
    setEndpointUrl(endpoint.url ?? "");
    setEndpointMethod(endpoint.method ?? "GET");
    setRequestBody(endpoint.requestBody ?? "");

    setEndpointError("");
    setActiveNav("Endpoints");
    setShowForm(true);
  }

  async function addEndpoint(event) {
    event.preventDefault();

    if (!endpointName.trim() || !endpointUrl.trim()) {
      setEndpointError("Endpoint name and URL are required.");
      return;
    }

    const endpointData = {
      name: endpointName.trim(),
      url: endpointUrl.trim(),
      method: endpointMethod || "GET",
      requestBody: requestBody.trim() || null,
    };

    try {
      setEndpointError("");

      if (editingEndpointId !== null) {
        await updateEndpoint(editingEndpointId, endpointData);
      } else {
        await registerEndpoint(endpointData);
      }

      await loadEndpoints();
      resetEndpointForm();
    } catch (error) {
      setEndpointError(
          error.response?.data?.message ||
          error.response?.data?.detail ||
          error.message ||
          (editingEndpointId !== null
              ? "Failed to update endpoint."
              : "Failed to register endpoint.")
      );
    }
  }

  async function handleDeleteEndpoint(endpoint) {
    const confirmed = window.confirm(
        `Are you sure you want to delete "${endpoint.name}"?`
    );

    if (!confirmed) return;

    setDeletingEndpointIds((previous) => [...previous, endpoint.id]);
    setEndpointError("");

    try {
      await deleteEndpoint(endpoint.id);

      if (selectedEndpointId === endpoint.id) {
        setSelectedEndpointId(null);
        setTestHistory([]);
        setHistoryError("");
      }

      await loadEndpoints();
    } catch (error) {
      setEndpointError(
          error.response?.data?.message ||
          error.response?.data?.detail ||
          error.message ||
          "Failed to delete endpoint."
      );
    } finally {
      setDeletingEndpointIds((previous) =>
          previous.filter((id) => id !== endpoint.id)
      );
    }
  }
  return (
      <div className="app-shell">
        <Sidebar
            activeNav={activeNav}
            setActiveNav={setActiveNav}
            endpointList={endpointList}
            profile={profile}
            incidentCount={incidentCount}
        />
        <main className="main-content">
          <Topbar
              activeNav={activeNav}
              setActiveNav={setActiveNav}
              profile={profile}
              endpointList={endpointList}
              settings={settings}
          />

          <div className="page-content">
            {activeNav !== "Collections" && (
                <>
                  <PageHeading
                      activeNav={activeNav}
                      onAddEndpoint={
                        activeNav === "Endpoints" ? handleOpenCreateForm : undefined
                      }
                  />

                  <EndpointFeedback
                      loading={endpointLoading}
                      error={endpointError}
                      activeNav={activeNav}
                  />
                </>
            )}
            {activeNav === "Collections" ? (
                <Collections endpointList={endpointList} />

            ) : activeNav === "Profile" ? (
                <ProfilePanel />

            ) : activeNav === "Settings" ? (
                <SettingsPanel onSettingsChange={setSettings} />

            ) : activeNav === "Incidents" ? (
                <IncidentsPanel onIncidentChange={loadIncidentCount} />

            ) : activeNav === "Endpoints" ? (
                <>
                  <EndpointsTable
                      filteredEndpoints={filteredEndpoints}
                      endpointList={endpointList}
                      search={search}
                      setSearch={setSearch}
                      setShowForm={handleOpenCreateForm}
                      openTestHistory={openTestHistory}
                      onTestEndpoint={handleTestEndpoint}
                      testingEndpointIds={testingEndpointIds}
                      onEditEndpoint={handleEditEndpoint}
                      onDeleteEndpoint={handleDeleteEndpoint}
                      deletingEndpointIds={deletingEndpointIds}
                  />

                  {selectedEndpointId !== null && (
                      <EndpointTestHistory
                          endpointId={selectedEndpointId}
                          testHistory={testHistory}
                          historyLoading={historyLoading}
                          historyError={historyError}
                          onClose={() => {
                            setSelectedEndpointId(null);
                            setTestHistory([]);
                            setHistoryError("");
                          }}
                      />
                  )}
                </>

            ) : activeNav === "Overview" ? (
                <>
                  <DashboardSummary
                      endpointList={endpointList}
                      operationalCount={operationalCount}
                      averageLatency={averageLatency}
                      availability={availability}
                  />

                  <DashboardAnalytics
                      endpointList={endpointList}
                      operationalCount={operationalCount}
                  />
                </>

            ) : null}
            <footer className="page-footer">APIAtlas <span>·</span> API observability for developers <span className="footer-right">Built for reliable APIs</span></footer>
          </div>
        </main>
        {showForm && (
            <div
                className="endpoint-modal-backdrop"
                onClick={(event) => {
                  if (event.target === event.currentTarget) {
                    resetEndpointForm();
                  }
                }}
            >
              <div
                  className="endpoint-modal"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="endpoint-modal-title"
              >
                <div className="endpoint-modal-header">
                  <div>
                    <h2 id="endpoint-modal-title">
                      {editingEndpointId !== null
                          ? "Edit Endpoint"
                          : "Add Endpoint"}
                    </h2>
                    <p>
                      {editingEndpointId !== null
                          ? "Update your monitored endpoint configuration."
                          : "Configure a new endpoint to monitor."}
                    </p>
                  </div>

                  <button
                      type="button"
                      className="endpoint-modal-close"
                      onClick={resetEndpointForm}
                      aria-label="Close modal"
                  >
                    &times;
                  </button>
                </div>

                <EndpointForm
                    endpointName={endpointName}
                    setEndpointName={setEndpointName}
                    endpointUrl={endpointUrl}
                    setEndpointUrl={setEndpointUrl}
                    endpointMethod={endpointMethod}
                    setEndpointMethod={setEndpointMethod}
                    requestBody={requestBody}
                    setRequestBody={setRequestBody}
                    onSubmit={addEndpoint}
                    onCancel={resetEndpointForm}
                    isEditing={editingEndpointId !== null}
                />
              </div>
            </div>
        )}
      </div>
  );
}

export default App;
