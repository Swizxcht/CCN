import { createBrowserRouter, } from "react-router-dom";

/*
|--------------------------------------------------------------------------
| Layout
|--------------------------------------------------------------------------
*/
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

/*
|--------------------------------------------------------------------------
| Public Pages
|--------------------------------------------------------------------------
*/
import Home from "../pages/Home";
import About from "../pages/About";
import InternetPlans from "../pages/InternetPlans";
import CablePlans from "../pages/CablePlans";
import InstallationFees from "../pages/InstallationFees";
import CoverageArea from "../pages/CoverageArea";
import Support from "../pages/Support";
import News from "../pages/News";
import Contact from "../pages/Contact";
import NewsDetails from "../pages/NewsDetails";

/*
|--------------------------------------------------------------------------
| Authentication Pages
|--------------------------------------------------------------------------
*/
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Unauthorized from "../pages/Unauthorized";

/*
|--------------------------------------------------------------------------
| Route Protection
|--------------------------------------------------------------------------
*/
import ProtectedRoute from "../routes/ProtectedRoute";
import AdminRoute from "../routes/AdminRoute";
// import Dashboard from "../pages/Dashboard";

import DashboardHome from "../pages/dashboard/DashboardHome";
import Customers from "../pages/dashboard/Customers";
import ServiceRequests from "../pages/dashboard/ServiceRequests";
import NewsAdmin from "../pages/dashboard/NewsAdmin";
// import CustomerDashboard from "../pages/CustomerDashboard";
import Subscribers from "../pages/dashboard/Subscribers";
import CreateSubscriber from "../pages/dashboard/CreateSubscriber";
// import MyRequests from "../pages/MyRequests";
import SubscriberDetails from "../pages/dashboard/SubscriberDetails";
import Bills from "../pages/dashboard/Bills";
import BillingConsole from "../pages/dashboard/BillingConsole";
import Payments from "../pages/dashboard/Payments";
import PendingApplications from "../pages/dashboard/PendingApplications";
import RecordPayment from "../pages/dashboard/RecordPayment";
import AccountStatement from "../pages/dashboard/AccountStatement";
import TechnicianDashboard from "../pages/technician/TechnicianDashboard";
import PendingServiceRequests from "../pages/technician/PendingServiceRequests";
import TechnicianOverview from "../pages/technician/TechnicianOverview";
import PendingInstallations from "../pages/technician/PendingInstallations";
import InstallationJobOrders from "../pages/technician/InstallationJobOrders";
import TechnicianLayout from "../layouts/TechnicianLayout";

import SubscriberLayout from "../layouts/SubscriberLayout";
import PortalDashboard from "../pages/portal/PortalDashboard";
import SubscriptionApplication from "../pages/portal/SubscriptionApplication";
import Profile from "../pages/portal/Profile";
import MyBills from "../pages/portal/MyBills";
import MyPayments from "../pages/portal/MyPayments";
import MyServiceRequests from "../pages/portal/MyServiceRequests";
import Plans from "../pages/Plans";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,

    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "internet-plans",
        element: <InternetPlans />,
      },
      {
        path: "cable-plans",
        element: <CablePlans />,
      },
      {
        path: "installation-fees",
        element: <InstallationFees />,
      },
      {
        path: "coverage",
        element: <CoverageArea />,
      },
      {
        path: "support",
        element: <Support />,
      },
      {
        path: "plans",
        element: <Plans />,
      },
      {
        path: "news",
        element: <News />,
      },
      {
        path: "news/:id",
        element: <NewsDetails />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
        {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },

    ],
  },
  {
    path: "/dashboard",
    element: (
      <AdminRoute>
        <DashboardLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element:
          <DashboardHome />,
      },
      {
        path: "customers",
        element: <Customers />,
      },
      {
        path: "service-requests",
        element: <ServiceRequests />,
      },
      {
        path: "news",
        element: <NewsAdmin />,
      },
      {
        path: "subscribers",
        element: <Subscribers />,
      },
      {
        path: "subscribers/create",
        element: (
          <CreateSubscriber />
        ),
      },
      {
        path: "subscribers/:id",
        element: (
          <SubscriberDetails />
        ),
      },
      {
        path: "pending-applications",
        element: <PendingApplications />,
      },
      {
        path: "bills",
        element: <Bills />,
      },
      {
        path: "payments",
        element: <Payments />,
      },
      {
        path: "billing-console",
        element: <BillingConsole />,
      },
      {
        path: "record-payment",
        element:
          <RecordPayment />,
      },
      {
        path: "account-statement/:id",

        element:
          <AccountStatement />,
      },
    ],
  },
  // {
  //   path: "/customer-dashboard",
  //   element: (
  //     <ProtectedRoute>
  //       <CustomerDashboard />
  //     </ProtectedRoute>
  //   ),
  // },
  // {
  //   path: "/my-requests",
  //   element: (
  //     <ProtectedRoute>
  //       <MyRequests />
  //     </ProtectedRoute>
  //   ),
  // },
  {
    path: "/portal",

    element: (
      <ProtectedRoute
        allowedRole="customer"
      >
        <SubscriberLayout />
      </ProtectedRoute>
    ),

    children: [

      {
        index: true,
        element:
        <PortalDashboard />,
      },
      {
        path: "apply",
        element:
        <SubscriptionApplication />,
      },
      {
        path: "profile",
        element:
        <Profile />,
      },

      {
        path: "bills",
        element:
        <MyBills />,
      },

      {
        path: "payments",
        element:
        <MyPayments />,
      },

      {
        path:
        "service-requests",

        element:
        <MyServiceRequests />,
      },

    ],
  },
  {
    path: "/technician",
    element: (
      <ProtectedRoute allowedRole="technician">
        <TechnicianLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <TechnicianOverview />,
      },
      {
        path: "job-orders",
        element: <TechnicianDashboard />,
      },
      {
        path: "pending",
        element: <PendingServiceRequests />,
      },
      {
        path: "installations/pending",
        element: <PendingInstallations />,
      },
      {
        path: "installations/job-orders",
        element: <InstallationJobOrders />,
      },
    ],
  },
]);

export default router;
