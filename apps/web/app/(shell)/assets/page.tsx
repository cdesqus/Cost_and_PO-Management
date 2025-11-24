import styles from "../../page.module.css";

export default function AssetsPage() {
  return (
    <>
      <header className={styles.dashboardHeader}>
        <h1>Asset Registry</h1>
        <p>
          Table view of IT assets including hardware, software licenses, and
          service contracts.
        </p>
      </header>
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3>Asset Register</h3>
          <span className={styles.badge}>Sample layout</span>
        </div>
        <p style={{ fontSize: 12, color: "rgba(15,23,42,0.7)" }}>
          An interactive asset table with filters, owners, and lifecycle status
          will be implemented here.
        </p>
      </div>
    </>
  );
}