import styles from "../../../page.module.css";

export default function UserManagementPage() {
  return (
    <>
      <header className={styles.dashboardHeader}>
        <h1>User Management</h1>
        <p>
          Configure user accounts, roles, and access control for the IT Cost
          Monitoring System.
        </p>
      </header>
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3>Users &amp; Roles</h3>
          <span className={styles.badge}>Sample layout</span>
        </div>
        <p style={{ fontSize: 12, color: "rgba(15,23,42,0.7)" }}>
          A table of users, their roles, and actions to update access will be
          implemented here in a future phase.
        </p>
      </div>
    </>
  );
}