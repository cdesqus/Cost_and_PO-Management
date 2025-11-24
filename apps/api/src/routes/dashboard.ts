import express from "express";
import type { DashboardOverview } from "@repo/types";

const router = express.Router();

const stubDashboardOverview: DashboardOverview = {
  budgetSummary: {
    year: 2025,
    totalCapexAllocated: 1_000_000,
    totalCapexUsed: 420_000,
    totalOpexAllocated: 750_000,
    totalOpexUsed: 310_000,
    capexUtilizationPercent: Math.round((420_000 / 1_000_000) * 100),
    opexUtilizationPercent: Math.round((310_000 / 750_000) * 100),
    monthlyBurn: [
      { month: 1, capexUsed: 50_000, opexUsed: 35_000 },
      { month: 2, capexUsed: 40_000, opexUsed: 28_000 },
      { month: 3, capexUsed: 60_000, opexUsed: 32_000 },
      { month: 4, capexUsed: 70_000, opexUsed: 30_000 },
    ],
  },
  upcomingRenewals: [
    {
      id: "1",
      assetName: "Enterprise Firewall Subscription",
      renewalDate: "2026-02-15",
      costEstimateLocal: 15_000,
      currencyLocal: "USD",
    },
    {
      id: "2",
      assetName: "SaaS CRM Licenses",
      renewalDate: "2026-03-01",
      costEstimateLocal: 8_500,
      currencyLocal: "USD",
    },
    {
      id: "3",
      assetName: "Data Center Maintenance",
      renewalDate: "2026-04-10",
      costEstimateLocal: 22_000,
      currencyLocal: "USD",
    },
  ],
};

router.get("/overview", (_req, res) => {
  res.json(stubDashboardOverview);
});

export default router;