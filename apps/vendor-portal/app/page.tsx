import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Vendor Portal</h1>
        <p>
          View purchase orders issued to your organization and upload fulfillment
          documents such as invoices, UAT sign-offs, and BAST.
        </p>

        <ol>
          <li>Sign in with your vendor account credentials.</li>
          <li>Open a purchase order to review details and status.</li>
          <li>Attach the required documents for processing and payment.</li>
        </ol>

        <div className={styles.ctas}>
          <a className="primary" href="#">
            View purchase orders
          </a>
          <a className="secondary" href="#">
            Upload documents
          </a>
        </div>
      </main>
    </div>
  );
}