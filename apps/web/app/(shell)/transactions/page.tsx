import styles from "../../page.module.css";
import { formatCurrency } from "@repo/utils/currency";

export default function TransactionsPage() {
  return (
    <>
      <header className={styles.dashboardHeader}>
        <h1>Transactions</h1>
        <p>
          Inspect IT cost transactions by project, vendor, and cost group.
          (Sample data only for this demo.)
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
                <th style={{ textAlign: "left", padding: "8px 4px" }}>Date</th>
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