import { useRef, useState } from "react";
import client from "../Utils/client";
import { useNavigate } from "react-router-dom";

export const CreateFormPage = () => {

    const inputName = useRef();
    const inputSlug = useRef();
    const inputDesc = useRef();
    const inputDomain = useRef();
    const inputLimit = useRef();

    const [ checked, setChecked ] = useState(false);
    const [successMessage, setSuccessMessage] = useState();
    const [errorMessage, setErrorMessage] = useState();

    const nav = useNavigate();

    const submit = (e) =>{
        e.preventDefault();

        let body = {
            name: inputName.current.value,
            slug: inputSlug.current.value,
            description: inputDesc.current.value,
            allowed_domains: inputDomain.current.value.split(', '),
            limit_one_response: inputLimit.current.value,
        }

        client.post('forms', body).then(({data}) => {
            console.log(data.forms);
            setSuccessMessage(data.message);

            setTimeout(() => {
                nav('/dashboard');            
            }, 2000);
        }).catch((error) => {
            console.error(error);

            setErrorMessage(error.response.data.errors);
        })
        
    }

    const handleCheckbox = (e) => {
        setChecked(e.target.value);
    }

    return (
        <main>
      <div class="hero py-5 bg-light">
        <div class="container">
          <h2>Create Form</h2>
        </div>
      </div>

      <div class="py-5">
        <div class="container">
          <div class="row">
            <div class="col-md-6 col-lg-4">

                {errorMessage && (
                    <div className="alert alert-danger">
                        <ul>
                            <li>{errorMessage.name}</li>
                            <li>{errorMessage.slug}</li>
                        </ul>
                    </div>
                )}

                {successMessage && (
                    <div className="alert alert-success">{successMessage}</div>
                )}

              <form action="detail-form.html">
                <div class="form-group mb-3">
                  <label for="name" class="mb-1 text-muted">Form Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    class="form-control"
                    autoFocus
                    ref={inputName}
                  />
                </div>

                <div class="form-group my-3">
                  <label for="slug" class="mb-1 text-muted">Form Slug</label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    class="form-control"
                    ref={inputSlug}
                  />
                </div>

                <div class="form-group my-3">
                  <label for="description" class="mb-1 text-muted"
                    >Description</label
                  >
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    class="form-control"
                    ref={inputDesc}
                  ></textarea>
                </div>

                <div class="form-group my-3">
                  <label for="allowed-domains" class="mb-1 text-muted"
                    >Allowed Domains</label
                  >
                  <input
                    type="text"
                    id="allowed-domains"
                    name="allowed_domains"
                    class="form-control"
                    ref={inputDomain}
                  />
                  <div class="form-text">
                    Separate domains using comma ", " and space after comma. Ignore for public access.
                  </div>
                </div>

                <div class="form-check form-switch" aria-colspan="my-3">
                  <input
                    type="checkbox"
                    id="limit_one_response"
                    name="limit_one_response"
                    class="form-check-input"
                    role="switch"
                    onChange={handleCheckbox} 
                    value={checked ? 1 : 0}
                    ref={inputLimit}
                  />
                  <label class="form-check-label" for="limit_one_response"
                    >Limit to 1 response</label
                  >
                </div>

                <div class="mt-4">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    onClick={submit}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
    )
}