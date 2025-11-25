"use client";

import { useMemo, useState } from "react";
import styles from "../../page.module.css";

type AssetType = "LICENSE" | "MANAGED_SERVICE" | "OTHER";
type AssetStatus = "ACTIVE" | "DEPRECATED" | "EXPIRED";

type AssetRow = {
  id: string;
  name: string;
  type: AssetType;
  vendorName: string;
  ownerName: string;
  status: AssetStatus;
  costGroupName: string;
  nextRenewalDate: string | null;
};

type FormMode = "create" | "edit";

const initialAssets: AssetRow[] = [
  {
    id: "a1",
    name: "CRM Enterprise Licenses",
    type: "LICENSE",
    vendorName: "CloudCRM Inc.",
    ownerName: "Head of Sales",
    status: "ACTIVE",
    costGroupName: "Digitalization",
    nextRenewalDate: "2025-03-15",
  },
  {
    id: "a2",
    name: "Data Center Managed Service",
    type: "MANAGED_SERVICE",
    vendorName: "InfraCorp",
    ownerName: "Infrastructure Lead",
    status: "ACTIVE",
    costGroupName: "Infrastructure",
    nextRenewalDate: "2025-02-01",
  },
];

export default function AssetsPage() {
  const [assets, setAssets] = useState<AssetRow[]>(initialAssets);
  const [mode, setMode] = useState<FormMode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "LICENSE" as AssetType,
    vendorName: "",
    ownerName: "",
    status: "ACTIVE" as AssetStatus,
    costGroupName: "",
    nextRenewalDate: "",
  });

  const sortedAssets = useMemo(
    () =>
      [...assets].sort((a, b) => {
        if (!a.nextRenewalDate && !b.nextRenewalDate) return 0;
        if (!a.nextRenewalDate) return 1;
        if (!b.nextRenewalDate) return -1;
        return a.nextRenewalDate < b.nextRenewalDate ? -1 : 1;
      }),
    [assets],
  );

  const openCreate = () => {
    setMode("create");
    setEditingId(null);
    setForm({
      name: "",
      type: "LICENSE",
      vendorName: "",
      ownerName: "",
      status: "ACTIVE",
      costGroupName: "",
      nextRenewalDate: "",
    });
    setShowForm(true);
  };

  const openEdit = (asset: AssetRow) => {
    setMode("edit");
    setEditingId(asset.id);
    setForm({
      name: asset.name,
      type: asset.type,
      vendorName: asset.vendorName,
      ownerName: asset.ownerName,
      status: asset.status,
      costGroupName: asset.costGroupName,
      nextRenewalDate: asset.nextRenewalDate ?? "",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name || !form.vendorName || !form.ownerName || !form.costGroupName) {
      return;
    }

    const normalizedNextRenewal = form.nextRenewalDate || null;

    if (mode === "create") {
      const newAsset: AssetRow = {
        id: `asset-${Date.now()}`,
        name: form.name,
        type: form.type,
        vendorName: form.vendorName,
        ownerName: form.ownerName,
        status: form.status,
        costGroupName: form.costGroupName,
        nextRenewalDate: normalizedNextRenewal,
      };
      setAssets((prev) => [newAsset, ...prev]);
    } else if (editingId) {
      setAssets((prev) =>
        prev.map((a) =>
          a.id === editingId
            ? {
                ...a,
                name: form.name,
                type: form.type,
                vendorName: form.vendorName,
                ownerName: form.ownerName,
                status: form.status,
                costGroupName: form.costGroupName,
                nextRenewalDate: normalizedNextRenewal,
              }
            : a,
        ),
      );
    }

    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <>
      <header className={styles.dashboardHeader}>
        <h1>Asset Registry</h1>
        <p>
          Maintain a register of IT assets including licenses and managed services.
          This view uses local demo data only.
        </p>
      </header>
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3>Asset Register</h3>
          <button
            type="button"
            onClick={openCreate}
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
            + New Asset
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
          >
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "8px 4px" }}>Name</th>
                <th style={{ textAlign: "left", padding: "8px 4px" }}>Type</th>
                <th style={{ textAlign: "left", padding: "8px 4px" }}>Vendor</th>
                <th style={{ textAlign: "left", padding: "8px 4px" }}>Owner</th>
                <th style={{ textAlign: "left", padding: "8px 4px" }}>Status</th>
                <th style={{ textAlign: "left", padding: "8px 4px" }}>
                  Cost Group
                </th>
                <th style={{ textAlign: "left", padding: "8px 4px" }}>
                  Next Renewal
                </th>
                <th style={{ textAlign: "right", padding: "8px 4px" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedAssets.map((asset) => (
                <tr key={asset.id}>
                  <td style={{ padding: "6px 4px" }}>{asset.name}</td>
                  <td style={{ padding: "6px 4px" }}>{asset.type}</td>
                  <td style={{ padding: "6px 4px" }}>{asset.vendorName}</td>
                  <td style={{ padding: "6px 4px" }}>{asset.ownerName}</td>
                  <td style={{ padding: "6px 4px" }}>{asset.status}</td>
                  <td style={{ padding: "6px 4px" }}>{asset.costGroupName}</td>
                  <td style={{ padding: "6px 4px" }}>
                    {asset.nextRenewalDate ?? "-"}
                  </td>
                  <td style={{ padding: "6px 4px", textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() => openEdit(asset)}
                      style={{
                        borderRadius: 999,
                        border: "none",
                        padding: "4px 8px",
                        fontSize: 11,
                        cursor: "pointer",
                        marginRight: 4,
                        background: "#e5e7eb",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(asset.id)}
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
              ))}
              {sortedAssets.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: "12px 4px",
                      textAlign: "center",
                      color: "rgba(15,23,42,0.6)",
                    }}
                  >
                    No assets yet. Use “New Asset” to create one.
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
                {mode === "create" ? "New Asset" : "Edit Asset"}
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
                Name
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
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
                Type
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      type: e.target.value as AssetType,
                    }))
                  }
                  style={{
                    width: "100%",
                    marginTop: 4,
                    padding: "6px 8px",
                    fontSize: 12,
                  }}
                >
                  <option value="LICENSE">LICENSE</option>
                  <option value="MANAGED_SERVICE">MANAGED_SERVICE</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </label>
              <label style={{ fontSize: 12 }}>
                Vendor
                <input
                  type="text"
                  value={form.vendorName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, vendorName: e.target.value }))
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
                Owner
                <input
                  type="text"
                  value={form.ownerName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, ownerName: e.target.value }))
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
                      status: e.target.value as AssetStatus,
                    }))
                  }
                  style={{
                    width: "100%",
                    marginTop: 4,
                    padding: "6px 8px",
                    fontSize: 12,
                  }}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="DEPRECATED">DEPRECATED</option>
                  <option value="EXPIRED">EXPIRED</option>
                </select>
              </label>
              <label style={{ fontSize: 12 }}>
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
              <label style={{ fontSize: 12 }}>
                Next Renewal Date
                <input
                  type="date"
                  value={form.nextRenewalDate}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      nextRenewalDate: e.target.value,
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