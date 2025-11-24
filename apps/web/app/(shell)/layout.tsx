"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "../page.module.css";

type NavItem = {
  href: string;
  label: string;
  icon: string;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    title: "Dashboard & Overview",
    items: [{ href: "/dashboard", label: "Main Dashboard", icon: "📊" }],
  },
  {
    title: "Budget Management",
    items: [
      { href: "/transactions", label: "Expense Transactions", icon: "💸" },
      { href: "/allocations", label: "Allocation & Ceilings", icon: "📐" },
    ],
  },
  {
    title: "Procurement & PO",
    items: [
      { href: "/po/create", label: "Create Purchase Order", icon: "➕" },
      { href: "/po/approvals", label: "Approval Center", icon: "✅" },
      { href: "/po/tracking", label: "PO Tracking", icon: "📑" },
    ],
  },
  {
    title: "Asset Management",
    items: [
      { href: "/assets", label: "Asset Registry", icon: "💻" },
      {
        href: "/service-commitments",
        label: "Service Commitments",
        icon: "📡",
      },
      { href: "/assets/renewals", label: "Renewal Tracker", icon: "⏰" },
    ],
  },
  {
    title: "System Admin",
    items: [
      { href: "/admin/users", label: "User Management", icon: "👤" },
    ],
  },
];

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.page}>
      <header className={styles.appHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.brandLogo}>IT</div>
          <div>
            <div className={styles.headerTitle}>IT Spend Hub</div>
            <div className={styles.headerSubtitle}>
              IT Cost Monitoring &amp; Procurement
            </div>
          </div>
        </div>

        <div className={styles.headerCenter}>
          <div className={styles.headerPill}>
            <span>PO Approvals</span>
            <span className={styles.headerBadge}>3</span>
          </div>
          <div className={styles.headerPill}>
            <span>Renewal Alerts</span>
            <span className={styles.headerBadge}>5</span>
          </div>
        </div>

        <div className={styles.headerRight}>
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 16,
            }}
            aria-label="Toggle sidebar"
          >
            {collapsed ? "⫸" : "⫷"}
          </button>
          <div className={styles.avatar}>IM</div>
          <div className={styles.headerUser}>
            <span>IT Manager</span>
            <span>it.manager@example.com</span>
          </div>
        </div>
      </header>

      <div className={styles.appShell}>
        <aside
          className={`${styles.sidebar} ${
            collapsed ? styles.sidebarCollapsed : ""
          }`}
        >
          <div className={styles.brand}>
            <div className={styles.brandLogo}>IT</div>
            <div className={styles.brandText}>
              <span className={styles.brandName}>IT Spend Hub</span>
              <span className={styles.brandTagline}>
                CAPEX, OPEX &amp; procurement in one place
              </span>
            </div>
          </div>

          {navGroups.map((group) => (
            <div key={group.title} className={styles.navGroup}>
              <div className={styles.navGroupTitle}>{group.title}</div>
              <ul className={styles.navList}>
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" &&
                      pathname.startsWith(item.href));

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`${styles.navItemButton} ${
                          isActive ? styles.navItemActive : ""
                        }`}
                      >
                        <span className={styles.navItemIcon}>{item.icon}</span>
                        <span className={styles.navItemLabel}>
                          {item.label}
                        </span>
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
          ))}

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