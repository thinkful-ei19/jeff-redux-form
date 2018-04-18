import React from 'react';
import {reduxForm, Field} from 'redux-form';
import Input from './input'
import { required, nonEmpty, exactLength, onlyNumbers } from '../validators';
const exactLength5 = exactLength(5);

export class ContactForm extends React.Component {
    onSubmit(values) {
        console.log(values);
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
            </header>
            <main>
            <form
                onSubmit={this.props.handleSubmit(values =>
                    this.onSubmit(values)
                )}>
                   {successMessage}
                    {errorMessage}
                <label htmlFor="name">Tracking Number</label><br/>
                <Field name="name" id="name" type="text" component={Input}
                validate={[
                    required,
                    nonEmpty,
                    exactLength5,
                    onlyNumbers]} />
                <br/><br/>
                <label htmlFor="select-option">What is our issue?</label>
                {/* need this to be  seletction */}
                <Field component={Input} element="select" name="someDropdown">
                <option value="Option 1">My delivery hasn't arrived </option>
                <option value="Option 2">The wrong item was deliverd</option>
                <option value="Option 3">Part of my order arrived damaged</option>
                <option value="Option 4">Other(give more details below)</option>
                </Field>
                <br/>
                <label htmlFor="message">Message</label><br/>
                
                <Field name="message" id="message" component={"textarea"} /><br/>
                <button type="submit" disable={
                    this.props.pristine||
                    this.props.sumbitting}>Send Complaint</button>
            </form>
            </main>
      </div>
        );
    }
}

export default reduxForm({
    form: 'complaint'
})(ContactForm);