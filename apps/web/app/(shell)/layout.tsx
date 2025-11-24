"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../page.module.css";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/transactions", label: "Transactions", icon: "💸" },
  { href: "/assets", label: "Assets", icon: "💻" },
  { href: "/purchase-orders", label: "Purchase Orders", icon: "📑" },
  { href: "/admin", label: "Admin", icon: "⚙️" },
];

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className={styles.page}>
      <div className={styles.appShell}>
        <aside className={styles.sidebar}>
          <div className={styles.brand}>
            <div className={styles.brandLogo}>IT</div>
            <div className={styles.brandText}>
              <span className={styles.brandName}>IT Spend Hub</span>
              <span className={styles.brandTagline}>
                CAPEX, OPEX &amp; procurement in one place
              </span>
            </div>
          </div>

          <div>
            <div className={styles.navSectionLabel}>Main</div>
            <ul className={styles.navList}>
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`${styles.navItemButton} ${
                        isActive ? styles.navItemActive : ""
                      }`}
                    >
                      <span className={styles.navItemIcon}>{item.icon}</span>
                      <span className={styles.navItemLabel}>{item.label}</span>
                      {item.href === "/dashboard" ? (
                        <span className={styles.navItemPill}>
                          FY {new Date().getFullYear()}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={styles.navFooter}>
            <span>Signed in as IT Manager</span>
            <span>Last refreshed just now</span>
          </div>
        </aside>

        <main className={styles.main}>{children}</main>
      </div>
      <footer className={styles.footer}>
        <span>Designed for IT budget owners, approvers, and procurement.</span>
      </footer>
    </div>
  );
}