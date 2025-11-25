"use client";

import { useMemo, useState } from "react";
import styles from "../../page.module.css";

type CommitmentType = "LICENSE" | "MANAGED_SERVICE" | "MAINTENANCE";
type RenewalStatus = "PLANNED" | "SCHEDULED" | "RENEWED";

type Commitment = {
  id: string;
  name: string;
  type: CommitmentType;
  vendorName: string;
  costGroupName: string;
  billingFrequency: string;
  nextRenewalDate: string;
  lastPoNumber: string;
  lastPoAmountUsd: number;
  servicePeriodLabel: string;
  assetNumber?: string;
  renewalStatus: RenewalStatus;
};

const initialCommitments: Commitment[] = [
  {
    id: "c1",
    name: "CRM Enterprise Licenses",
    type: "LICENSE",
    vendorName: "CloudCRM Inc.",
    costGroupName: "Digitalization",
    billingFrequency: "Annual",
    nextRenewalDate: "2025-03-15",
    lastPoNumber: "PO-2024-0015",
    lastPoAmountUsd: 45000,
    servicePeriodLabel: "Mar 2024 – Feb 2025",
    assetNumber: "LIC-CRM-ENT-001",
    renewalStatus: "PLANNED",
  },
  {
    id: "c2",
    name: "Data Center Managed Service",
    type: "MANAGED_SERVICE",
    vendorName: "InfraCorp",
    costGroupName: "Infrastructure",
    billingFrequency: "Monthly",
    nextRenewalDate: "2025-02-01",
    lastPoNumber: "PO-2025-0003",
    lastPoAmountUsd: 8500,
    servicePeriodLabel: "Jan 2025 – Jan 2025",
    renewalStatus: "SCHEDULED",
  },
  {
    id: "c3",
    name: "Finance ERP Maintenance",
    type: "MAINTENANCE",
    vendorName: "ERP Systems Ltd.",
    costGroupName: "System Development",
    billingFrequency: "Annual",
    nextRenewalDate: "2025-06-30",
    lastPoNumber: "PO-2024-0101",
    lastPoAmountUsd: 32000,
    servicePeriodLabel: "Jul 2024 – Jun 2025",
    renewalStatus: "PLANNED",
  },
];

function getTypeLabel(type: CommitmentType): string {
  if (type === "LICENSE") return "License";
  if (type === "MANAGED_SERVICE") return "Managed Service";
  return "Maintenance";
}

type ActiveTab = "commitments" | "renewals";

