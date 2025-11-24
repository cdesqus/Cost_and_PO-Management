"use client";

import { useEffect, useState } from "react";
import { Button } from "@repo/ui/button";
import type { DashboardOverview } from "@repo/types";
import {
  calculateUtilizationPercent,
  formatCurrency,
} from "@repo/utils/currency";
import styles from "./page.module.css";

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

type ActiveView = "dashboard" | "transactions" | "assets" | "purchaseOrders" | "admin";

export default function Home() {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");

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

  const renderMainContent = () => {
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

    if (activeView === "dashboard") {
      return (
        <>
          <header className={styles.dashboardHeader}>
            <h1>IT Cost Monitoring &amp; Procurement</h1>
            <p>
              Real-time view of CAPEX/OPEX budgets, IT assets, and purchase
              order approvals for the IT Division.
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
                Within the next 120 days across licenses and maintenance
                contracts.
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
              <Button appName="web" className={styles.secondaryButton}>
                View full asset register
              </Button>
            </div>
          </section>
        </>
      );
    }

    if (activeView === "transactions") {
      return (
        <>
          <header className={styles.dashboardHeader}>
            <h1>Transactions</h1>
            <p>
              Inspect IT cost transactions by project, vendor, and cost group.
            </p>
          </header>
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h3>Recent Transactions</h3>
              <span className={styles.badge}>Sample data</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 12,
                }}
              >
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "8px 4px" }}>
                      Date
                    </th>
                    <th style={{ textAlign: "left", padding: "8px 4px" }}>
                      Project / Vendor
                    </th>
                    <th style={{ textAlign: "left", padding: "8px 4px" }}>
                      Cost Type
                    </th>
                    <th style={{ textAlign: "right", padding: "8px 4px" }}>
                      Amount (USD)
                    </th>
                    <th style={{ textAlign: "left", padding: "8px 4px" }}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "6px 4px" }}>2025-01-12</td>
                    <td style={{ padding: "6px 4px" }}>
                      CRM Rollout / CloudCRM Inc.
                    </td>
                    <td style={{ padding: "6px 4px" }}>OPEX</td>
                    <td style={{ padding: "6px 4px", textAlign: "right" }}>
                      {formatCurrency(12000, "USD", "en-US")}
                    </td>
                    <td style={{ padding: "6px 4px" }}>COMMITTED</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "6px 4px" }}>2025-01-08</td>
                    <td style={{ padding: "6px 4px" }}>
                      Data Center Refresh / InfraCorp
                    </td>
                    <td style={{ padding: "6px 4px" }}>CAPEX</td>
                    <td style={{ padding: "6px 4px", textAlign: "right" }}>
                      {formatCurrency(85000, "USD", "en-US")}
                    </td>
                    <td style={{ padding: "6px 4px" }}>PAID</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      );
    }

    if (activeView === "assets") {
      return (
        <>
          <header className={styles.dashboardHeader}>
            <h1>IT Assets &amp; Renewals</h1>
            <p>
              Track business-critical licenses, hardware, and contracts with
              renewal visibility.
            </p>
          </header>
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h3>Asset Register Snapshot</h3>
              <span className={styles.badge}>Sample data</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {upcomingRenewals.map((asset) => (
                <div
                  key={asset.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: "1px dashed rgba(15,23,42,0.08)",
                  }}
                >
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
                </div>
              ))}
            </div>
          </div>
        </>
      );
    }

    if (activeView === "purchaseOrders") {
      return (
        <>
          <header className={styles.dashboardHeader}>
            <h1>Purchase Orders</h1>
            <p>
              Create and track purchase orders, and see where they are in the
              approval chain.
            </p>
          </header>
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h3>Approval Pipeline</h3>
              <span className={styles.badge}>Sample data</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                }}
              >
                <div>
                  <strong>PO-2025-0012</strong> — Firewall Subscription
                </div>
                <span>Pending IT Director</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                }}
              >
                <div>
                  <strong>PO-2025-0009</strong> — CRM Licenses
                </div>
                <span>Approved</span>
              </div>
            </div>
          </div>
        </>
      );
    }

    // admin
    return (
      <>
        <header className={styles.dashboardHeader}>
          <h1>Admin Configuration</h1>
          <p>
            Manage cost groups, approval matrices, and vendor access in one
            place.
          </p>
        </header>
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h3>Configuration Areas</h3>
          </div>
          <ul className={styles.renewalList}>
            <li className={styles.renewalItem}>
              <div>
                <p className={styles.assetName}>Cost Groups</p>
                <p className={styles.assetMeta}>
                  Define annual CAPEX/OPEX budgets by portfolio.
                </p>
              </div>
            </li>
            <li className={styles.renewalItem}>
              <div>
                <p className={styles.assetName}>Approval Matrix</p>
                <p className={styles.assetMeta}>
                  Configure threshold-based routing to approvers.
                </p>
              </div>
            </li>
            <li className={styles.renewalItem}>
              <div>
                <p className={styles.assetName}>Vendors</p>
                <p className={styles.assetMeta}>
                  Onboard vendors and control portal access.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </>
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.appShell}>
        <aside className={styles.sidebar}>
          <div className={styles.brand}>
            <div className={styles.brandLogo}>IT</div>
            <div className={styles.brandText}>
              <span className={styles.brandName}>IT Spend Hub</span>
              <span className={styles.brandTagline}>
                CAPEX, OPEX &amp; procurement in one place
              </span>
            </div>
          </div>

          <div>
            <div className={styles.navSectionLabel}>Main</div>
            <ul className={styles.navList}>
              <li>
                <button
                  type="button"
                  className={`${styles.navItemButton} ${
                    activeView === "dashboard" ? styles.navItemActive : ""
                  }`}
                  onClick={() => setActiveView("dashboard")}
                >
                  <span className={styles.navItemIcon}>📊</span>
                  <span className={styles.navItemLabel}>Dashboard</span>
                  <span className={styles.navItemPill}>FY {new Date().getFullYear()}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`${styles.navItemButton} ${
                    activeView === "transactions" ? styles.navItemActive : ""
                  }`}
                  onClick={() => setActiveView("transactions")}
                >
                  <span className={styles.navItemIcon}>💸</span>
                  <span className={styles.navItemLabel}>Transactions</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`${styles.navItemButton} ${
                    activeView === "assets" ? styles.navItemActive : ""
                  }`}
                  onClick={() => setActiveView("assets")}
                >
                  <span className={styles.navItemIcon}>💻</span>
                  <span className={styles.navItemLabel}>Assets</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`${styles.navItemButton} ${
                    activeView === "purchaseOrders" ? styles.navItemActive : ""
                  }`}
                  onClick={() => setActiveView("purchaseOrders")}
                >
                  <span className={styles.navItemIcon}>📑</span>
                  <span className={styles.navItemLabel}>Purchase Orders</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`${styles.navItemButton} ${
                    activeView === "admin" ? styles.navItemActive : ""
                  }`}
                  onClick={() => setActiveView("admin")}
                >
                  <span className={styles.navItemIcon}>⚙️</span>
                  <span className={styles.navItemLabel}>Admin</span>
                </button>
              </li>
            </ul>
          </div>

          <div className={styles.navFooter}>
            <span>Signed in as IT Manager</span>
            <span>Last refreshed just now</span>
          </div>
        </aside>

        <main className={styles.main}>{renderMainContent()}</main>
      </div>
      <footer className={styles.footer}>
        <span>Designed for IT budget owners, approvers, and procurement.</span>
      </footer>
    </div>
  );
}
