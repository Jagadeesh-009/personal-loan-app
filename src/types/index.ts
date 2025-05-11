
export interface LoanApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  loanAmount: number;
  purpose: string;
  employmentStatus: string;
  annualIncome: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  averageLoanAmount: number;
  totalLoanAmount: number;
  approvalRate: number;
}
