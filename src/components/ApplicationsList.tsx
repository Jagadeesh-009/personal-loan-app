
import React from "react";
import { useApplications } from "../contexts/ApplicationContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Check, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const ApplicationsList: React.FC = () => {
  const { applications, updateApplicationStatus } = useApplications();
  const isMobile = useIsMobile();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), isMobile ? "MMM d" : "MMM d, yyyy");
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        {applications.length === 0 ? (
          <div className="text-center py-4 border rounded-md">
            No applications submitted yet.
          </div>
        ) : (
          applications.map((app) => (
            <div key={app.id} className="border rounded-md p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium">{app.fullName}</div>
                {getStatusBadge(app.status)}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div>Amount: ${app.loanAmount.toLocaleString()}</div>
                <div className="capitalize">Purpose: {app.purpose}</div>
                <div>Date: {formatDate(app.createdAt)}</div>
              </div>
              {app.status === "pending" && (
                <div className="flex space-x-2 mt-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-500/20"
                    onClick={() => updateApplicationStatus(app.id, "approved")}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-red-500/20"
                    onClick={() => updateApplicationStatus(app.id, "rejected")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Purpose</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No applications submitted yet.
              </TableCell>
            </TableRow>
          ) : (
            applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="font-medium">{app.fullName}</TableCell>
                <TableCell>${app.loanAmount.toLocaleString()}</TableCell>
                <TableCell className="capitalize">{app.purpose}</TableCell>
                <TableCell>{formatDate(app.createdAt)}</TableCell>
                <TableCell>{getStatusBadge(app.status)}</TableCell>
                <TableCell>
                  {app.status === "pending" && (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-500/20"
                        onClick={() => updateApplicationStatus(app.id, "approved")}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-500/20"
                        onClick={() => updateApplicationStatus(app.id, "rejected")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicationsList;
