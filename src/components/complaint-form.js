import React from 'react';
import {reduxForm, Field, SubmissionError,focus} from 'redux-form';
import Input from './input'
import { required, nonEmpty, exactLength, onlyNumbers } from '../validators';
const exactLength5 = exactLength(5);

export class ContactForm extends React.Component {
    onSubmit(values) {
        console.log(values,'OnSubmit')
        return fetch('https://us-central1-delivery-form-api.cloudfunctions.net/api/report', {
            method: 'POST',
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (!res.ok) {
                    if (
                        res.headers.has('content-type') &&
                        res.headers
                            .get('content-type')
                            .startsWith('application/json')
                    ) {
                        // It's a nice JSON error returned by us, so decode it
                        return res.json().then(err => Promise.reject(err));
                    }
                    // It's a less informative error returned by express
                    return Promise.reject({
                        code: res.status,
                        message: res.statusText
                    });
                }
                return;
            })
            .then(() => console.log('Submitted with values', values))
            .catch(err => {
                const {reason, message, location} = err;
                if (reason === 'ValidationError') {
                    // Convert ValidationErrors into SubmissionErrors for Redux Form
                    return Promise.reject(
                        new SubmissionError({
                            [location]: message
                        })
                    );
                }
                return Promise.reject(
                    new SubmissionError({
                        _error: 'Error submitting message'
                    })
                );
            });
    }
    render() {
        let successMessage;
        if (this.props.submitSucceeded) {
            successMessage = (
                <div className="message message-success">
                    Report submitted successfully
                </div>
            );
        }

        let errorMessage;
        if (this.props.error) {
            errorMessage = (
                <div className="message message-error">{this.props.error}</div>
            );
        }

        return (
            <div className="compl8-wrapper">
            <header>
              <h1>Report a problem with your delivery</h1>
                        {successMessage}
                    {errorMessage}
            </header>
            <main>
            <form
                onSubmit={this.props.handleSubmit(values =>
                    this.onSubmit(values)
                )}>
                   
                <Field name="trackingNumber" id="trackingNumber" label="Tracking Number" component={Input}
                validate={[
                    required,
                    nonEmpty,
                    exactLength5,
                    onlyNumbers]} />
                <br/>
                {/* need this to be  seletction */}
                <Field component={Input} element="select"  name="issue" id="issue" label="What is our issue?">
                <option value="not-delivered">My delivery hasn't arrived </option>
                <option value="wrong-item">The wrong item was deliverd</option>
                <option value="damaged">Part of my order arrived damaged</option>
                <option value="other">Other(give more details below)</option>
                </Field>
                <br/>
                
                <Field name="details" id="details" component={Input} element="textarea" label="Give more deatils(Optional)"/><br/>
                <button type="submit">Send Complaint</button>
            </form>
            </main>
      </div>
        );
    }
}

export default reduxForm({
    form: 'compliant',
    onSubmitFail: (errors, dispatch) =>
        dispatch(focus('contact', Object.keys(errors)[0]))
})(ContactForm);
