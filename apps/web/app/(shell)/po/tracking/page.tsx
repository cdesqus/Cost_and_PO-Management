import styles from "../../../page.module.css";

export default function PoTrackingPage() {
  return (
    <>
      <header className={styles.dashboardHeader}>
        <h1>PO Tracking</h1>
        <p>
          Track Purchase Orders, their current status, and approval audit trail.
        </p>
      </header>
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3>All Purchase Orders</h3>
          <span className={styles.badge}>Sample layout</span>
        </div>
        <p style={{ fontSize: 12, color: "rgba(15,23,42,0.7)" }}>
          This view will list POs with links to detailed audit history and
          related transactions.
        </p>
      </div>
    </>
  );
}