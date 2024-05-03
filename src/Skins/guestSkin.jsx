import { Navigate, Outlet } from "react-router-dom"
import { sessionToken } from "../Constants/localStorage"

export const GuestSkin = () => {

    if (localStorage.getItem(sessionToken) != null) {
        return <Navigate to={'/dashboard'} /> 
    }

    return (
        <div className="">
            <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-primary">
    <div class="container">
        <a class="navbar-brand" href="#">Formify</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarsExampleDefault">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                    <a class="nav-link" href="#">Login</a>
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