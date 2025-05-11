
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApplicationsList from "./ApplicationsList";
import DashboardStats from "./DashboardStats";
import DashboardCharts from "./DashboardCharts";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full px-4 py-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Loan Management Dashboard</h1>
      
      <div className="mb-6">
        <DashboardStats />
      </div>
      
      <div className="mb-6">
        <DashboardCharts />
      </div>
      
      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="applications" className="mt-4">
          <ApplicationsList />
        </TabsContent>
        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Dashboard settings will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
