"use client";

import { useMemo, useState } from "react";
import styles from "../../../page.module.css";

type PoStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

type PoRow = {
  id: string;
  poNumber: string;
  vendorName: string;
  costGroupName: string;
  amountUsd: number;
  status: PoStatus;
  createdDate: string;
};

const initialPos: PoRow[] = [
  {
    id: "po1",
    poNumber: "PO-2025-0012",
    vendorName: "CloudCRM Inc.",
    costGroupName: "Digitalization",
    amountUsd: 45000,
    status: "PENDING_APPROVAL",
    createdDate: "2025-01-10",
  },
  {
    id: "po2",
    poNumber: "PO-2025-0009",
    vendorName: "InfraCorp",
    costGroupName: "Infrastructure",
    amountUsd: 85000,
    status: "APPROVED",
    createdDate: "2025-01-05",
  },
];

type FormMode = "create" | "edit";

export default function PoTrackingPage() {
  const [rows, setRows] = useState<PoRow[]>(initialPos);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<FormMode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    poNumber: "",
    vendorName: "",
    costGroupName: "",
    amountUsd: "",
    status: "DRAFT" as PoStatus,
    createdDate: new Date().toISOString().slice(0, 10),
  });

  const sortedRows = useMemo(
    () =>
      [...rows].sort((a, b) =>
        a.createdDate < b.createdDate ? 1 : a.createdDate > b.createdDate ? -1 : 0,
      ),
    [rows],
  );

  const filteredRows = useMemo(() => {
    if (!search.trim()) return sortedRows;
    const q = search.toLowerCase();
    return sortedRows.filter(
      (row) =>
        row.poNumber.toLowerCase().includes(q) ||
        row.vendorName.toLowerCase().includes(q) ||
        row.costGroupName.toLowerCase().includes(q),
    );
  }, [sortedRows, search]);

  const openCreate = () => {
    setMode("create");
    setEditingId(null);
    const today = new Date().toISOString().slice(0, 10);
    setForm({
      poNumber: "",
      vendorName: "",
      costGroupName: "",
      amountUsd: "",
      status: "DRAFT",
      createdDate: today,
    });
    setShowForm(true);
  };

  const openEdit = (row: PoRow) => {
    setMode("edit");
    setEditingId(row.id);
    setForm({
      poNumber: row.poNumber,
      vendorName: row.vendorName,
      costGroupName: row.costGroupName,
      amountUsd: String(row.amountUsd),
      status: row.status,
      createdDate: row.createdDate,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const parsedAmount = Number(form.amountUsd);
    if (
      !form.poNumber ||
      !form.vendorName ||
      !form.costGroupName ||
      Number.isNaN(parsedAmount)
    ) {
      return;
    }

    if (mode === "create") {
      const newRow: PoRow = {
        id: `po-${Date.now()}`,
        poNumber: form.poNumber,
        vendorName: form.vendorName,
        costGroupName: form.costGroupName,
        amountUsd: parsedAmount,
        status: form.status,
        createdDate: form.createdDate,
      };
      setRows((prev) => [newRow, ...prev]);
    } else if (editingId) {
      setRows((prev) =>
        prev.map((row) =>
          row.id === editingId
            ? {
                ...row,
                poNumber: form.poNumber,
                vendorName: form.vendorName,
                costGroupName: form.costGroupName,
                amountUsd: parsedAmount,
                status: form.status,
                createdDate: form.createdDate,
              }
            : row,
        ),
      );
    }

    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  return (
    <>
      <header className={styles.dashboardHeader}>
        <h1>Purchase Orders</h1>
        <p>
          Single view for all POs — draft, pending approval, and approved —
          with inline status updates. This view uses local demo data only.
        </p>
      </header>
      <div className={styles.poCard}>
        <div className={styles.poHeaderRow}>
          <div className={styles.poHeaderTitleGroup}>
            <h3>All Purchase Orders</h3>
            <span className={styles.poHeaderSubtitle}>
              View and manage draft, pending, and approved purchase orders in one place.
            </span>
          </div>
          <button
            type="button"
            onClick={openCreate}
            style={{
              borderRadius: 999,
              border: "none",
              padding: "8px 16px",
              fontSize: 13,
              cursor: "pointer",
              background: "#0f172a",
              color: "#f9fafb",
              fontWeight: 500,
            }}
          >
            Create Purchase Order
          </button>
        </div>
        <div className={styles.poSearchWrapper}>
          <input
            type="text"
            placeholder="Search by PO number, vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.poSearch}
          />
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className={styles.poTable}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>PO Number</th>
                <th style={{ textAlign: "left" }}>Vendor</th>
                <th style={{ textAlign: "left" }}>Cost Group</th>
                <th style={{ textAlign: "right" }}>Amount (USD)</th>
                <th style={{ textAlign: "left" }}>Status</th>
                <th style={{ textAlign: "left" }}>Created</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id} className={styles.poTableRow}>
                  <td>{row.poNumber}</td>
                  <td>{row.vendorName}</td>
                  <td>{row.costGroupName}</td>
                  <td style={{ textAlign: "right" }}>
                    $
                    {row.amountUsd.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td>
                    <span
                      className={`${styles.poStatusChip} ${
                        row.status === "DRAFT"
                          ? styles.poStatusDraft
                          : row.status === "PENDING_APPROVAL"
                          ? styles.poStatusPending
                          : row.status === "APPROVED"
                          ? styles.poStatusApproved
                          : row.status === "REJECTED"
                          ? styles.poStatusRejected
                          : styles.poStatusCancelled
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td>{row.createdDate}</td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() => openEdit(row)}
                      className={`${styles.poActionButton} ${styles.poActionEdit}`}
                      style={{ marginRight: 4 }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(row.id)}
                      className={`${styles.poActionButton} ${styles.poActionDelete}`}
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: "12px 4px",
                      textAlign: "center",
                      color: "rgba(15,23,42,0.6)",
                    }}
                  >
                    No purchase orders match this search.
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
                {mode === "create" ? "New Purchase Order" : "Edit Purchase Order"}
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
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 10,
                }}
              >
                <div>
                  <h4
                    style={{
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      marginBottom: 4,
                      color: "rgba(15,23,42,0.6)",
                    }}
                  >
                    PO Basics
                  </h4>
                  <label style={{ fontSize: 12 }}>
                    PO Number
                    <input
                      type="text"
                      value={form.poNumber}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          poNumber: e.target.value,
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
                  <label style={{ fontSize: 12, marginTop: 8 }}>
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
                  <label style={{ fontSize: 12, marginTop: 8 }}>
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
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      marginBottom: 4,
                      color: "rgba(15,23,42,0.6)",
                    }}
                  >
                    Financials &amp; Status
                  </h4>
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
                  <label style={{ fontSize: 12, marginTop: 8 }}>
                    Status
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          status: e.target.value as PoStatus,
                        }))
                      }
                      style={{
                        width: "100%",
                        marginTop: 4,
                        padding: "6px 8px",
                        fontSize: 12,
                      }}
                    >
                      <option value="DRAFT">DRAFT</option>
                      <option value="PENDING_APPROVAL">PENDING_APPROVAL</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="REJECTED">REJECTED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </label>
                  <label style={{ fontSize: 12, marginTop: 8 }}>
                    Created Date
                    <input
                      type="date"
                      value={form.createdDate}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          createdDate: e.target.value,
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
                </div>
              </div>
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