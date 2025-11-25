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
  const [search, setSearch] = useState("");
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

  const filteredRows = useMemo(() => {
    if (!search.trim()) return sortedRows;
    const q = search.toLowerCase();
    return sortedRows.filter((row) => {
      const amountStr = String(row.amountUsd);
      return (
        row.projectVendor.toLowerCase().includes(q) ||
        row.costType.toLowerCase().includes(q) ||
        row.status.toLowerCase().includes(q) ||
        amountStr.includes(q)
      );
    });
  }, [sortedRows, search]);

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
          Create and manage CAPEX/OPEX transactions. This demo uses local data
          only; in production it will be backed by the API and Prisma.
        </p>
      </header>

      <div className={styles.scCard}>
        <div className={styles.allocToolbar}>
          <span className={styles.scHeaderTitle}>Expense Transactions</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className={styles.allocSearchWrapper}>
              <span className={styles.allocSearchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search by project, vendor or status…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.allocSearch}
              />
            </div>
            <button
              type="button"
              className={styles.scPrimaryButton}
              onClick={openCreate}
            >
              + New Transaction
            </button>
          </div>
        </div>

        <div className={styles.scTableWrapper}>
          <table className={styles.scTable}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Date</th>
                <th style={{ textAlign: "left" }}>Project / Vendor</th>
                <th style={{ textAlign: "left" }}>Cost Type</th>
                <th style={{ textAlign: "right" }}>Amount (USD)</th>
                <th style={{ textAlign: "left" }}>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id} className={styles.scTableRow}>
                  <td>{row.date}</td>
                  <td>{row.projectVendor}</td>
                  <td>{row.costType}</td>
                  <td style={{ textAlign: "right" }}>
                    {formatCurrency(row.amountUsd, "USD", "en-US")}
                  </td>
                  <td>{row.status}</td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() => openEdit(row)}
                      className={`${styles.scActionButton} ${styles.scActionBlue}`}
                      style={{ marginRight: 4 }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(row.id)}
                      className={`${styles.scActionButton} ${styles.scActionDelete}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: "12px 4px",
                      textAlign: "center",
                      color: "rgba(15,23,42,0.6)",
                    }}
                  >
                    No transactions match this search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
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
              borderRadius: 16,
              background: "#fff",
              padding: 20,
              boxShadow: "0 20px 40px rgba(15,23,42,0.15)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <h3 style={{ fontSize: 16 }}>
                {mode === "create" ? "New Transaction" : "Edit Transaction"}
              </h3>
              <button
                type="button"
                onClick={closeForm}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 18,
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <label style={{ fontSize: 12 }}>
                Date
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, date: e.target.value }))
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
              <label style={{ fontSize: 12 }}>
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
                    marginTop: 4,
                    padding: "6px 8px",
                    fontSize: 12,
                  }}
                  required
                />
              </label>
              <label style={{ fontSize: 12 }}>
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
                    marginTop: 4,
                    padding: "6px 8px",
                    fontSize: 12,
                  }}
                >
                  <option value="CAPEX">CAPEX</option>
                  <option value="OPEX">OPEX</option>
                </select>
              </label>
              <label style={{ fontSize: 12 }}>
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
                    marginTop: 4,
                    padding: "6px 8px",
                    fontSize: 12,
                  }}
                  required
                />
              </label>
              <label style={{ fontSize: 12 }}>
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
                    marginTop: 4,
                    padding: "6px 8px",
                    fontSize: 12,
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
                  marginTop: 6,
                }}
              >
                <button
                  type="button"
                  onClick={closeForm}
                  style={{
                    borderRadius: 999,
                    border: "none",
                    padding: "6px 12px",
                    fontSize: 12,
                    cursor: "pointer",
                    background: "#e5e7eb",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    borderRadius: 999,
                    border: "none",
                    padding: "6px 12px",
                    fontSize: 12,
                    cursor: "pointer",
                    background: "#0f172a",
                    color: "#f9fafb",
                  }}
                >
                  {mode === "create" ? "Create" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}