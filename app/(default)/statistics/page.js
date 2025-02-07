import ComponentsDashboardAnalytics from "../../../components/dashboard/components-dashboard-analytics";
import WeeklyChart from "@/components/dashboard/weekly-chart";
import WeeklyFbChart from "@/components/dashboard/weeklyfb-chart";
const page = () => {
    return (
        <div>
            <ComponentsDashboardAnalytics />
            <WeeklyChart />
            <WeeklyFbChart />
        </div>
    );
}

export default page;