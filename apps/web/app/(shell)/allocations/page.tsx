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

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3>New Allocation</h3>
          <span className={styles.badge}>Create</span>
        </div>
        <form
          onSubmit={handleCreate}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr)) auto",
            gap: 8,
            alignItems: "flex-end",
            fontSize: 12,
          }}
        >
          <label>
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
              style={{
                width: "100%",
                marginTop: 4,
                padding: "6px 8px",
                fontSize: 12,
              }}
            />
          </label>
          <label>
            Cost Group
            <input
              type="text"
              value={form.costGroup}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, costGroup: e.target.value }))
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
            CAPEX Ceiling (USD)
            <input
              type="number"
              min="0"
              value={form.capexCeiling}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, capexCeiling: e.target.value }))
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
            OPEX Ceiling (USD)
            <input
              type="number"
              min="0"
              value={form.opexCeiling}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, opexCeiling: e.target.value }))
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
          <h3>Cost Group Allocations</h3>
          <span className={styles.badge}>Read &amp; Update</span>
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
                <th style={{ textAlign: "left", padding: "8px 4px" }}>Year</th>
                <th style={{ textAlign: "left", padding: "8px 4px" }}>
                  Cost Group
                </th>
                <th style={{ textAlign: "right", padding: "8px 4px" }}>
                  CAPEX Ceiling (USD)
                </th>
                <th style={{ textAlign: "right", padding: "8px 4px" }}>
                  OPEX Ceiling (USD)
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td style={{ padding: "6px 4px" }}>{row.year}</td>
                  <td style={{ padding: "6px 4px" }}>{row.costGroup}</td>
                  <td style={{ padding: "6px 4px", textAlign: "right" }}>
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
                      style={{
                        width: "100%",
                        padding: "4px 6px",
                        fontSize: 12,
                        textAlign: "right",
                      }}
                    />
                  </td>
                  <td style={{ padding: "6px 4px", textAlign: "right" }}>
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
                      style={{
                        width: "100%",
                        padding: "4px 6px",
                        fontSize: 12,
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