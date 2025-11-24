import styles from "../../page.module.css";

export default function AllocationsPage() {
  return (
    <>
      <header className={styles.dashboardHeader}>
        <h1>Allocation &amp; Ceilings</h1>
        <p>
          Configure and monitor budget limits per Cost Group across CAPEX and
          OPEX.
        </p>
      </header>
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3>Cost Group Allocations</h3>
          <span className={styles.badge}>Sample layout</span>
        </div>
        <p style={{ fontSize: 12, color: "rgba(15,23,42,0.7)" }}>
          This view will show budget ceilings and utilization per Cost Group,
          with inline editing for configuration in a future phase.
        </p>
      </div>
    </>
  );
}