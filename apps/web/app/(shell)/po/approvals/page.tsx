"use client";

import { useState } from "react";
import styles from "../../../page.module.css";

type PoApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | "REVISION_REQUESTED";

type PendingPo = {
  id: string;
  poNumber: string;
  vendorName: string;
  amountUsd: number;
  requestedBy: string;
  submittedDate: string;
};

const initialPending: PendingPo[] = [
  {
    id: "ap1",
    poNumber: "PO-2025-0012",
    vendorName: "CloudCRM Inc.",
    amountUsd: 45000,
    requestedBy: "Budget Owner - Digitalization",
    submittedDate: "2025-01-10",
  },
  {
    id: "ap2",
    poNumber: "PO-2025-0003",
    vendorName: "InfraCorp",
    amountUsd: 8500,
    requestedBy: "Infrastructure Lead",
    submittedDate: "2025-01-09",
  },
];

export default function PoApprovalsPage() {
  const [pending, setPending] = useState<PendingPo[]>(initialPending);
  const [lastAction, setLastAction] = useState<{
    status: PoApprovalStatus;
    poNumber: string;
  } | null>(null);

  const handleAction = (po: PendingPo, status: PoApprovalStatus) => {
    setPending((prev) => prev.filter((p) => p.id !== po.id));
    setLastAction({ status, poNumber: po.poNumber });
  };

  return (
    <>
      <header className={styles.dashboardHeader}>
        <h1>Approval Center</h1>
        <p>
          View and take action on Purchase Orders awaiting your approval.
          Actions here update local demo state only.
        </p>
      </header>
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3>Pending Approvals</h3>
          <span className={styles.badge}>Demo</span>
        </div>
        {lastAction ? (
          <p style={{ fontSize: 12, marginBottom: 8 }}>
            Last action: <strong>{lastAction.status}</strong> for{" "}
            <strong>{lastAction.poNumber}</strong>
          </p>
        ) : null}
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
                  PO Number
                </th>
                <th style={{ textAlign: "left", padding: "8px 4px" }}>
                  Vendor
                </th>
                <th style={{ textAlign: "right", padding: "8px 4px" }}>
                  Amount (USD)
                </th>
                <th style={{ textAlign: "left", padding: "8px 4px" }}>
                  Requested By
                </th>
                <th style={{ textAlign: "left", padding: "8px 4px" }}>
                  Submitted
                </th>
                <th style={{ textAlign: "right", padding: "8px 4px" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pending.map((po) => (
                <tr key={po.id}>
                  <td style={{ padding: "6px 4px" }}>{po.poNumber}</td>
                  <td style={{ padding: "6px 4px" }}>{po.vendorName}</td>
                  <td style={{ padding: "6px 4px", textAlign: "right" }}>
                    $
                    {po.amountUsd.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td style={{ padding: "6px 4px" }}>{po.requestedBy}</td>
                  <td style={{ padding: "6px 4px" }}>{po.submittedDate}</td>
                  <td style={{ padding: "6px 4px", textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() => handleAction(po, "APPROVED")}
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
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction(po, "REJECTED")}
                      style={{
                        borderRadius: 999,
                        border: "none",
                        padding: "4px 8px",
                        fontSize: 11,
                        cursor: "pointer",
                        marginRight: 4,
                        background: "#fee2e2",
                        color: "#b91c1c",
                      }}
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction(po, "REVISION_REQUESTED")}
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
                      Request revision
                    </button>
                  </td>
                </tr>
              ))}
              {pending.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: "12px 4px",
                      textAlign: "center",
                      color: "rgba(15,23,42,0.6)",
                    }}
                  >
                    No pending approvals. You are all caught up.
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