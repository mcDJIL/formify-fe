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
        <main>
      <section class="login">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-5 col-md-6">

                {errorMessage && (
                    <div className="alert alert-danger">{errorMessage}</div>
                )}

              <h1 class="text-center mb-4">Formify</h1>
              <div class="card card-default">
                <div class="card-body">
                  <h3 class="mb-3">Login</h3>

                  <form action="manage-forms.html" >
                    <div class="form-group my-3">
                      <label for="email" class="mb-1 text-muted"
                        >Email Address</label
                      >
                      <input
                        ref={inputEmail}
                        type="email"
                        id="email"
                        name="email"
                        class="form-control"
                        autofocus
                      />
                    </div>

                    <div class="form-group my-3">
                      <label for="password" class="mb-1 text-muted"
                        >Password</label
                      >
                      <input
                        ref={inputPassword}
                        type="password"
                        id="password"
                        name="password"
                        class="form-control"
                      />
                    </div>

                    <div class="mt-4">
                      <button
                        type="submit"
                        class="btn btn-primary"
                        onClick={login}
                      >
                        Login
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    )
}