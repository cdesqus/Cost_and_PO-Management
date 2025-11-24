"use client";

import { useEffect, useState } from "react";
import type { DashboardOverview } from "@repo/types";
import {
  calculateUtilizationPercent,
  formatCurrency,
} from "@repo/utils/currency";
import styles from "../../page.module.css";

function getMonthLabel(monthNumber: number): string {
  const labels = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return labels[monthNumber] ?? String(monthNumber);
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/dashboard/overview", {
          headers: {
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to load dashboard: ${res.status}`);
        }

        const json = (await res.json()) as DashboardOverview;
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    void fetchDashboard();
  }, []);

  if (loading) {
    return (
      <header className={styles.dashboardHeader}>
        <h1>IT Cost Monitoring &amp; Procurement</h1>
        <p>Loading budget dashboard…</p>
      </header>
    );
  }

  if (!data || error) {
    return (
      <>
        <header className={styles.dashboardHeader}>
          <h1>IT Cost Monitoring &amp; Procurement</h1>
          <p>Unable to load budget dashboard. Please try again later.</p>
        </header>
        {error ? <p>{error}</p> : null}
      </>
    );
  }

  const { budgetSummary, upcomingRenewals } = data;

  const capexUtilization = calculateUtilizationPercent(
    budgetSummary.totalCapexUsed,
    budgetSummary.totalCapexAllocated,
  );
  const opexUtilization = calculateUtilizationPercent(
    budgetSummary.totalOpexUsed,
    budgetSummary.totalOpexAllocated,
  );

  return (
    <>
      <header className={styles.dashboardHeader}>
        <h1>IT Cost Monitoring &amp; Procurement</h1>
        <p>
          Real-time view of CAPEX/OPEX budgets, IT assets, and purchase order
          approvals for the IT Division.
        </p>
      </header>

      <section className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <h2>CAPEX Budget</h2>
          <p className={styles.kpiValue}>
            {formatCurrency(budgetSummary.totalCapexUsed, "USD", "en-US")}{' '}
            <span className={styles.kpiSubtext}>used</span>
          </p>
          <p className={styles.kpiMeta}>
            of{" "}
            {formatCurrency(
              budgetSummary.totalCapexAllocated,
              "USD",
              "en-US",
            )}{" "}
            ({capexUtilization}% utilized)
          </p>
        </div>

        <div className={styles.kpiCard}>
          <h2>OPEX Budget</h2>
          <p className={styles.kpiValue}>
            {formatCurrency(budgetSummary.totalOpexUsed, "USD", "en-US")}{' '}
            <span className={styles.kpiSubtext}>used</span>
          </p>
          <p className={styles.kpiMeta}>
            of{" "}
            {formatCurrency(
              budgetSummary.totalOpexAllocated,
              "USD",
              "en-US",
            )}{" "}
            ({opexUtilization}% utilized)
          </p>
        </div>

        <div className={styles.kpiCard}>
          <h2>Upcoming Renewals</h2>
          <p className={styles.kpiValue}>
            {upcomingRenewals.length}
            <span className={styles.kpiSubtext}> assets</span>
          </p>
          <p className={styles.kpiMeta}>
            Within the next 120 days across licenses and maintenance contracts.
          </p>
        </div>
      </section>

      <section className={styles.sectionGrid}>
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h3>Monthly Burn (USD)</h3>
            <span className={styles.badge}>Demo data</span>
          </div>
          <div className={styles.burnList}>
            {budgetSummary.monthlyBurn.map((item) => (
              <div key={item.month} className={styles.burnRow}>
                <span className={styles.monthLabel}>
                  {getMonthLabel(item.month)}
                </span>
                <div className={styles.burnBars}>
                  <div
                    className={styles.capexBar}
                    style={{ width: `${item.capexUsed / 1_000}%` }}
                  />
                  <div
                    className={styles.opexBar}
                    style={{ width: `${item.opexUsed / 1_000}%` }}
                  />
                </div>
                <div className={styles.burnValues}>
                  <span>
                    CAPEX {formatCurrency(item.capexUsed, "USD", "en-US")}
                  </span>
                  <span>
                    OPEX {formatCurrency(item.opexUsed, "USD", "en-US")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h3>Upcoming Asset Renewals</h3>
            <span className={styles.badge}>Demo data</span>
          </div>
          <ul className={styles.renewalList}>
            {upcomingRenewals.map((asset) => (
              <li key={asset.id} className={styles.renewalItem}>
                <div>
                  <p className={styles.assetName}>{asset.assetName}</p>
                  <p className={styles.assetMeta}>
                    Renewal on {asset.renewalDate}
                  </p>
                </div>
                {typeof asset.costEstimateLocal === "number" ? (
                  <span className={styles.assetCost}>
                    {formatCurrency(
                      asset.costEstimateLocal,
                      asset.currencyLocal ?? "USD",
                      "en-US",
                    )}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}