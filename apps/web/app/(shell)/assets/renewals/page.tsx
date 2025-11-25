"use client";

import { useMemo, useState } from "react";
import styles from "../../../page.module.css";

type RenewalRow = {
  id: string;
  assetName: string;
  type: "LICENSE" | "MANAGED_SERVICE" | "OTHER";
  vendorName: string;
  ownerName: string;
  nextRenewalDate: string;
  estimatedAmountUsd: number;
  status: "PLANNED" | "SCHEDULED" | "RENEWED";
};

const initialRenewals: RenewalRow[] = [
  {
    id: "r1",
    assetName: "CRM Enterprise Licenses",
    type: "LICENSE",
    vendorName: "CloudCRM Inc.",
    ownerName: "Head of Sales",
    nextRenewalDate: "2025-03-15",
    estimatedAmountUsd: 45000,
    status: "PLANNED",
  },
  {
    id: "r2",
    assetName: "Data Center Managed Service",
    type: "MANAGED_SERVICE",
    vendorName: "InfraCorp",
    ownerName: "Infrastructure Lead",
    nextRenewalDate: "2025-02-01",
    estimatedAmountUsd: 8500,
    status: "SCHEDULED",
  },
];

export default function AssetRenewalsPage() {
  const [rows, setRows] = useState<RenewalRow[]>(initialRenewals);

  const sorted = useMemo(
    () =>
      [...rows].sort((a, b) =>
        a.nextRenewalDate < b.nextRenewalDate ? -1 : 1,
      ),
    [rows],
  );

  const updateStatus = (id: string, status: RenewalRow["status"]) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r)),
    );
  };

  const postponeOneYear = (id: string) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const date = new Date(r.nextRenewalDate);
        date.setFullYear(date.getFullYear() + 1);
        const next = date.toISOString().slice(0, 10);
        return { ...r, nextRenewalDate: next, status: "PLANNED" };
      }),
    );
  };

  return (
    <>
      <header className={styles.dashboardHeader}>
        <h1>Renewal Tracker</h1>
        <p>
          Focused view of assets and licenses due for renewal in the upcoming
          period. This view uses local demo data only.
        </p>
      </header>
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3>Upcoming Renewals</h3>
          <span className={styles.badge}>Demo</span>
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
                  Asset
                </th>
                <th style={{ textAlign: "left", padding: "8px 4px" }}>
                  Type
                </th>
                <th style={{ textAlign: "left", padding: "8px 4px" }}>
                  Vendor
                </th>
                <th style={{ textAlign: "left", padding: "8px 4px" }}>
                  Owner
                </th>
                <th style={{ textAlign: "left", padding: "8px 4px" }}>
                  Next Renewal
                </th>
                <th style={{ textAlign: "right", padding: "8px 4px" }}>
                  Est. Amount (USD)
                </th>
                <th style={{ textAlign: "left", padding: "8px 4px" }}>
                  Status
                </th>
                <th style={{ textAlign: "right", padding: "8px 4px" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => (
                <tr key={r.id}>
                  <td style={{ padding: "6px 4px" }}>{r.assetName}</td>
                  <td style={{ padding: "6px 4px" }}>{r.type}</td>
                  <td style={{ padding: "6px 4px" }}>{r.vendorName}</td>
                  <td style={{ padding: "6px 4px" }}>{r.ownerName}</td>
                  <td style={{ padding: "6px 4px" }}>{r.nextRenewalDate}</td>
                  <td style={{ padding: "6px 4px", textAlign: "right" }}>
                    $
                    {r.estimatedAmountUsd.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td style={{ padding: "6px 4px" }}>{r.status}</td>
                  <td style={{ padding: "6px 4px", textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() => updateStatus(r.id, "SCHEDULED")}
                      style={{
                        borderRadius: 999,
                        border: "none",
                        padding: "4px 8px",
                        fontSize: 11,
                        cursor: "pointer",
                        marginRight: 4,
                        background: "#e0f2fe",
                        color: "#0369a1",
                      }}
                    >
                      Mark scheduled
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus(r.id, "RENEWED")}
                      style={{
                        borderRadius: 999,
                        border: "none",
                        padding: "4px 8px",
                        fontSize: 11,
                        cursor: "pointer",
                        marginRight: 4,
                        background: "#dcfce7",
                        color: "#166534",
                      }}
                    >
                      Mark renewed
                    </button>
                    <button
                      type="button"
                      onClick={() => postponeOneYear(r.id)}
                      style={{
                        borderRadius: 999,
                        border: "none",
                        padding: "4px 8px",
                        fontSize: 11,
                        cursor: "pointer",
                        background: "#fef9c3",
                        color: "#854d0e",
                      }}
                    >
                      Postpone 1 year
                    </button>
                  </td>
                </tr>
              ))}
              {sorted.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: "12px 4px",
                      textAlign: "center",
                      color: "rgba(15,23,42,0.6)",
                    }}
                  >
                    No upcoming renewals.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}