import styles from "../../../page.module.css";

export default function AssetRenewalsPage() {
  return (
    <>
      <header className={styles.dashboardHeader}>
        <h1>Renewal Tracker</h1>
        <p>
          Focused view of assets and licenses due for renewal in the upcoming
          period.
        </p>
      </header>
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3>Upcoming Renewals</h3>
          <span className={styles.badge}>Sample layout</span>
        </div>
        <p style={{ fontSize: 12, color: "rgba(15,23,42,0.7)" }}>
          This page will show a prioritized list of renewals, with impact and
          owner details.
        </p>
      </div>
    </>
  );
}