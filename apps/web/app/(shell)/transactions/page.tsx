"use client";

import { useMemo, useState } from "react";
import styles from "../../page.module.css";
import { formatCurrency } from "@repo/utils/currency";

type CostType = "CAPEX" | "OPEX";
type TransactionStatus = "BUDGETED" | "COMMITTED" | "PAID";

type TransactionRow = {
  id: string;
  date: string;
  projectVendor: string;
  costType: CostType;
  amountUsd: number;
  status: TransactionStatus;
};

type FormMode = "create" | "edit";

const initialRows: TransactionRow[] = [
  {
    id: "t1",
    date: "2025-01-12",
    projectVendor: "CRM Rollout / CloudCRM Inc.",
    costType: "OPEX",
    amountUsd: 12000,
    status: "COMMITTED",
  },
  {
    id: "t2",
    date: "2025-01-08",
    projectVendor: "Data Center Refresh / InfraCorp",
    costType: "CAPEX",
    amountUsd: 85000,
    status: "PAID",
  },
];

export default function TransactionsPage() {
  const [rows, setRows] = useState<TransactionRow[]>(initialRows);
  const [mode, setMode] = useState<FormMode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    date: "",
    projectVendor: "",
    costType: "OPEX" as CostType,
    amountUsd: "",
    status: "BUDGETED" as TransactionStatus,
  });

  const sortedRows = useMemo(
    () =>
      [...rows].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)),
    [rows],
  );

  const openCreate = () => {
    setMode("create");
    setEditingId(null);
    setForm({
      date: new Date().toISOString().slice(0, 10),
      projectVendor: "",
      costType: "OPEX",
      amountUsd: "",
      status: "BUDGETED",
    });
    setShowForm(true);
  };

  const openEdit = (row: TransactionRow) => {
    setMode("edit");
    setEditingId(row.id);
    setForm({
      date: row.date,
      projectVendor: row.projectVendor,
      costType: row.costType,
      amountUsd: String(row.amountUsd),
      status: row.status,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const parsedAmount = Number(form.amountUsd);
    if (!form.projectVendor || !form.date || Number.isNaN(parsedAmount)) {
      return;
    }

    if (mode === "create") {
      const newRow: TransactionRow = {
        id: `t-${Date.now()}`,
        date: form.date,
        projectVendor: form.projectVendor,
        costType: form.costType,
        amountUsd: parsedAmount,
        status: form.status,
      };
      setRows((prev) => [newRow, ...prev]);
    } else if (editingId) {
      setRows((prev) =>
        prev.map((row) =>
          row.id === editingId
            ? {
                ...row,
                date: form.date,
                projectVendor: form.projectVendor,
                costType: form.costType,
                amountUsd: parsedAmount,
                status: form.status,
              }
            : row,
        ),
      );
    }

    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    // In a real app this would be a soft delete, with strict RBAC.
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  return (
    <>
      <header className={styles.dashboardHeader}>
        <h1>Expense Transactions</h1>
        <p>
          Create and manage CAPEX/OPEX spend across projects and vendors. This
          demo uses local data only; production will connect to the IT Spend Hub
          API.
        </p>
      </header>

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div>
            <h3>Expense Transactions</h3>
            <p
              style={{
                marginTop: 4,
                fontSize: 12,
                color: "rgba(15, 23, 42, 0.6)",
              }}
            >
              Track CAPEX and OPEX lines with real-time status for approvals and
              payments.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            style={{
              borderRadius: 999,
              border: "none",
              padding: "8px 18px",
              fontSize: 12,
              cursor: "pointer",
              background:
                "linear-gradient(135deg, #020617, #1e293b)", // dark navy gradient
              color: "#f9fafb",
              boxShadow: "0 14px 30px rgba(15, 23, 42, 0.4)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
            }}
          >
            <span>+ New Transaction</span>
          </button>
        </div>

        <div
          style={{
            marginTop: 8,
            borderRadius: 16,
            border: "1px solid rgba(148,163,184,0.25)",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,250,252,0.9))",
            boxShadow: "0 18px 40px rgba(15,23,42,0.04)",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
                fontSize: 12,
              }}
            >
              <thead
                style={{
                  background:
                    "linear-gradient(90deg, rgba(239,246,255,0.95), rgba(239,246,255,0.7))",
                }}
              >
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px 14px",
                      fontWeight: 500,
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      color: "rgba(15,23,42,0.6)",
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px 14px",
                      fontWeight: 500,
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      color: "rgba(15,23,42,0.6)",
                    }}
                  >
                    Project / Vendor
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px 14px",
                      fontWeight: 500,
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      color: "rgba(15,23,42,0.6)",
                    }}
                  >
                    Cost Type
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "10px 14px",
                      fontWeight: 500,
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      color: "rgba(15,23,42,0.6)",
                    }}
                  >
                    Amount (USD)
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px 14px",
                      fontWeight: 500,
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      color: "rgba(15,23,42,0.6)",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "10px 14px",
                      fontWeight: 500,
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      color: "rgba(15,23,42,0.6)",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((row, index) => (
                  <tr
                    key={row.id}
                    style={{
                      background:
                        index % 2 === 0
                          ? "rgba(248,250,252,0.85)"
                          : "rgba(255,255,255,0.9)",
                    }}
                  >
                    <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                      {row.date}
                    </td>
                    <td style={{ padding: "10px 14px" }}>{row.projectVendor}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "4px 10px",
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 500,
                          background:
                            row.costType === "CAPEX"
                              ? "rgba(59,130,246,0.08)"
                              : "rgba(34,197,94,0.08)",
                          color:
                            row.costType === "CAPEX"
                              ? "#1d4ed8"
                              : "#15803d",
                        }}
                      >
                        {row.costType}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "10px 14px",
                        textAlign: "right",
                        fontVariantNumeric: "tabular-nums",
                        fontWeight: 500,
                      }}
                    >
                      {formatCurrency(row.amountUsd, "USD", "en-US")}
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "4px 10px",
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 500,
                          background:
                            row.status === "PAID"
                              ? "rgba(22,163,74,0.08)"
                              : "rgba(234,179,8,0.08)",
                          color:
                            row.status === "PAID"
                              ? "#15803d"
                              : "rgba(161,98,7,1)",
                        }}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "10px 14px",
                        textAlign: "right",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => openEdit(row)}
                        className={styles.secondaryButton}
                        style={{
                          borderRadius: 999,
                          padding: "4px 10px",
                          fontSize: 11,
                          boxShadow: "0 8px 18px rgba(15,23,42,0.06)",
                          marginRight: 6,
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(row.id)}
                        className={styles["button-danger"]}
                        style={{
                          borderRadius: 999,
                          padding: "4px 10px",
                          fontSize: 11,
                          boxShadow: "0 8px 18px rgba(220,38,38,0.15)",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {sortedRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        padding: "16px 14px",
                        textAlign: "center",
                        color: "rgba(15,23,42,0.6)",
                      }}
                    >
                      No transactions yet. Use “New Transaction” to create one.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showForm ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 40,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 480,
              borderRadius: 20,
              background: "rgba(255,255,255,0.98)",
              padding: 20,
              boxShadow: "0 24px 60px rgba(15,23,42,0.25)",
              backdropFilter: "blur(24px)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
                alignItems: "center",
              }}
            >
              <div>
                <h3 style={{ fontSize: 16, marginBottom: 2 }}>
                  {mode === "create" ? "New Transaction" : "Edit Transaction"}
                </h3>
                <p
                  style={{
                    fontSize: 12,
                    color: "rgba(15,23,42,0.6)",
                  }}
                >
                  Capture line-level CAPEX / OPEX with status for approvals.
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 18,
                  lineHeight: 1,
                  padding: 4,
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginTop: 4,
              }}
            >
              <label style={{ fontSize: 12, display: "flex", flexDirection: "column", gap: 4 }}>
                Date
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, date: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    fontSize: 12,
                    borderRadius: 999,
                    border: "1px solid rgba(148,163,184,0.35)",
                    background: "rgba(248,250,252,0.9)",
                  }}
                  required
                />
              </label>
              <label style={{ fontSize: 12, display: "flex", flexDirection: "column", gap: 4 }}>
                Project / Vendor
                <input
                  type="text"
                  value={form.projectVendor}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      projectVendor: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    fontSize: 12,
                    borderRadius: 999,
                    border: "1px solid rgba(148,163,184,0.35)",
                    background: "rgba(248,250,252,0.9)",
                  }}
                  required
                />
              </label>
              <label style={{ fontSize: 12, display: "flex", flexDirection: "column", gap: 4 }}>
                Cost Type
                <select
                  value={form.costType}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      costType: e.target.value as CostType,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    fontSize: 12,
                    borderRadius: 999,
                    border: "1px solid rgba(148,163,184,0.35)",
                    background: "rgba(248,250,252,0.9)",
                  }}
                >
                  <option value="CAPEX">CAPEX</option>
                  <option value="OPEX">OPEX</option>
                </select>
              </label>
              <label style={{ fontSize: 12, display: "flex", flexDirection: "column", gap: 4 }}>
                Amount (USD)
                <input
                  type="number"
                  min="0"
                  value={form.amountUsd}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      amountUsd: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    fontSize: 12,
                    borderRadius: 999,
                    border: "1px solid rgba(148,163,184,0.35)",
                    background: "rgba(248,250,252,0.9)",
                  }}
                  required
                />
              </label>
              <label style={{ fontSize: 12, display: "flex", flexDirection: "column", gap: 4 }}>
                Status
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      status: e.target.value as TransactionStatus,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    fontSize: 12,
                    borderRadius: 999,
                    border: "1px solid rgba(148,163,184,0.35)",
                    background: "rgba(248,250,252,0.9)",
                  }}
                >
                  <option value="BUDGETED">BUDGETED</option>
                  <option value="COMMITTED">COMMITTED</option>
                  <option value="PAID">PAID</option>
                </select>
              </label>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                  marginTop: 10,
                }}
              >
                <button
                  type="button"
                  onClick={closeForm}
                  className={styles.secondaryButton}
                  style={{
                    borderRadius: 999,
                    fontSize: 12,
                    padding: "6px 14px",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    borderRadius: 999,
                    border: "none",
                    padding: "6px 16px",
                    fontSize: 12,
                    cursor: "pointer",
                    background:
                      "linear-gradient(135deg, #020617, #111827)",
                    color: "#f9fafb",
                    boxShadow: "0 14px 30px rgba(15,23,42,0.4)",
                  }}
                >
                  {mode === "create" ? "Create transaction" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}