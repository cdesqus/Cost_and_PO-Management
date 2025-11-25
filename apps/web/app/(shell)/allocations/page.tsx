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
  const [form, setForm] = useState({
    year: new Date().getFullYear(),
    costGroup: "",
    capexCeiling: "",
    opexCeiling: "",
  });

  const handleCreate = (event: React.FormEvent) => {
    event.preventDefault();
    const capex = Number(form.capexCeiling);
    const opex = Number(form.opexCeiling);
    if (!form.costGroup || Number.isNaN(capex) || Number.isNaN(opex)) {
      return;
    }

    const newRow: AllocationRow = {
      id: `a-${Date.now()}`,
      year: form.year,
      costGroup: form.costGroup,
      capexCeiling: capex,
      opexCeiling: opex,
    };

    setRows((prev) => [...prev, newRow]);
    setForm({
      year: form.year,
      costGroup: "",
      capexCeiling: "",
      opexCeiling: "",
    });
  };

  const handleInlineUpdate = (
    id: string,
    field: "capexCeiling" | "opexCeiling",
    value: string,
  ) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
      return;
    }
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field]: parsed } : row,
      ),
    );
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
        <div className={styles.scHeaderRow}>
          <span className={styles.scHeaderTitle}>New Allocation</span>
          <span className={styles.scDemoBadge}>Create</span>
        </div>
        <form onSubmit={handleCreate} className={styles.scFormGrid}>
          <label className={styles.scFormField}>
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
            />
          </label>
          <label className={styles.scFormField}>
            Cost Group
            <input
              type="text"
              value={form.costGroup}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, costGroup: e.target.value }))
              }
              className={styles.scInput}
              required
            />
          </label>
          <label className={styles.scFormField}>
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
              required
            />
          </label>
          <label className={styles.scFormField}>
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
              required
            />
          </label>
          <button type="submit" className={styles.scPrimaryButton}>
            Add Allocation
          </button>
        </form>
      </div>

      <div className={styles.scCard}>
        <div className={styles.scHeaderRow}>
          <span className={styles.scHeaderTitle}>Cost Group Allocations</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              className={`${styles.scActionButton} ${styles.scActionBlue}`}
            >
              Read &amp; Update
            </button>
            <button
              type="button"
              className={`${styles.scActionButton} ${styles.scActionYellow}`}
              onClick={() => {
                const el = document.activeElement as HTMLElement | null;
                if (el) {
                  el.blur();
                }
              }}
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
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className={styles.scTableRow}>
                  <td>{row.year}</td>
                  <td>{row.costGroup}</td>
                  <td style={{ textAlign: "right" }}>
                    <input
                      type="number"
                      min="0"
                      value={row.capexCeiling}
                      onChange={(e) =>
                        handleInlineUpdate(
                          row.id,
                          "capexCeiling",
                          e.target.value,
                        )
                      }
                      className={styles.scInput}
                      style={{
                        maxWidth: 180,
                        textAlign: "right",
                      }}
                    />
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <input
                      type="number"
                      min="0"
                      value={row.opexCeiling}
                      onChange={(e) =>
                        handleInlineUpdate(
                          row.id,
                          "opexCeiling",
                          e.target.value,
                        )
                      }
                      className={styles.scInput}
                      style={{
                        maxWidth: 180,
                        textAlign: "right",
                      }}
                    />
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      padding: "12px 4px",
                      textAlign: "center",
                      color: "rgba(15,23,42,0.6)",
                    }}
                  >
                    No allocations defined yet.
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