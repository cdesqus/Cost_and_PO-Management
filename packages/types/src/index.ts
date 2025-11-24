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

/**
 * High-level classification of recurring commercial commitments.
 * This covers software licenses, managed services, maintenance, etc.
 */
export type ContractType =
  | "LICENSE"
  | "MANAGED_SERVICE"
  | "MAINTENANCE"
  | "OTHER";

export type BillingFrequency = "MONTHLY" | "QUARTERLY" | "ANNUAL" | "BIENNIAL";

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

/**
 * Lightweight DTO for a recurring contract / service commitment.
 */
export interface ContractSummary {
  id: string;
  type: ContractType;
  name: string;
  vendorName: string;
  costGroupName: string;
  costType: CostType;
  billingFrequency: BillingFrequency;
  baseAmountPerPeriodUsd: number;
  nextBillingDate: string;
  active: boolean;
}

/**
 * Transaction DTO that ties budget hits back to contracts and POs.
 */
export interface TransactionDto {
  id: string;
  date: string;
  costType: CostType;
  costGroupName: string;
  amountUsd: number;
  status: TransactionStatus;
  contractId?: string;
  contractName?: string;
  contractType?: ContractType;
  poId?: string;
  poNumber?: string;
}