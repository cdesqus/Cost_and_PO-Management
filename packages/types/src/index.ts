export type CostType = "CAPEX" | "OPEX";

export type CostGroupName =
  | "System Development"
  | "Infrastructure"
  | "Digitalization"
  | "Other/General IT";

export type TransactionStatus = "BUDGETED" | "COMMITTED" | "PAID";

export type AssetStatus = "ACTIVE" | "DEPRECATED" | "EXPIRED";

export type PurchaseOrderStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "REVISED"
  | "CANCELLED";

export type VendorDocumentType =
  | "INVOICE"
  | "UAT_SIGNOFF"
  | "BAST"
  | "RECEIVING_REPORT";

export type RoleName =
  | "ADMIN"
  | "BUDGET_OWNER"
  | "APPROVER"
  | "VIEWER"
  | "VENDOR";

export interface BudgetSummary {
  year: number;
  totalCapexAllocated: number;
  totalCapexUsed: number;
  totalOpexAllocated: number;
  totalOpexUsed: number;
  capexUtilizationPercent: number;
  opexUtilizationPercent: number;
  monthlyBurn: Array<{
    month: number;
    capexUsed: number;
    opexUsed: number;
  }>;
}

export interface PurchaseOrderLineItemInput {
  description: string;
  quantity: number;
  unitPriceLocal: number;
}

export interface CreatePurchaseOrderInput {
  vendorId: string;
  costGroupId: string;
  costType: CostType;
  currencyLocal: string;
  fxRateToUsd: number;
  lineItems: PurchaseOrderLineItemInput[];
}

export interface UpcomingRenewalItem {
  id: string;
  assetName: string;
  renewalDate: string;
  costEstimateLocal?: number;
  currencyLocal?: string;
}

export interface DashboardOverview {
  budgetSummary: BudgetSummary;
  upcomingRenewals: UpcomingRenewalItem[];
}