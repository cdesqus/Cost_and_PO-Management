"use client";

import { useState } from "react";
import styles from "../../../page.module.css";

type CostType = "CAPEX" | "OPEX";

type DraftLineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPriceUsd: number;
};

type DraftPo = {
  id: string;
  vendorName: string;
  costGroupName: string;
  costType: CostType;
  currency: string;
  lineItems: DraftLineItem[];
};

const initialDrafts: DraftPo[] = [];

export default function CreatePoPage() {
  const [drafts, setDrafts] = useState<DraftPo[]>(initialDrafts);
  const [vendorName, setVendorName] = useState("");
  const [costGroupName, setCostGroupName] = useState("");
  const [costType, setCostType] = useState<CostType>("OPEX");
  const [currency, setCurrency] = useState("USD");
  const [lineItems, setLineItems] = useState<DraftLineItem[]>([
    { id: "li-1", description: "", quantity: 1, unitPriceUsd: 0 },
  ]);

  const resetForm = () => {
    setVendorName("");
    setCostGroupName("");
    setCostType("OPEX");
    setCurrency("USD");
    setLineItems([{ id: `li-${Date.now()}`, description: "", quantity: 1, unitPriceUsd: 0 }]);
  };

  const handleAddLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      {
        id: `li-${Date.now()}`,
        description: "",
        quantity: 1,
        unitPriceUsd: 0,
      },
    ]);
  };

  const handleLineChange = (
    id: string,
    field: "description" | "quantity" | "unitPriceUsd",
    value: string,
  ) => {
    setLineItems((prev) =>
      prev.map((li) =>
        li.id === id
          ? {
              ...li,
              [field]:
                field === "description" ? value : Number(value) || 0,
            }
          : li,
      ),
    );
  };

  const handleRemoveLineItem = (id: string) => {
    setLineItems((prev) => prev.filter((li) => li.id !== id));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!vendorName || !costGroupName || lineItems.length === 0) {
      return;
    }
    const cleaned = lineItems.filter(
      (li) => li.description && li.quantity > 0 && li.unitPriceUsd >= 0,
    );
    if (cleaned.length === 0) {
      return;
    }

    const draft: DraftPo = {
      id: `draft-${Date.now()}`,
      vendorName,
      costGroupName,
      costType,
      currency,
      lineItems: cleaned,
    };

    setDrafts((prev) => [draft, ...prev]);
    resetForm();
  };

  const handleDeleteDraft = (id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <>
      <header className={styles.dashboardHeader}>
        <h1>Create Purchase Order</h1>
        <p>
          Initiate a new PO request with vendor, cost group, and line items.
          This page uses local demo data only.
        </p>
      </header>

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3>PO Request Form</h3>
          <span className={styles.badge}>Demo</span>
        </div>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 12 }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 8,
            }}
          >
            <label>
              Vendor
              <input
                type="text"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
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
                value={costGroupName}
                onChange={(e) => setCostGroupName(e.target.value)}
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
              Cost Type
              <select
                value={costType}
                onChange={(e) => setCostType(e.target.value as CostType)}
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
          </div>

          <label>
            Currency
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{
                width: "100%",
                marginTop: 4,
                padding: "6px 8px",
                fontSize: 12,
                maxWidth: 140,
              }}
            >
              <option value="USD">USD</option>
              <option value="IDR">IDR</option>
              <option value="EUR">EUR</option>
            </select>
          </label>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 500 }}>Line Items</span>
              <button
                type="button"
                onClick={handleAddLineItem}
                style={{
                  borderRadius: 999,
                  border: "none",
                  padding: "4px 10px",
                  fontSize: 11,
                  cursor: "pointer",
                  background: "#e5e7eb",
                }}
              >
                + Add line
              </button>
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
                    <th style={{ textAlign: "left", padding: "6px 4px" }}>
                      Description
                    </th>
                    <th style={{ textAlign: "right", padding: "6px 4px" }}>
                      Qty
                    </th>
                    <th style={{ textAlign: "right", padding: "6px 4px" }}>
                      Unit Price (USD)
                    </th>
                    <th style={{ textAlign: "right", padding: "6px 4px" }}>
                      Total
                    </th>
                    <th style={{ textAlign: "right", padding: "6px 4px" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((li) => {
                    const total = li.quantity * li.unitPriceUsd;
                    return (
                      <tr key={li.id}>
                        <td style={{ padding: "4px 4px" }}>
                          <input
                            type="text"
                            value={li.description}
                            onChange={(e) =>
                              handleLineChange(li.id, "description", e.target.value)
                            }
                            style={{
                              width: "100%",
                              padding: "4px 6px",
                              fontSize: 12,
                            }}
                          />
                        </td>
                        <td style={{ padding: "4px 4px", textAlign: "right" }}>
                          <input
                            type="number"
                            min="1"
                            value={li.quantity}
                            onChange={(e) =>
                              handleLineChange(li.id, "quantity", e.target.value)
                            }
                            style={{
                              width: 70,
                              padding: "4px 6px",
                              fontSize: 12,
                              textAlign: "right",
                            }}
                          />
                        </td>
                        <td style={{ padding: "4px 4px", textAlign: "right" }}>
                          <input
                            type="number"
                            min="0"
                            value={li.unitPriceUsd}
                            onChange={(e) =>
                              handleLineChange(li.id, "unitPriceUsd", e.target.value)
                            }
                            style={{
                              width: 100,
                              padding: "4px 6px",
                              fontSize: 12,
                              textAlign: "right",
                            }}
                          />
                        </td>
                        <td style={{ padding: "4px 4px", textAlign: "right" }}>
                          $
                          {total.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td style={{ padding: "4px 4px", textAlign: "right" }}>
                          <button
                            type="button"
                            onClick={() => handleRemoveLineItem(li.id)}
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
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {lineItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        style={{
                          padding: "8px 4px",
                          textAlign: "center",
                          color: "rgba(15,23,42,0.6)",
                        }}
                      >
                        No line items. Use “Add line” to create one.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 4,
            }}
          >
            <button
              type="button"
              onClick={resetForm}
              style={{
                borderRadius: 999,
                border: "none",
                padding: "6px 12px",
                fontSize: 12,
                cursor: "pointer",
                background: "#e5e7eb",
              }}
            >
              Reset
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
              Save Draft
            </button>
          </div>
        </form>
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3>Draft POs (local)</h3>
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
                  Vendor
                </th>
                <th style={{ textAlign: "left", padding: "8px 4px" }}>
                  Cost Group
                </th>
                <th style={{ textAlign: "left", padding: "8px 4px" }}>
                  Cost Type
                </th>
                <th style={{ textAlign: "left", padding: "8px 4px" }}>
                  Currency
                </th>
                <th style={{ textAlign: "right", padding: "8px 4px" }}>
                  Lines
                </th>
                <th style={{ textAlign: "right", padding: "8px 4px" }}>
                  Est. Total (USD)
                </th>
                <th style={{ textAlign: "right", padding: "8px 4px" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {drafts.map((d) => {
                const total = d.lineItems.reduce(
                  (acc, li) => acc + li.quantity * li.unitPriceUsd,
                  0,
                );
                return (
                  <tr key={d.id}>
                    <td style={{ padding: "6px 4px" }}>{d.vendorName}</td>
                    <td style={{ padding: "6px 4px" }}>{d.costGroupName}</td>
                    <td style={{ padding: "6px 4px" }}>{d.costType}</td>
                    <td style={{ padding: "6px 4px" }}>{d.currency}</td>
                    <td style={{ padding: "6px 4px", textAlign: "right" }}>
                      {d.lineItems.length}
                    </td>
                    <td style={{ padding: "6px 4px", textAlign: "right" }}>
                      $
                      {total.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td style={{ padding: "6px 4px", textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={() => handleDeleteDraft(d.id)}
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
                );
              })}
              {drafts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: "12px 4px",
                      textAlign: "center",
                      color: "rgba(15,23,42,0.6)",
                    }}
                  >
                    No draft POs yet. Use the form above to create one.
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