import { useEffect, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom"
import client from "../Utils/client";
import { ForbiddenPage } from "../Components/ForbiddenPage";
import { NotFoundPage } from "../Components/NotfoundPage";

export const DetailFormPage = () => {

    const { form_slug } = useParams();

    const [dataDetailForm, setDataDetailForm] = useState([]);
    const [domains, setDomains] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [required, setRequired] = useState(false);
    const [selectedChoice, setSelectedChoice] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [successMessage, setSuccessMessage] = useState();

    const [forbidden, setForbidden] = useState(false);
    const [notfound, setNotfound] = useState(false);

    const inputName = useRef(); 
    const inputChoiceType = useRef(); 
    const inputChoices = useRef(); 
    const inputRequired = useRef(); 
    
    const handleRequired = (e) => {
      setRequired(e.target.value);
    }

    const handleSelectedChoice = (e) => {
      setSelectedChoice(e.target.value);
    }

    const addQuestion = (e) => {
      e.preventDefault(e);

      let body = {
        name: inputName.current.value,
        choice_type: inputChoiceType.current.value ,
        choices: inputChoices.current?.value?.split(', ') ?? null,
        is_required: inputRequired.current.value,
      }

      client.post(`forms/${form_slug}/questions`, body).then(({data}) => {
        console.log(data);
        setSuccessMessage(data.message);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }).catch((error) => {
        console.error(error);
        setErrorMessage(error.response.data);

        if (error.response.status === 403) {
          setForbidden(true) 
        } else if (error.response.status === 404) {
          setNotfound(true)
        }
      })
    }

    const destroyQuestion = (form_slug, question_id) => {
      client.delete(`forms/${form_slug}/questions/${question_id}`).then(({data}) => {
        console.log(data);
        setSuccessMessage(data.message);

        setTimeout(() => {
          window.location.reload();
        }, 2000);

      }).catch((error) => {
        console.error(error);
        
        if (error.response.status === 403) {
          setForbidden(true)
        } else if (error.response.status === 404) {
          setNotfound(true)
        }
      })
    }

    useEffect(() => {
        client.get(`forms/${form_slug}`,).then(({data}) => {
            console.log(data.form);
            setDataDetailForm(data.form);
            setDomains(data.form.allowed_domains);
            
            setQuestions(data.form.questions)
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
                <small>
                    <span class="text-primary">{domain.domain}
                    {index !== domains.length - 1 && ', '}
                    </span>
                </small>
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

              {errorMessage && (
                <div className="alert alert-danger">
                  {errorMessage.message}

                  <ul>
                    <li>{errorMessage.errors?.name ?? null}</li>
                    <li>{errorMessage.errors?.choice_type ?? null}</li> 
                    <li>{errorMessage.errors?.choices ?? null}</li>
                  </ul>
                </div>
              )}

              {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
              )}

              <ul class="nav nav-tabs mb-2 justify-content-center">
                <li class="nav-item">
                  <a class="nav-link active" href={`/detail-form/${dataDetailForm.slug}`}>Questions</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href={`/responses-form/${dataDetailForm.slug}`}>Responses</a>
                </li>
              </ul>
            </div>
          </div>

          <div class="row justify-content-center">
            <div class="col-lg-5 col-md-6">

              {questions.map((question, index) => (

                <div class="question-item card card-default my-4">
                  <div class="card-body">
                    <div class="form-group my-3">
                      <input
                        type="text"
                        placeholder="Question"
                        class="form-control"
                        name="name"
                        value={question.name}
                        disabled
                      />
                    </div>

                    <div class="form-group my-3">
                      <select name="choice_type" class="form-select" disabled>
                        <option>Choice Type</option>
                        <option selected value="short answer">
                          {question.choice_type}
                        </option>
                        <option value="paragraph">Paragraph</option>
                        <option value="multiple choice">Multiple Choice</option>
                        <option value="dropdown">Dropdown</option>
                        <option value="checkboxes">Checkboxes</option>
                      </select>
                    </div>

                    {question.choice_type === 'multiple choice' || question.choice_type === 'checkboxes' || question.choice_type === 'dropdown' ? (
                      <div className="form-group my-3">
                        <textarea name="choices" value={question.choices} className="form-control" id="" cols="30" rows="5"></textarea>
                      </div>
                    ) : null}

                    <div class="form-check form-switch" aria-colspan="my-3">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="required"
                        disabled
                        checked={question.is_required === 1}
                      />
                      <label class="form-check-label" for="required"
                        >Required</label
                      >
                    </div>
                    <div class="mt-3">
                      <button onClick={() => destroyQuestion(dataDetailForm.slug, question.id)} type="submit" class="btn btn-outline-danger">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div class="question-item card card-default my-4">
                <div class="card-body">
                  <form>
                    <div class="form-group my-3">
                      <input
                        type="text"
                        placeholder="Question"
                        class="form-control"
                        name="name"
                        ref={inputName}
                      />
                    </div>

                    <div class="form-group my-3">
                      <select ref={inputChoiceType} onChange={handleSelectedChoice} value={selectedChoice} name="choice_type" class="form-select">
                        <option selected>Choice Type</option>
                        <option value="short answer">Short Answer</option>
                        <option value="paragraph">Paragraph</option>
                        <option value="date">Date</option>
                        <option value="multiple choice">Multiple Choice</option>
                        <option value="dropdown">Dropdown</option>
                        <option value="checkboxes">Checkboxes</option>
                      </select>
                    </div>

                      {selectedChoice === 'multiple choice' || selectedChoice === 'dropdown' || selectedChoice === 'checkboxes' ? (
                        <div className="form-group my-3">
                          <textarea ref={inputChoices} name="choices" className="form-control" id="" cols="30" rows="5"></textarea>
                            <div class="form-text">
                              Separate choices using comma ", " and space after comma.
                            </div>
                        </div>
                        
                      ) : null}

                    <div class="form-check form-switch" aria-colspan="my-3">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="required"
                        onChange={handleRequired}
                        value={required ? 1 : 0}
                        ref={inputRequired}
                      />
                      <label class="form-check-label" for="required"
                        >Required</label
                      >
                    </div>
                    <div class="mt-3">
                      <button onClick={addQuestion} type="submit" class="btn btn-outline-primary">
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main> 
    )
}