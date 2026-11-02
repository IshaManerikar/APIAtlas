
import {
    Network,
    CheckCircle2,
    Clock3,
    ShieldCheck,
    ArrowUpRight,
} from "lucide-react";

function DashboardSummary({ endpointList = [],
                              operationalCount = 0,
                              averageLatency = null,
                              availability = null,}) {
    const totalEndpoints = endpointList.length;

    return (
        <section className="summary-grid">
            {/* Total endpoints */}
            <article className="metric-card">
                <div className="metric-top">
                    <span>Total endpoints</span>
                    <div className="metric-icon blue">
                        <Network size={18} />
                    </div>
                </div>

                <div className="metric-value">{totalEndpoints}</div>

                <div className="metric-foot">
                    <span className="neutral-change">Monitoring targets</span>
                </div>
            </article>

            {/* Operational endpoints */}
            <article className="metric-card">
                <div className="metric-top">
                    <span>Operational</span>
                    <div className="metric-icon green">
                        <CheckCircle2 size={18} />
                    </div>
                </div>

                <div className="metric-value">{operationalCount}</div>

                <div className="metric-foot">
          <span className="positive-change">
            <ArrowUpRight size={14} />
            Healthy endpoints
          </span>
                </div>
            </article>

            {/* Average latency */}
            <article className="metric-card">
                <div className="metric-top">
                    <span>Average latency</span>
                    <div className="metric-icon purple">
                        <Clock3 size={18} />
                    </div>
                </div>

                <div className="metric-value">
                    {averageLatency === null
                        ? "—"
                        : `${Math.round(averageLatency)} ms`}
                </div>


                <div className="metric-foot">
                  <span className="neutral-change">
                    {averageLatency === null
                        ? "Available after endpoint testing"
                        : "Average response time"}
                  </span>
                </div>
            </article>

            {/* Availability */}
            <article className="metric-card">
                <div className="metric-top">
                    <span>Availability</span>
                    <div className="metric-icon orange">
                        <ShieldCheck size={18} />
                    </div>
                </div>

                <div className="metric-value">
                    {availability == null
                        ? "—"
                        : `${availability.toFixed(1)}%`}
                </div>

                <div className="metric-foot">
    <span className="neutral-change">
      {availability == null
          ? "Available after endpoint testing"
          : "Successful endpoint tests"}
    </span>
                </div>
            </article>
        </section>
    );
}

export default DashboardSummary;
