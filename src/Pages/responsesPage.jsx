import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../Utils/client";
import { ForbiddenPage } from "../Components/ForbiddenPage";
import { NotFoundPage } from "../Components/NotfoundPage";

export const ResponsesPage = () => {

    const { form_slug } = useParams();

    const [dataDetailForm, setDataDetailForm] = useState([]);
    const [domains, setDomains] = useState([]);
    const [dataResponses, setDataResponses] = useState([]);  
    const [forbidden, setForbidden] = useState(false);
    const [notfound, setNotfound] = useState(false);

    useEffect(() => {
        client.get(`forms/${form_slug}`,).then(({data}) => {
            console.log(data.form);
            setDataDetailForm(data.form);
            setDomains(data.form.allowed_domains);
        }).catch((error) => {
            console.error(error);

            if (error.response.status === 403) {
                setForbidden(true);
            } else if (error.response.status === 404) {
                setNotfound(true);
            }
        })
    }, []);

    useEffect(() => {
        client.get(`forms/${form_slug}/responses`,).then(({data}) => {
            console.log(data.responses);
            setDataResponses(data.responses);
        }).catch((error) => {
            console.error(error);

            if (error.response.status === 403) {
                setForbidden(true);
            } else if (error.response.status === 404) {
                setNotfound(true);
            }
        })
    }, []);

    if (forbidden) {
        return <ForbiddenPage />
    }

    if (notfound) {
        return <NotFoundPage />
    }

    return (
        <main>
      <div class="hero py-5 bg-light">
        <div class="container text-center">
          <h2 class="mb-2">{dataDetailForm.name}</h2>
          <div class="text-muted mb-4">{dataDetailForm.description}</div>
          <div>
            <div>
              <small>For user domains</small>
            </div>

            {domains.map((domain, index) => (
                <small><span class="text-primary">{domain.domain} {index !== domains.length -1 && ', '}</span></small>
            ))}
          </div>
        </div>
      </div>

      <div class="py-5">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-5 col-md-6">
              <div class="input-group mb-5">
                <input
                  type="text"
                  class="form-control form-link"
                  readonly
                  value={`http://localhost:3000/submit-form/${dataDetailForm.slug}`}
                />
                <a href={`/submit-form/${dataDetailForm.slug}`} class="btn btn-primary">Copy</a>
              </div>

              <ul class="nav nav-tabs mb-2 justify-content-center">
                <li class="nav-item">
                  <a class="nav-link" href={`/detail-form/${dataDetailForm.slug}`}>Questions</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link active" href={`/responses-form/${dataDetailForm.slug}`}>Responses</a>
                </li>
              </ul>
            </div>
          </div>

          <div class="row justify-content-center">
            <div class="col-lg-10">
              <table class="table mt-3">
                <caption>
                  Total Responses: {dataResponses.length}
                </caption>
                <thead>
                  <tr class="text-muted">
                    <th>User</th>
                    <th>Name</th>

                  {dataResponses.length > 0 && Object.keys(dataResponses[0].answers).map((question) => (
                    <th>{question}</th>
                  ))}
                    
                  </tr>
                </thead>
                <tbody>

                  {dataResponses.map((response, index) => (
                  <tr>
                    <td class="text-primary">{response?.user?.email}</td>
                    <td>{response?.user?.name}</td>
                    {Object.keys(dataResponses[0].answers).map((question) => (
                      <td>{response.answers[question] ?? '-'}</td>
                    ))}
                  </tr>
                    ))}

                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
    )
}