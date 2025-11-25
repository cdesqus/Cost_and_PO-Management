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

      <div className={styles.scTabBar}>
        <button
          type="button"
          onClick={() => setActiveTab("commitments")}
          className={`${styles.scTab} ${
            activeTab === "commitments" ? styles.scTabActive : ""
          }`}
        >
          Commitments
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("renewals")}
          className={`${styles.scTab} ${
            activeTab === "renewals" ? styles.scTabActive : ""
          }`}
        >
          Renewal Tracker
        </button>
      </div>

      {activeTab === "commitments" ? (
        <>
          <div className={styles.scCard}>
            <div className={styles.scHeaderRow}>
              <span className={styles.scHeaderTitle}>New Commitment</span>
              <span className={styles.scDemoBadge}>Demo</span>
            </div>
            <form onSubmit={handleAdd} className={styles.scFormGrid}>
              <label className={styles.scFormField}>
                Name
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className={styles.scInput}
                  required
                />
              </label>
              <label className={styles.scFormField}>
                Type
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      type: e.target.value as CommitmentType,
                    }))
                  }
                  className={styles.scSelect}
                >
                  <option value="LICENSE">LICENSE</option>
                  <option value="MANAGED_SERVICE">MANAGED_SERVICE</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </label>
              <label className={styles.scFormField}>
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
                  className={styles.scInput}
                  required
                />
              </label>
              <label className={styles.scFormField}>
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
                  className={styles.scInput}
                  required
                />
              </label>
              <label className={styles.scFormField}>
                Billing
                <select
                  value={form.billingFrequency}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      billingFrequency: e.target.value,
                    }))
                  }
                  className={styles.scSelect}
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annual">Annual</option>
                  <option value="Biennial">Biennial</option>
                </select>
              </label>
              <label className={styles.scFormField}>
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
                  className={styles.scInput}
                  required
                />
              </label>
              <label className={styles.scFormField}>
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
                  className={styles.scInput}
                />
              </label>
              <label className={styles.scFormField}>
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
                  className={styles.scInput}
                  required
                />
              </label>
              <label className={styles.scFormField}>
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
                  className={styles.scInput}
                  placeholder="Jan 2025 – Dec 2025"
                />
              </label>
              <label className={styles.scFormField}>
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
                  className={styles.scInput}
                  required={form.type === "LICENSE"}
                />
              </label>
              <button type="submit" className={styles.scPrimaryButton}>
                Add
              </button>
            </form>
          </div>

          <div className={styles.scCard}>
            <div className={styles.scHeaderRow}>
              <span className={styles.scHeaderTitle}>Active Commitments</span>
              <span className={styles.scDemoBadge}>Demo data</span>
            </div>
            <div className={styles.scTableWrapper}>
              <table className={styles.scTable}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Commitment</th>
                    <th style={{ textAlign: "left" }}>Type</th>
                    <th style={{ textAlign: "left" }}>Vendor</th>
                    <th style={{ textAlign: "left" }}>Cost Group</th>
                    <th style={{ textAlign: "left" }}>Billing</th>
                    <th style={{ textAlign: "left" }}>Next Renewal</th>
                    <th style={{ textAlign: "left" }}>Last PO</th>
                    <th style={{ textAlign: "right" }}>Last PO Amount (USD)</th>
                    <th style={{ textAlign: "left" }}>Service Period</th>
                    <th style={{ textAlign: "left" }}>Asset No.</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {commitments.map((c) => (
                    <tr key={c.id} className={styles.scTableRow}>
                      <td>{c.name}</td>
                      <td>{getTypeLabel(c.type)}</td>
                      <td>{c.vendorName}</td>
                      <td>{c.costGroupName}</td>
                      <td>{c.billingFrequency}</td>
                      <td>{c.nextRenewalDate}</td>
                      <td>{c.lastPoNumber}</td>
                      <td style={{ textAlign: "right" }}>
                        $
                        {c.lastPoAmountUsd.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td>{c.servicePeriodLabel}</td>
                      <td>
                        {c.type === "LICENSE" ? c.assetNumber ?? "-" : "-"}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          onClick={() => handleDelete(c.id)}
                          className={`${styles.scActionButton} ${styles.scActionDelete}`}
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
        <div className={styles.scCard}>
          <div className={styles.scHeaderRow}>
            <span className={styles.scHeaderTitle}>Renewal Tracker</span>
            <span className={styles.scDemoBadge}>Demo</span>
          </div>
          <div className={styles.scTableWrapper}>
            <table className={styles.scTable}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>Commitment</th>
                  <th style={{ textAlign: "left" }}>Type</th>
                  <th style={{ textAlign: "left" }}>Vendor</th>
                  <th style={{ textAlign: "left" }}>Cost Group</th>
                  <th style={{ textAlign: "left" }}>Billing</th>
                  <th style={{ textAlign: "left" }}>Next Renewal</th>
                  <th style={{ textAlign: "right" }}>Est. Amount (USD)</th>
                  <th style={{ textAlign: "left" }}>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {upcomingRenewals.map((c) => (
                  <tr key={c.id} className={styles.scTableRow}>
                    <td>{c.name}</td>
                    <td>{getTypeLabel(c.type)}</td>
                    <td>{c.vendorName}</td>
                    <td>{c.costGroupName}</td>
                    <td>{c.billingFrequency}</td>
                    <td>{c.nextRenewalDate}</td>
                    <td style={{ textAlign: "right" }}>
                      $
                      {c.lastPoAmountUsd.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td>
                      <span
                        className={`${styles.scStatusChip} ${
                          c.renewalStatus === "PLANNED"
                            ? styles.scStatusPlanned
                            : c.renewalStatus === "SCHEDULED"
                            ? styles.scStatusScheduled
                            : styles.scStatusRenewed
                        }`}
                      >
                        {c.renewalStatus}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={() =>
                          updateRenewalStatus(c.id, "SCHEDULED")
                        }
                        className={`${styles.scActionButton} ${styles.scActionBlue}`}
                        style={{ marginRight: 4 }}
                      >
                        Mark scheduled
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateRenewalStatus(c.id, "RENEWED")
                        }
                        className={`${styles.scActionButton} ${styles.scActionGreen}`}
                        style={{ marginRight: 4 }}
                      >
                        Mark renewed
                      </button>
                      <button
                        type="button"
                        onClick={() => postponeOneYear(c.id)}
                        className={`${styles.scActionButton} ${styles.scActionYellow}`}
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