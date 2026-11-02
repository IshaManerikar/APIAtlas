
import { useEffect, useMemo, useState } from "react";
import { Activity } from "lucide-react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
import { getEndpointTestHistory } from "../api/endpoints";

function DashboardAnalytics({ endpointList, operationalCount }) {
    const [timeRange, setTimeRange] = useState("24h");
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState(false);

    const degradedCount = endpointList.filter(
        (endpoint) =>
            String(endpoint.status || "").toUpperCase() === "DEGRADED"
    ).length;

    const downCount = endpointList.filter(
        (endpoint) =>
            String(endpoint.status || "").toUpperCase() === "DOWN"
    ).length;

    const healthPercentage = endpointList.length
        ? Math.round((operationalCount / endpointList.length) * 100)
        : 0;

    useEffect(() => {
        let cancelled = false;

        async function loadHistory() {
            if (!endpointList.length) {
                setHistory([]);
                setLoadError(false);
                return;
            }

            setLoading(true);
            setLoadError(false);

            try {
                const results = await Promise.all(
                    endpointList.map(async (endpoint) => {
                        try {
                            const response = await getEndpointTestHistory(
                                endpoint.id
                            );

                            const records = Array.isArray(response)
                                ? response
                                : Array.isArray(response?.data)
                                    ? response.data
                                    : [];

                            return records.map((record) => ({
                                ...record,
                                endpointName:
                                    endpoint.name ||
                                    endpoint.url ||
                                    `Endpoint ${endpoint.id}`,
                            }));
                        } catch (error) {
                            console.error(
                                `Failed to load history for endpoint ${endpoint.id}:`,
                                error
                            );
                            throw error;
                        }
                    })
                );

                if (!cancelled) {
                    setHistory(results.flat());
                }
            } catch (error) {
                if (!cancelled) {
                    setHistory([]);
                    setLoadError(true);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadHistory();

        return () => {
            cancelled = true;
        };
    }, [endpointList]);

    const chartData = useMemo(() => {
        const now = Date.now();

        const rangeInMs = {
            "1h": 60 * 60 * 1000,
            "24h": 24 * 60 * 60 * 1000,
            "7d": 7 * 24 * 60 * 60 * 1000,
        }[timeRange];

        return history
            .filter((test) => {
                const testedAt = new Date(test.testedAt).getTime();

                return (
                    test.success === true &&
                    typeof test.durationMs === "number" &&
                    Number.isFinite(test.durationMs) &&
                    Number.isFinite(testedAt) &&
                    testedAt >= now - rangeInMs &&
                    testedAt <= now
                );
            })
            .sort(
                (a, b) =>
                    new Date(a.testedAt).getTime() -
                    new Date(b.testedAt).getTime()
            )
            .map((test) => ({
                time: new Date(test.testedAt).getTime(),
                label: new Date(test.testedAt).toLocaleString(),
                responseTime: test.durationMs,
                endpointName: test.endpointName,
            }));
    }, [history, timeRange]);

    return (
        <section className="analytics-grid">
            <article className="panel latency-panel">
                <div className="panel-heading">
                    <div>
                        <h2>Response time</h2>
                        <p>Average API latency over time</p>
                    </div>

                    <select
                        aria-label="Chart time range"
                        value={timeRange}
                        onChange={(event) => setTimeRange(event.target.value)}
                    >
                        <option value="1h">Last hour</option>
                        <option value="24h">Last 24 hours</option>
                        <option value="7d">Last 7 days</option>
                    </select>
                </div>

                <div className="latency-chart">
                    {loading ? (
                        <div className="chart-message">
                            Loading response-time history...
                        </div>
                    ) : loadError ? (
                        <div className="chart-message">
                            Unable to load test history. Please try again later.
                        </div>
                    ) : chartData.length === 0 ? (
                        <div className="chart-message">
                            No successful API tests found for this time range.
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={chartData}
                                margin={{
                                    top: 12,
                                    right: 18,
                                    left: 0,
                                    bottom: 4,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#e9edf3"
                                />

                                <XAxis
                                    dataKey="time"
                                    type="number"
                                    scale="time"
                                    domain={["dataMin", "dataMax"]}
                                    tickFormatter={(value) =>
                                        new Date(value).toLocaleTimeString(
                                            [],
                                            timeRange === "7d"
                                                ? {
                                                    month: "short",
                                                    day: "numeric",
                                                }
                                                : {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                }
                                        )
                                    }
                                    tick={{ fill: "#8b95a7", fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                    minTickGap={24}
                                />

                                <YAxis
                                    width={55}
                                    tick={{ fill: "#8b95a7", fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) => `${value} ms`}
                                />

                                <Tooltip
                                    labelFormatter={(_, payload) =>
                                        payload?.[0]?.payload?.label || ""
                                    }
                                    formatter={(value, _name, item) => [
                                        `${value} ms`,
                                        item.payload.endpointName,
                                    ]}
                                    contentStyle={{
                                        borderRadius: 8,
                                        border: "1px solid #e9edf3",
                                        fontSize: 12,
                                    }}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="responseTime"
                                    name="Response time"
                                    stroke="#6478f5"
                                    strokeWidth={2.5}
                                    dot={{
                                        r: 3,
                                        fill: "#6478f5",
                                        strokeWidth: 0,
                                    }}
                                    activeDot={{ r: 5 }}
                                    connectNulls={false}
                                    isAnimationActive={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </article>

            <article className="panel health-panel">
                <div className="panel-heading">
                    <div>
                        <h2>Endpoint health</h2>
                        <p>Current service status</p>
                    </div>
                    <Activity size={19} color="#8b95a7" />
                </div>

                <div className="health-score">
                    <div className="health-ring">
                        <span>
                            {healthPercentage}
                            <small>%</small>
                        </span>
                    </div>
                    <div>
                        <strong>
                            {operationalCount} of {endpointList.length}
                        </strong>
                        <p>Endpoints operational</p>
                    </div>
                </div>

                <div className="health-breakdown">
                    <div>
                        <span className="status-dot operational-dot" /> Operational
                        <strong>{operationalCount}</strong>
                    </div>
                    <div>
                        <span className="status-dot degraded-dot" /> Degraded
                        <strong>{degradedCount}</strong>
                    </div>
                    <div>
                        <span className="status-dot down-dot" /> Down
                        <strong>{downCount}</strong>
                    </div>
                </div>
            </article>
        </section>
    );
}

export default DashboardAnalytics;