export default function ServiceCommitmentsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("commitments");
  const [commitments, setCommitments] = useState<Commitment[]>(
    initialCommitments,
  );
  const [form, setForm] = useState({
    name: "",
    type: "LICENSE" as CommitmentType,
    vendorName: "",
    costGroupName: "",
    billingFrequency: "Annual",
    nextRenewalDate: "",
    lastPoNumber: "",
    lastPoAmountUsd: "",
    servicePeriodLabel: "",
    assetNumber: "",
  });

  const upcomingRenewals = useMemo(
    () =>
      commitments
        .filter((c) => c.nextRenewalDate && c.renewalStatus !== "RENEWED")
        .sort((a, b) =>
          a.nextRenewalDate < b.nextRenewalDate ? -1 : 1,
        ),
    [commitments],
  );

  const handleAdd = (event: React.FormEvent) => {
    event.preventDefault();
    const amount = Number(form.lastPoAmountUsd);
    if (
      !form.name ||
      !form.vendorName ||
      !form.costGroupName ||
      !form.nextRenewalDate ||
      Number.isNaN(amount)
    ) {
      return;
    }

    const newCommitment: Commitment = {
      id: `c-${Date.now()}`,
      name: form.name,
      type: form.type,
      vendorName: form.vendorName,
      costGroupName: form.costGroupName,
      billingFrequency: form.billingFrequency,
      nextRenewalDate: form.nextRenewalDate,
      lastPoNumber: form.lastPoNumber || "-",
      lastPoAmountUsd: amount,
      servicePeriodLabel: form.servicePeriodLabel || "TBD",
      assetNumber:
        form.type === "LICENSE" && form.assetNumber
          ? form.assetNumber
          : undefined,
      renewalStatus: "PLANNED",
    };

    setCommitments((prev) => [newCommitment, ...prev]);
    setForm({
      name: "",
      type: "LICENSE",
      vendorName: "",
      costGroupName: "",
      billingFrequency: "Annual",
      nextRenewalDate: "",
      lastPoNumber: "",
      lastPoAmountUsd: "",
      servicePeriodLabel: "",
      assetNumber: "",
    });
  };

  const handleDelete = (id: string) => {
    setCommitments((prev) => prev.filter((c) => c.id !== id));
  };

  const updateRenewalStatus = (id: string, status: RenewalStatus) => {
    setCommitments((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, renewalStatus: status } : c,
      ),
    );
  };

  const postponeOneYear = (id: string) => {
    setCommitments((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const date = new Date(c.nextRenewalDate);
        date.setFullYear(date.getFullYear() + 1);
        const next = date.toISOString().slice(0, 10);
        return { ...c, nextRenewalDate: next, renewalStatus: "PLANNED" };
      }),
    );
  };

  return (
    <>
      <header className={styles.dashboardHeader}>
        <h1>Service Commitments</h1>
        <p>
          Unified view of licenses and managed services, showing how each is
          funded via POs and when the next renewal will hit the budget. This
          uses local demo data only.
        </p>
      </header>

      <div
        style={{
          display: "inline-flex",
          borderRadius: 999,
          border: "1px solid rgba(15,23,42,0.08)",
          padding: 2,
          marginBottom: 12,
          background: "rgba(255,255,255,0.9)",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("commitments")}
          style={{
            border: "none",
            borderRadius: 999,
            padding: "6px 12px",
            fontSize: 12,
            cursor: "pointer",
            background:
              activeTab === "commitments" ? "#0f172a" : "transparent",
            color: activeTab === "commitments" ? "#f9fafb" : "#0f172a",
          }}
        >
          Commitments
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("renewals")}
          style={{
            border: "none",
            borderRadius: 999,
            padding: "6px 12px",
            fontSize: 12,
            cursor: "pointer",
            background:
              activeTab === "renewals" ? "#0f172a" : "transparent",
            color: activeTab === "renewals" ? "#f9fafb" : "#0f172a",
          }}
        >
          Renewal Tracker
        </button>
      </div>

      {activeTab === "commitments" ? (
        <>
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h3>New Commitment</h3>
              <span className={styles.badge}>Demo</span>
            </div>
            <form
              onSubmit={handleAdd}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 8,
                fontSize: 12,
                alignItems: "flex-end",
              }}
            >
              <label>
                Name
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    marginTop: 4,
                    padding: "6px 8px",
                    fontSize: 12,
                  }}
                  required
                />
              </label>
              <label>
                Type
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      type: e.target.value as CommitmentType,
                    }))
                  }
                  style={{
                    width: "100%",
                    marginTop: 4,
                    padding: "6px 8px",
                    fontSize: 12,
                  }}
                >
                  <option value="LICENSE">LICENSE</option>
                  <option value="MANAGED_SERVICE">MANAGED_SERVICE</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </label>
              <label>
                Vendor
                <input
                  type="text"
                  value={form.vendorName}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      vendorName: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    marginTop: 4,
                    padding: "6px 8px",
                    fontSize: 12,
                  }}
                  required
                />
              </label>
              <label>
                Cost Group
                <input
                  type="text"
                  value={form.costGroupName}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      costGroupName: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    marginTop: 4,
                    padding: "6px 8px",
                    fontSize: 12,
                  }}
                  required
                />
              </label>
              <label>
                Billing
                <select
                  value={form.billingFrequency}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      billingFrequency: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    marginTop: 4,
                    padding: "6px 8px",
                    fontSize: 12,
                  }}
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annual">Annual</option>
                  <option value="Biennial">Biennial</option>
                </select>
              </label>
              <label>
                Next Renewal
                <input
                  type="date"
                  value={form.nextRenewalDate}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      nextRenewalDate: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    marginTop: 4,
                    padding: "6px 8px",
                    fontSize: 12,
                  }}
                  required
                />
              </label>
              <label>
                Last PO Number
                <input
                  type="text"
                  value={form.lastPoNumber}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      lastPoNumber: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    marginTop: 4,
                    padding: "6px 8px",
                    fontSize: 12,
                  }}
                />
              </label>
              <label>
                Last PO Amount (USD)
                <input
                  type="number"
                  min="0"
                  value={form.lastPoAmountUsd}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      lastPoAmountUsd: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    marginTop: 4,
                    padding: "6px 8px",
                    fontSize: 12,
                  }}
                  required
                />
              </label>
              <label>
                Service Period
                <input
                  type="text"
                  value={form.servicePeriodLabel}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      servicePeriodLabel: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    marginTop: 4,
                    padding: "6px 8px",
                    fontSize: 12,
                  }}
                  placeholder="e.g. Jan 2025 – Dec 2025"
                />
              </label>
              {form.type === "LICENSE" ? (
                <label>
                  Asset Number / License Key
                  <input
                    type="text"
                    value={form.assetNumber}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        assetNumber: e.target.value,
                      }))
                    }
                    style={{
                      width: "100%",
                      marginTop: 4,
                      padding: "6px 8px",
                      fontSize: 12,
                    }}
                    required
                  />
                </label>
              ) : (
                <div />
              )}
              <button
                type="submit"
                style={{
                  borderRadius: 999,
                  border: "none",
                  padding: "8px 14px",
                  fontSize: 12,
                  cursor: "pointer",
                  background: "#0f172a",
                  color: "#f9fafb",
                  marginTop: 16,
                }}
              >
                Add
              </button>
            </form>
          </div>

          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h3>Active Commitments</h3>
              <span className={styles.badge}>Demo data</span>
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
                      Commitment
                    </th>
                    <th style={{ textAlign: "left", padding: "8px 4px" }}>
                      Type
                    </th>
                    <th style={{ textAlign: "left", padding: "8px 4px" }}>
                      Vendor
                    </th>
                    <th style={{ textAlign: "left", padding: "8px 4px" }}>
                      Cost Group
                    </th>
                    <th style={{ textAlign: "left", padding: "8px 4px" }}>
                      Billing
                    </th>
                    <th style={{ textAlign: "left", padding: "8px 4px" }}>
                      Next Renewal
                    </th>
                    <th style={{ textAlign: "left", padding: "8px 4px" }}>
                      Last PO
                    </th>
                    <th style={{ textAlign: "right", padding: "8px 4px" }}>
                      Last PO Amount (USD)
                    </th>
                    <th style={{ textAlign: "left", padding: "8px 4px" }}>
                      Service Period
                    </th>
                    <th style={{ textAlign: "left", padding: "8px 4px" }}>
                      Asset No. (License)
                    </th>
                    <th style={{ textAlign: "right", padding: "8px 4px" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {commitments.map((c) => (
                    <tr key={c.id}>
                      <td style={{ padding: "6px 4px" }}>{c.name}</td>
                      <td style={{ padding: "6px 4px" }}>
                        {getTypeLabel(c.type)}
                      </td>
                      <td style={{ padding: "6px 4px" }}>{c.vendorName}</td>
                      <td style={{ padding: "6px 4px" }}>{c.costGroupName}</td>
                      <td style={{ padding: "6px 4px" }}>
                        {c.billingFrequency}
                      </td>
                      <td style={{ padding: "6px 4px" }}>{c.nextRenewalDate}</td>
                      <td style={{ padding: "6px 4px" }}>{c.lastPoNumber}</td>
                      <td style={{ padding: "6px 4px", textAlign: "right" }}>
                        $
                        {c.lastPoAmountUsd.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td style={{ padding: "6px 4px" }}>
                        {c.servicePeriodLabel}
                      </td>
                      <td style={{ padding: "6px 4px" }}>
                        {c.type === "LICENSE" ? c.assetNumber ?? "-" : "-"}
                      </td>
                      <td style={{ padding: "6px 4px", textAlign: "right" }}>
                        <button
                          type="button"
                          onClick={() => handleDelete(c.id)}
                          style={{
                            borderRadius: 999,
                            border: "none",
                            padding: "4px 8px",
                            fontSize: 11,
                            cursor: "pointer",
                            background: "#fee2e2",
                            color: "#b91c1c",
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {commitments.length === 0 ? (
                    <tr>
                      <td
                        colSpan={11}
                        style={{
                          padding: "12px 4px",
                          textAlign: "center",
                          color: "rgba(15,23,42,0.6)",
                        }}
                      >
                        No service commitments defined.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h3>Renewal Tracker</h3>
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
                    Commitment
                  </th>
                  <th style={{ textAlign: "left", padding: "8px 4px" }}>
                    Type
                  </th>
                  <th style={{ textAlign: "left", padding: "8px 4px" }}>
                    Vendor
                  </th>
                  <th style={{ textAlign: "left", padding: "8px 4px" }}>
                    Cost Group
                  </th>
                  <th style={{ textAlign: "left", padding: "8px 4px" }}>
                    Billing
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
                {upcomingRenewals.map((c) => (
                  <tr key={c.id}>
                    <td style={{ padding: "6px 4px" }}>{c.name}</td>
                    <td style={{ padding: "6px 4px" }}>
                      {getTypeLabel(c.type)}
                    </td>
                    <td style={{ padding: "6px 4px" }}>{c.vendorName}</td>
                    <td style={{ padding: "6px 4px" }}>{c.costGroupName}</td>
                    <td style={{ padding: "6px 4px" }}>
                      {c.billingFrequency}
                    </td>
                    <td style={{ padding: "6px 4px" }}>
                      {c.nextRenewalDate}
                    </td>
                    <td style={{ padding: "6px 4px", textAlign: "right" }}>
                      $
                      {c.lastPoAmountUsd.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td style={{ padding: "6px 4px" }}>{c.renewalStatus}</td>
                    <td style={{ padding: "6px 4px", textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={() => updateRenewalStatus(c.id, "SCHEDULED")}
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
                        onClick={() => updateRenewalStatus(c.id, "RENEWED")}
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
                        onClick={() => postponeOneYear(c.id)}
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
                {upcomingRenewals.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
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
      )}
    </>
  );
}