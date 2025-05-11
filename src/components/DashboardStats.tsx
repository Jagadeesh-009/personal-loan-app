
import React from "react";
import { useApplications } from "../contexts/ApplicationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleCheck, CircleMinus, FileText, PieChart } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const DashboardStats: React.FC = () => {
  const { stats } = useApplications();
  const isMobile = useIsMobile();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{stats.totalApplications}</div>
          <p className="text-xs text-muted-foreground">
            {stats.pendingApplications} pending review
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Loan</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">
            ${stats.averageLoanAmount.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total: ${stats.totalLoanAmount.toFixed(2)}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
          <CircleCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">
            {stats.approvalRate.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.approvedApplications} approved applications
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          <CircleMinus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{stats.rejectedApplications}</div>
          <p className="text-xs text-muted-foreground">
            {stats.rejectedApplications > 0 
              ? ((stats.rejectedApplications / stats.totalApplications) * 100).toFixed(1) 
              : '0'}% rejection rate
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
