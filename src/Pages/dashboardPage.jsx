import { useEffect, useState } from "react"
import client from "../Utils/client";

export const DashboardPage = () => {

    const [myForms, setMyForms] = useState([]);

    useEffect(() => {
        client.get('forms').then(({data}) => {
            console.log(data);
            setMyForms(data.forms);
        }).catch((error) => {
            console.error(error);
        })
    }, []);

    return (
        <main>
      <div class="hero py-5 bg-light">
        <div class="container">
          <a href="/create-form" class="btn btn-primary"> Create Form </a>
        </div>
      </div>

      <div class="list-form py-5">
        <div class="container">
          <h6 class="mb-3">List Form</h6>

        {myForms.map((form, index) => (
            <a href={`/detail-form/${form.slug}`} class="card card-default my-3">
                <div class="card-body">
                    <h5 class="mb-1">{form.name}</h5>
                    <small class="text-muted">@{form.slug} {form.limit_one_response == 1 ? '(Limit For 1 Response)' : '(No Limit For Response)'}</small>
                </div>
                </a> 
        ))}
        </div>
      </div>
    </main>
    )
}