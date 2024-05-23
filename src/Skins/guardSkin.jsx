import { Navigate, Outlet, useNavigate } from "react-router-dom"
import { sessionEmail, sessionName, sessionToken } from "../Constants/localStorage"
import client from "../Utils/client";

export const GuardSkin = () => {

    const nav = useNavigate();

    const logout = (e) => {
        e.preventDefault();

        client.post('auth/logout').then(({data}) => {
            localStorage.removeItem(sessionToken);
            localStorage.removeItem(sessionEmail);
            localStorage.removeItem(sessionName);

            alert(data.message);

            nav('/');
        }).catch(error => {
            console.error(error);
        })
    } 

    if (localStorage.getItem(sessionToken) == null) {
        return <Navigate to={'/'} />
    }

    return (
        <>

        <nav class="navbar navbar-expand-lg sticky-top bg-primary navbar-dark">
      <div class="container">
        <a class="navbar-brand" href={'/dashboard'}>Formify</a>
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item" v-if="!isLogin">
            <button onClick={logout} class="btn bg-white text-primary ms-4">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>

        <Outlet/>
        </>
    )
}