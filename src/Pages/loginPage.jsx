import { useRef, useState } from "react"
import client from "../Utils/client";
import { sessionEmail, sessionName, sessionToken } from "../Constants/localStorage";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {

    const inputEmail = useRef();
    const inputPassword = useRef();

    const nav = useNavigate();

    const [errorMessage, setErrorMessage] = useState();

    const login = (e) => {
        e.preventDefault();

        let body = {
            email: inputEmail.current.value,
            password: inputPassword.current.value
        }

        client.post('auth/login', body).then(({data}) => {
            console.log(data);

            localStorage.setItem(sessionName, data.user.name);
            localStorage.setItem(sessionEmail, data.user.email);
            localStorage.setItem(sessionToken, data.user.accessToken);

            nav('/dashboard');

        }).catch(error => {
            console.error(error);
            setErrorMessage(error.response.data.message);
        });
    }

    return (
        <div className="">
            <main>
    <header class="jumbotron">
        <div class="container text-center">
            <h1 class="display-4">Formify</h1>
        </div>
    </header>

    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6">

                {errorMessage && (
                    <div className="alert alert-danger">{errorMessage}</div>
                )}

                <form class="card card-default">
                    <div class="card-header">
                        <h4 class="mb-0">Login</h4>
                    </div>
                    <div class="card-body">
                        <div class="form-group row align-items-center">
                            <div class="col-4 text-right">Email</div>
                            <div class="col-8"><input ref={inputEmail} type="email" class="form-control" /></div>
                        </div>
                        <div class="form-group row align-items-center">
                            <div class="col-4 text-right">Password</div>
                            <div class="col-8"><input ref={inputPassword} type="password" class="form-control" /></div>
                        </div>
                        <div class="form-group row align-items-center mt-4">
                            <div class="col-4"></div>
                            <div class="col-8"><button onClick={login} class="btn btn-primary">Login</button></div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</main>
        </div>
    )
}