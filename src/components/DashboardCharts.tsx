import React from "react";
import { useApplications } from "../contexts/ApplicationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PieChart, Pie, LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

// Utility function to generate harmonious random colors
function getRandomColor() {
  const hue = Math.floor(Math.random() * 360); 
  const saturation = 70 + Math.random() * 20; 
  const lightness = 50 + Math.random() * 10; 
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

const DashboardCharts: React.FC = () => {
  const { applications, stats } = useApplications();
  const isMobile = useIsMobile();

  // Data for pie chart
  const statusData = [
    { name: "Pending", value: stats?.pendingApplications || 0 },
    { name: "Approved", value: stats?.approvedApplications || 0 },
    { name: "Rejected", value: stats?.rejectedApplications || 0 },
  ];

  // Group applications by date for line chart
  const getLastNDays = (n: number) => {
    const result = [];
    for (let i = n - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      result.push({
        date: format(date, "MMM dd"),
        timestamp: date.getTime(),
        count: 0,
        amount: 0,
      });
    }
    return result;
  };

  const last7Days = getLastNDays(7);

  // Populate with actual data
  applications.forEach(app => {
    if (app.createdAt && app.loanAmount) {
      const appDate = new Date(app.createdAt);
      const formattedDate = format(appDate, "MMM dd");

      const matchingDay = last7Days.find(day => day.date === formattedDate);
      if (matchingDay) {
        matchingDay.count += 1;
        matchingDay.amount += app.loanAmount;
      }
    }
  });

  // Data for purpose distribution (bar chart)
  const purposeMap: Record<string, number> = {};
  applications.forEach(app => {
    if (app.purpose) {
      purposeMap[app.purpose] = (purposeMap[app.purpose] || 0) + 1;
    }
  });

  const purposeData = Object.entries(purposeMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="w-full">
      <h2 className="text-lg sm:text-xl font-bold mb-4">Analytics</h2>
      <Tabs defaultValue="pie" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="pie">Status</TabsTrigger>
          <TabsTrigger value="line">Trend</TabsTrigger>
          <TabsTrigger value="bar">Purpose</TabsTrigger>
        </TabsList>

        {/* Pie Chart */}
        <TabsContent value="pie" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm sm:text-md md:text-lg">Application Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full flex items-center justify-center">
                {statusData && statusData.some(data => data.value > 0) ? (
                  <ChartContainer config={{}}>
                    <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={isMobile ? 70 : 100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getRandomColor()} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend verticalAlign="bottom" align="center" layout="horizontal" wrapperStyle={{ paddingTop: '10px' }} />
                    </PieChart>
                  </ChartContainer>
                ) : (
                  <p className="text-center text-gray-500">No data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Line Chart */}
        <TabsContent value="line" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm sm:text-md md:text-lg">Application Trend (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ChartContainer config={{}}>
                  <LineChart 
                    data={last7Days} 
                    margin={{ 
                      top: 10, 
                      right: isMobile ? 10 : 30, 
                      bottom: 30, 
                      left: isMobile ? 5 : 20 
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: isMobile ? 9 : 12 }}
                      tickMargin={8}
                      height={40}
                    />
                    <YAxis 
                      yAxisId="left" 
                      tick={{ fontSize: isMobile ? 9 : 12 }}
                      tickMargin={8}
                      width={isMobile ? 30 : 40}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      tick={{ fontSize: isMobile ? 9 : 12 }}
                      tickMargin={8}
                      width={isMobile ? 30 : 40}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend 
                      wrapperStyle={{ fontSize: isMobile ? 10 : 12, paddingTop: '10px' }}
                      verticalAlign="bottom"
                      height={36}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="count"
                      name="Applications"
                      stroke={getRandomColor()}
                      activeDot={{ r: isMobile ? 5 : 8 }}
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="amount"
                      name="Loan Amount"
                      stroke={getRandomColor()}
                      activeDot={{ r: isMobile ? 5 : 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bar Chart */}
        <TabsContent value="bar" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm sm:text-md md:text-lg">Loan Purpose</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ChartContainer config={{}}>
                  <BarChart 
                    data={purposeData} 
                    margin={{ 
                      top: 10, 
                      right: isMobile ? 10 : 20, 
                      bottom: 30, 
                      left: isMobile ? 5 : 20 
                    }}
                    barCategoryGap={isMobile ? "15%" : "30%"}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: isMobile ? 9 : 12 }}
                      tickMargin={8}
                      height={60}
                      interval={0}
                      angle={isMobile ? -45 : 0}
                      textAnchor={isMobile ? "end" : "middle"}
                    />
                    <YAxis 
                      tick={{ fontSize: isMobile ? 9 : 12 }}
                      tickMargin={8}
                      width={isMobile ? 30 : 40}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend 
                      wrapperStyle={{ fontSize: isMobile ? 10 : 12, paddingTop: '10px' }}
                      verticalAlign="bottom"
                      height={36}
                    />
                    <Bar 
                      dataKey="value" 
                      name="Applications" 
                      fill={getRandomColor()}
                      radius={[4, 4, 0, 0]}
                    >
                      {purposeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getRandomColor()} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardCharts;
