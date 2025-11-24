"use client";

import styles from "../../page.module.css";

type CommitmentType = "LICENSE" | "MANAGED_SERVICE" | "MAINTENANCE";

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
};

const demoCommitments: Commitment[] = [
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
  },
];

function getTypeLabel(type: CommitmentType): string {
  if (type === "LICENSE") return "License";
  if (type === "MANAGED_SERVICE") return "Managed Service";
  return "Maintenance";
}

export default function ServiceCommitmentsPage() {
  return (
    <>
      <header className={styles.dashboardHeader}>
        <h1>Service Commitments</h1>
        <p>
          Unified view of licenses and managed services, showing how each is
          funded via POs and when the next renewal will hit the budget.
        </p>
      </header>

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
              </tr>
            </thead>
            <tbody>
              {demoCommitments.map((c) => (
                <tr key={c.id}>
                  <td style={{ padding: "6px 4px" }}>{c.name}</td>
                  <td style={{ padding: "6px 4px" }}>{getTypeLabel(c.type)}</td>
                  <td style={{ padding: "6px 4px" }}>{c.vendorName}</td>
                  <td style={{ padding: "6px 4px" }}>{c.costGroupName}</td>
                  <td style={{ padding: "6px 4px" }}>{c.billingFrequency}</td>
                  <td style={{ padding: "6px 4px" }}>{c.nextRenewalDate}</td>
                  <td style={{ padding: "6px 4px" }}>{c.lastPoNumber}</td>
                  <td style={{ padding: "6px 4px", textAlign: "right" }}>
                    ${c.lastPoAmountUsd.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td style={{ padding: "6px 4px" }}>{c.servicePeriodLabel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}