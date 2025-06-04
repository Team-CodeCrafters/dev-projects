import DashboardNavigation from '../components/DashboardNavigation';
import DashboardSidebar from '../components/DashboardSidebar';

const Dashboard = () => {
  return (
    <div className="h-screen w-screen">
      <DashboardSidebar />
      <DashboardNavigation />
    </div>
  );
};
export default Dashboard;
