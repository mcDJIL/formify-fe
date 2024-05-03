import { createBrowserRouter } from "react-router-dom";
import { GuestSkin } from "../Skins/guestSkin";
import { LoginPage } from "../Pages/loginPage";
import { GuardSkin } from "../Skins/guardSkin";
import { DashboardPage } from "../Pages/dashboardPage";
import { CreateFormPage } from "../Pages/createFormPage";
import { DetailFormPage } from "../Pages/detailFormPage";
import { ForbiddenPage } from "../Components/ForbiddenPage";
import { ResponsesPage } from "../Pages/responsesPage";
import { SubmitFormPage } from "../Pages/submitFormPage";

const routes = createBrowserRouter([
    {
        path: '/',
        element: <GuestSkin />,
        children: [
            {
                path: '/',
                element: <LoginPage />
            }
        ]
    },
    {
        path: '/',
        element: <GuardSkin />,
        children: [
            {
                path: '/dashboard',
                element: <DashboardPage />
            },
            {
                path: '/create-form',
                element: <CreateFormPage />
            },
            {
                path: '/detail-form/:form_slug',
                element: <DetailFormPage />
            },
            {
                path: '/responses-form/:form_slug',
                element: <ResponsesPage />
            },
            {
                path: '/submit-form/:form_slug',
                element: <SubmitFormPage />
            },
        ]
    }
]);

export default routes;