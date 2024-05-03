import { useEffect, useRef, useState } from "react";
import { ForbiddenPage } from "../Components/ForbiddenPage";
import { NotFoundPage } from "../Components/NotfoundPage";
import client from "../Utils/client";
import { useParams } from "react-router-dom";
import { sessionEmail } from "../Constants/localStorage";

export const SubmitFormPage = () => {

   const { form_slug } = useParams();

   const userEmail = localStorage.getItem(sessionEmail);

   const [questions, setQuestions] = useState([]);
   const [dataDetailForm, setDataDetailForm] = useState([]);

   const [answers, setAnswers] = useState([]);

   const [errorMessage, setErrorMessage] = useState();
   const [successMessage, setSuccessMessage] = useState();
   const [forbidden, setForbidden] = useState(false);
   const [notfound, setNotfound] = useState(false);

   const handleInputChange = (e) => {
      const value = e.target.value;
      const question_id = e.target.id;

      const prevAnswers = answers.filter((ans) => ans.question_id !== question_id);

      setAnswers([...prevAnswers, {question_id, value}]);
   }

   const [multipleOption, setMultipleOption] = useState('');
   const handleMultipleChange = (e) => {
      setMultipleOption(e.target.value);

      const value = e.target.value;
      const question_id = e.target.id;

      const prevAnswers = answers.filter((ans) => ans.question_id !== question_id);

      setAnswers([...prevAnswers, {question_id, value}]);
   }

   const handleSelectChange = (e) => {

      const value = e.target.value;
      const question_id = e.target.id;

      const prevAnswers = answers.filter((ans) => ans.question_id !== question_id);

      setAnswers([...prevAnswers, {question_id, value}]);

   }

   const handleCheckboxChange = (e) => {

      const value = e.target.value;
      const question_id = e.target.id;

      const isChecked = e.target.checked;

      if (isChecked) {
         setAnswers(prevAnswers => [...prevAnswers, {question_id, value}]);
      } else {
         setAnswers(prevAnswers => prevAnswers.filter((ans) => ans.question_id !== question_id || ans.value !== value));
      }

      
   }

   const submitQuestion = (e) => {
      e.preventDefault();

      client.post(`forms/${form_slug}/responses`, { answers }).then(({data}) => {
         console.log(data);

         setAnswers([]);

         setSuccessMessage(data.message);
      }).catch((error) => {
         console.error(error);
         setErrorMessage(error.response.data.message);
      })
   }

   useEffect(() => {
      client.get(`forms/${form_slug}`,).then(({data}) => {
          console.log(data.form.questions);
          setDataDetailForm(data.form);
          
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

  useEffect(() => {
      console.log(answers);



   }, [answers, questions])

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
          <h2 class="mb-3">
             {dataDetailForm.name}
          </h2> 
          <div class="text-muted">
             {dataDetailForm.description}
          </div>
       </div>
    </div>

    <div class="py-5">
       <div class="container"> 

          <div class="row justify-content-center ">
             <div class="col-lg-5 col-md-6"> 

               {successMessage && (
                  <div className="alert alert-success">{successMessage}</div>
               )}

               {errorMessage && (
                  <div className="alert alert-danger">{errorMessage}</div>
               )}

                <div class="text-muted">
                   <span class="text-primary">{userEmail}</span> <small><i>(shared)</i></small>
                </div>
                
                <form onSubmit={submitQuestion}> 

                  {questions.map((question) => (

                     <>
                     
                     {question.choice_type === 'short answer' ? (
                        <div key={question.id} class="form-item card card-default my-4">
                           <div class="card-body">
                              <div class="form-group">
                                 <label for="name" class="mb-1 text-muted">{question.name} <span class="text-danger">{question.is_required === 1 ? '*' : ''}</span></label>
                                 <input onChange={handleInputChange} id={question.id} type="text" placeholder="Your answer" class="form-control" name="name"/>
                              </div>  
                           </div>
                        </div>
                        ) : question.choice_type === 'paragraph' ? (
                           <div key={question.id} class="form-item card card-default my-4">
                           <div class="card-body">
                              <div class="form-group">
                                 <label for={question.name} class="mb-1 text-muted">{question.name} <span class="text-danger">{question.is_required === 1 ? '*' : ''}</span></label>
                                 <textarea  onChange={handleInputChange} name={question.name} id={question.id} placeholder="Your answer" class="form-control" cols="30" rows="5"></textarea>
                              </div>  
                           </div>
                           </div>
                        ) : question.choice_type === 'date' ? (
                           <div key={question.id} class="form-item card card-default my-4">
                           <div class="card-body">
                              <div class="form-group">
                                 <label for={question.name} class="mb-1 text-muted">{question.name} <span class="text-danger">{question.is_required === 1 ? '*' : ''}</span></label>
                                 <input onChange={handleInputChange} type="date" placeholder="Your answer" class="form-control" name={question.name} id={question.id} />
                              </div>  
                           </div>
                           </div>
                        ) : question.choice_type === 'time' ? (
                           <div key={question.id} class="form-item card card-default my-4">
                           <div class="card-body">
                              <div class="form-group">
                                 <label for={question.name} class="mb-1 text-muted">{question.name} <span class="text-danger">{question.is_required === 1 ? '*' : ''}</span></label>
                                 <input onChange={handleInputChange} type="time" placeholder="Your answer" class="form-control" name={question.name} id={question.id} />
                              </div>  
                           </div>
                           </div>
                        ) : question.choice_type === 'multiple choice' ? (
                           <div key={question.id} class="form-item card card-default my-4">
                           <div class="card-body">
                              <div class="form-group">
                                 <label for={question.name} class="mb-1 text-muted">{question.name} <span class="text-danger">{question.is_required === 1 ? '*' : ''}</span></label>
                                 
                                 {question.choices.split(', ').map((choice) => (
                                    <div class="form-check">
                                       <input class="form-check-input" type="radio" onChange={handleMultipleChange} checked={multipleOption === choice} value={choice} id={question.id} name="sex"/>
                                       <label class="form-check-label" for="sex-male">
                                          {choice}
                                       </label>
                                    </div>
                                 ))}
                              </div>  
                           </div>
                           </div>
                        ) : question.choice_type === 'dropdown' ? (
                           <div key={question.id} class="form-item card card-default my-4">
                           <div class="card-body">
                              <div class="form-group"> 
                                 <label for={question.name} class="mb-1 text-muted">{question.name} <span class="text-danger">{question.is_required === 1 ? '*' : ''}</span></label>
                                 <select id={question.id} className="form-control" onChange={handleSelectChange}>
                                    <option selected>Your Answer</option>

                                    {question.choices.split(', ').map((choice) => (
                                       <option value={choice} >{choice}</option>
                                    ))}
                                 </select>
                              </div>  
                           </div>
                           </div>
                        ) : question.choice_type === 'checkboxes' ? (
                           <div key={question.id} class="form-item card card-default my-4">
                              <div class="card-body">
                                 <div class="form-group">
                                    <label for={question.name} class="mb-1 text-muted">{question.name}</label>

                                    {question.choices.split(', ').map((choice) => (
                                       <div class="form-check">
                                          <input class="form-check-input" type="checkbox" 
                                          onChange={handleCheckboxChange} 
                                          // checked={answers.some(ans => ans.question === question.id && ans.value === choice)} 
                                          value={choice} 
                                          id={question.id} 
                                          name={choice}/>
                                          <label class="form-check-label" for="hobbies-football">
                                             {choice}
                                          </label>
                                       </div> 
                                    ))}
                                 </div>  
                              </div>
                           </div>
                        ) : null}
                     </>
                  ))}
 
                   <div class="mt-4">
                      <button class="btn btn-primary" disabled={!answers.length}>Submit</button>
                   </div>
                </form>

             </div>
           </div>  
          
       </div>
    </div>
  </main>
    )
}