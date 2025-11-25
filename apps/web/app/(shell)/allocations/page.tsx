"use client";

import { useState } from "react";
import styles from "../../page.module.css";

type AllocationRow = {
  id: string;
  year: number;
  costGroup: string;
  capexCeiling: number;
  opexCeiling: number;
};

const initialAllocations: AllocationRow[] = [
  {
    id: "a1",
    year: 2025,
    costGroup: "System Development",
    capexCeiling: 600000,
    opexCeiling: 250000,
  },
  {
    id: "a2",
    year: 2025,
    costGroup: "Infrastructure",
    capexCeiling: 400000,
    opexCeiling: 300000,
  },
];

export default function AllocationsPage() {
  const [rows, setRows] = useState<AllocationRow[]>(initialAllocations);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    year: new Date().getFullYear(),
    costGroup: "",
    capexCeiling: "",
    opexCeiling: "",
  });

  const filteredRows = rows.filter((row) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const capexStr = String(row.capexCeiling);
    const opexStr = String(row.opexCeiling);
    return (
      String(row.year).includes(q) ||
      row.costGroup.toLowerCase().includes(q) ||
      capexStr.includes(q) ||
      opexStr.includes(q)
    );
  });

  const openCreate = () => {
    setEditingId(null);
    setForm({
      year: new Date().getFullYear(),
      costGroup: "",
      capexCeiling: "",
      opexCeiling: "",
    });
    setShowModal(true);
  };

  const openEdit = (row: AllocationRow) => {
    setEditingId(row.id);
    setForm({
      year: row.year,
      costGroup: row.costGroup,
      capexCeiling: String(row.capexCeiling),
      opexCeiling: String(row.opexCeiling),
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const capex = Number(form.capexCeiling);
    const opex = Number(form.opexCeiling);
    if (!form.costGroup || Number.isNaN(capex) || Number.isNaN(opex)) {
      return;
    }

    if (editingId) {
      setRows((prev) =>
        prev.map((row) =>
          row.id === editingId
            ? {
                ...row,
                year: form.year,
                costGroup: form.costGroup,
                capexCeiling: capex,
                opexCeiling: opex,
              }
            : row,
        ),
      );
    } else {
      const newRow: AllocationRow = {
        id: `a-${Date.now()}`,
        year: form.year,
        costGroup: form.costGroup,
        capexCeiling: capex,
        opexCeiling: opex,
      };
      setRows((prev) => [...prev, newRow]);
    }

    setShowModal(false);
  };

  return (
    <>
      <header className={styles.dashboardHeader}>
        <h1>Allocation &amp; Ceilings</h1>
        <p>
          Configure and monitor budget limits per Cost Group across CAPEX and
          OPEX. History is preserved by adjusting existing ceilings rather than
          hard deleting records.
        </p>
      </header>

      <div className={styles.scCard}>
        <div className={styles.allocToolbar}>
          <span className={styles.scHeaderTitle}>Cost Group Allocations</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className={styles.allocSearchWrapper}>
              <span className={styles.allocSearchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search by year or cost group…"
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
              + New Allocation
            </button>
          </div>
        </div>
        <div className={styles.scTableWrapper}>
          <table className={styles.scTable}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Year</th>
                <th style={{ textAlign: "left" }}>Cost Group</th>
                <th style={{ textAlign: "right" }}>CAPEX Ceiling (USD)</th>
                <th style={{ textAlign: "right" }}>OPEX Ceiling (USD)</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id} className={styles.scTableRow}>
                  <td>{row.year}</td>
                  <td>{row.costGroup}</td>
                  <td style={{ textAlign: "right" }}>
                    {row.capexCeiling.toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                    })}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {row.opexCeiling.toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                    })}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      className={`${styles.scActionButton} ${styles.scActionBlue}`}
                      onClick={() => openEdit(row)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: "12px 4px",
                      textAlign: "center",
                      color: "rgba(15,23,42,0.6)",
                    }}
                  >
                    No allocations match this search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {showModal ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.35)",
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
              background:
                "radial-gradient(circle at top left, #f9fafb 0, #eff6ff 50%, #e5e7eb 100%)",
              padding: 20,
              boxShadow: "0 24px 60px rgba(15,23,42,0.25)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <h3 style={{ fontSize: 16, letterSpacing: "-0.02em" }}>
                {editingId ? "Edit Allocation" : "New Allocation"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
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
              onSubmit={handleSave}
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <label style={{ fontSize: 12 }}>
                Year
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      year: Number(e.target.value) || prev.year,
                    }))
                  }
                  className={styles.scInput}
                  style={{ marginTop: 4 }}
                />
              </label>
              <label style={{ fontSize: 12 }}>
                Cost Group
                <input
                  type="text"
                  value={form.costGroup}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      costGroup: e.target.value,
                    }))
                  }
                  className={styles.scInput}
                  style={{ marginTop: 4 }}
                  required
                />
              </label>
              <label style={{ fontSize: 12 }}>
                CAPEX Ceiling (USD)
                <input
                  type="number"
                  min="0"
                  value={form.capexCeiling}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      capexCeiling: e.target.value,
                    }))
                  }
                  className={styles.scInput}
                  style={{ marginTop: 4 }}
                  required
                />
              </label>
              <label style={{ fontSize: 12 }}>
                OPEX Ceiling (USD)
                <input
                  type="number"
                  min="0"
                  value={form.opexCeiling}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      opexCeiling: e.target.value,
                    }))
                  }
                  className={styles.scInput}
                  style={{ marginTop: 4 }}
                  required
                />
              </label>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                  marginTop: 8,
                }}
              >
                <button
                  type="button"
                  onClick={closeModal}
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
                  className={styles.scPrimaryButton}
                  style={{ paddingInline: 16 }}
                >
                  Save allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}