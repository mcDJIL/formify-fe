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
        <div className="">
            <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-primary">
    <div class="container">
        <a class="navbar-brand" href={'/dashboard'}>Formify</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarsExampleDefault">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                    <a onClick={logout} class="nav-link" href="#">Logout</a>
                </li>
            </ul>
        </div>
    </div>
</nav>
<Outlet />

<footer>
    <div class="container">
        <div class="text-center py-4 text-muted">
            Copyright &copy; 2023 - Web Tech ID
        </div>
    </div>
</footer>
        </div>

    )
}