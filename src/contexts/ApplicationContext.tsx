
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LoanApplication, DashboardStats } from '../types';

interface ApplicationContextType {
  applications: LoanApplication[];
  stats: DashboardStats;
  submitApplication: (application: Omit<LoanApplication, 'id' | 'createdAt' | 'status'>) => Promise<LoanApplication>;
  updateApplicationStatus: (id: string, status: 'approved' | 'rejected') => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    averageLoanAmount: 0,
    totalLoanAmount: 0,
    approvalRate: 0
  });

  // Load applications from localStorage on mount
  useEffect(() => {
    const savedApplications = localStorage.getItem('loanApplications');
    if (savedApplications) {
      setApplications(JSON.parse(savedApplications));
    }
  }, []);

  // Update localStorage when applications change
  useEffect(() => {
    localStorage.setItem('loanApplications', JSON.stringify(applications));
    calculateStats();
  }, [applications]);

  // Calculate dashboard statistics
  const calculateStats = () => {
    if (applications.length === 0) {
      setStats({
        totalApplications: 0,
        pendingApplications: 0,
        approvedApplications: 0,
        rejectedApplications: 0,
        averageLoanAmount: 0,
        totalLoanAmount: 0,
        approvalRate: 0
      });
      return;
    }

    const pending = applications.filter(app => app.status === 'pending').length;
    const approved = applications.filter(app => app.status === 'approved').length;
    const rejected = applications.filter(app => app.status === 'rejected').length;
    const totalAmount = applications.reduce((sum, app) => sum + app.loanAmount, 0);
    
    setStats({
      totalApplications: applications.length,
      pendingApplications: pending,
      approvedApplications: approved,
      rejectedApplications: rejected,
      averageLoanAmount: totalAmount / applications.length,
      totalLoanAmount: totalAmount,
      approvalRate: applications.length > 0 ? (approved / applications.length) * 100 : 0
    });
  };

  // Simulate API call for submitting application
  const submitApplication = async (applicationData: Omit<LoanApplication, 'id' | 'createdAt' | 'status'>): Promise<LoanApplication> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newApplication: LoanApplication = {
      ...applicationData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    setApplications(prev => [...prev, newApplication]);
    return newApplication;
  };

  // Update application status
  const updateApplicationStatus = (id: string, status: 'approved' | 'rejected') => {
    setApplications(prev => 
      prev.map(app => app.id === id ? { ...app, status } : app)
    );
  };

  return (
    <ApplicationContext.Provider value={{ 
      applications, 
      stats, 
      submitApplication,
      updateApplicationStatus
    }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplications = () => {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplications must be used within an ApplicationProvider');
  }
  return context;
};
