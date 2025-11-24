import styles from "../../../page.module.css";

export default function CreatePoPage() {
  return (
    <>
      <header className={styles.dashboardHeader}>
        <h1>Create Purchase Order</h1>
        <p>
          Initiate a new PO request, link it to cost groups, and route it for
          approval.
        </p>
      </header>
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3>PO Request Form</h3>
          <span className={styles.badge}>Sample layout</span>
        </div>
        <p style={{ fontSize: 12, color: "rgba(15,23,42,0.7)" }}>
          A structured form for vendor, cost group, line items, and approval
          routing will be implemented here.
        </p>
      </div>
    </>
  );
}