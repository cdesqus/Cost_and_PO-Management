import { Button } from "@repo/ui/button";
import { calculateUtilizationPercent, formatCurrency } from "@repo/utils/currency";
import styles from "./page.module.css";

type BudgetSummary = {
  year: number;
  totalCapexAllocated: number;
  totalCapexUsed: number;
  totalOpexAllocated: number;
  totalOpexUsed: number;
};

const stubBudgetSummary: BudgetSummary = {
  year: 2025,
  totalCapexAllocated: 1_000_000,
  totalCapexUsed: 420_000,
  totalOpexAllocated: 750_000,
  totalOpexUsed: 310_000,
};

const stubMonthlyBurn = [
  { month: "Jan", capexUsed: 50_000, opexUsed: 35_000 },
  { month: "Feb", capexUsed: 40_000, opexUsed: 28_000 },
  { month: "Mar", capexUsed: 60_000, opexUsed: 32_000 },
  { month: "Apr", capexUsed: 70_000, opexUsed: 30_000 },
];

const stubUpcomingRenewals = [
  {
    id: "1",
    assetName: "Enterprise Firewall Subscription",
    renewalDate: "2026-02-15",
    costEstimateLocal: 15_000,
  },
  {
    id: "2",
    assetName: "SaaS CRM Licenses",
    renewalDate: "2026-03-01",
    costEstimateLocal: 8_500,
  },
  {
    id: "3",
    assetName: "Data Center Maintenance",
    renewalDate: "2026-04-10",
    costEstimateLocal: 22_000,
  },
];

export default function Home() {
  const capexUtilization = calculateUtilizationPercent(
    stubBudgetSummary.totalCapexUsed,
    stubBudgetSummary.totalCapexAllocated,
  );
  const opexUtilization = calculateUtilizationPercent(
    stubBudgetSummary.totalOpexUsed,
    stubBudgetSummary.totalOpexAllocated,
  );

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.dashboardHeader}>
          <h1>IT Cost Monitoring &amp; Procurement</h1>
          <p>
            Real-time view of CAPEX/OPEX budgets, IT assets, and purchase order
            approvals for the IT Division.
          </p>
        </header>

        <section className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <h2>CAPEX Budget</h2>
            <p className={styles.kpiValue}>
              {formatCurrency(
                stubBudgetSummary.totalCapexUsed,
                "USD",
                "en-US",
              )}{" "}
              <span className={styles.kpiSubtext}>used</span>
            </p>
            <p className={styles.kpiMeta}>
              of{" "}
              {formatCurrency(
                stubBudgetSummary.totalCapexAllocated,
                "USD",
                "en-US",
              )}{" "}
              ({capexUtilization}% utilized)
            </p>
          </div>

          <div className={styles.kpiCard}>
            <h2>OPEX Budget</h2>
            <p className={styles.kpiValue}>
              {formatCurrency(
                stubBudgetSummary.totalOpexUsed,
                "USD",
                "en-US",
              )}{" "}
              <span className={styles.kpiSubtext}>used</span>
            </p>
            <p className={styles.kpiMeta}>
              of{" "}
              {formatCurrency(
                stubBudgetSummary.totalOpexAllocated,
                "USD",
                "en-US",
              )}{" "}
              ({opexUtilization}% utilized)
            </p>
          </div>

          <div className={styles.kpiCard}>
            <h2>Upcoming Renewals</h2>
            <p className={styles.kpiValue}>
              {stubUpcomingRenewals.length}
              <span className={styles.kpiSubtext}> assets</span>
            </p>
            <p className={styles.kpiMeta}>
              Within the next 120 days across licenses and maintenance
              contracts.
            </p>
          </div>
        </section>

        <section className={styles.sectionGrid}>
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h3>Monthly Burn (USD)</h3>
              <span className={styles.badge}>Stub data</span>
            </div>
            <div className={styles.burnList}>
              {stubMonthlyBurn.map((item) => (
                <div key={item.month} className={styles.burnRow}>
                  <span className={styles.monthLabel}>{item.month}</span>
                  <div className={styles.burnBars}>
                    <div
                      className={styles.capexBar}
                      style={{ width: `${item.capexUsed / 1_000}%` }}
                    />
                    <div
                      className={styles.opexBar}
                      style={{ width: `${item.opexUsed / 1_000}%` }}
                    />
                  </div>
                  <div className={styles.burnValues}>
                    <span>CAPEX {formatCurrency(item.capexUsed, "USD")}</span>
                    <span>OPEX {formatCurrency(item.opexUsed, "USD")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h3>Upcoming Asset Renewals</h3>
              <span className={styles.badge}>Stub data</span>
            </div>
            <ul className={styles.renewalList}>
              {stubUpcomingRenewals.map((asset) => (
                <li key={asset.id} className={styles.renewalItem}>
                  <div>
                    <p className={styles.assetName}>{asset.assetName}</p>
                    <p className={styles.assetMeta}>
                      Renewal on {asset.renewalDate}
                    </p>
                  </div>
                  {typeof asset.costEstimateLocal === "number" ? (
                    <span className={styles.assetCost}>
                      {formatCurrency(asset.costEstimateLocal, "USD")}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
            <Button appName="web" className={styles.secondaryButton}>
              View full asset register
            </Button>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <span>Designed for IT budget owners, approvers, and procurement.</span>
      </footer>
    </div>
  );
}
