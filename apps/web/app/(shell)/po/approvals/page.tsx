import styles from "../../../page.module.css";

export default function PoApprovalsPage() {
  return (
    <>
      <header className={styles.dashboardHeader}>
        <h1>Approval Center</h1>
        <p>
          View and take action on Purchase Orders awaiting your approval.
        </p>
      </header>
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3>Pending Approvals</h3>
          <span className={styles.badge}>Sample layout</span>
        </div>
        <p style={{ fontSize: 12, color: "rgba(15,23,42,0.7)" }}>
          A table of pending POs with approve/reject actions will be displayed
          here in a future phase.
        </p>
      </div>
    </>
  );
}