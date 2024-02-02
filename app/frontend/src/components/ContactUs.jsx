import React from 'react';
import { useState } from 'react';
import { contactUs } from '../util/helpers';

export default function ContactUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({...formData, [name]: value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(false);
        if (formData.name === '' || formData.email === '' || formData.message === '') {
            setError(true);
            return;
        }
        setError(false);
        const response = await contactUs(formData);
        if(response.error){
            setError(response.message)
            return;
        }
        setSuccess(true);
        setFormData({
            name: '',
            email: '',
            message: ''
        });
    }

    const errorMessage = () => {
        return (
            <div
            className="error"
            style={{
                display: error ? '' : 'none',
            }}>
            <h3>{error===true ? 'Please enter all the fields' : error}</h3>
            </div>
        );
    }

    const successMessage = () => {
        return (
            <div
            className="success"
            style={{
                display: success ? '' : 'none',
            }}>
            <h3>Thank you for your message! We will get back to you shortly.</h3>
            </div>
        );
    }
    
    return (
        <div className="container">
            <div className="messages">
                {errorMessage()}
                {successMessage()}
            </div>
            <div className="form-container">
                <div className="form">
                    <h1 className="title">We want to hear from you!</h1>
                <h2 className="subtitle">Submit the below form to get in touch</h2>
                    <div className="input-container ic1">
                    <input name='name' value={formData.name} className="input" onChange={handleChange} type="text" id="username"/>
                    <div className="cut"></div>
                    <label for="name" className="placeholder">Name</label>
                    </div>
                    <div className="input-container ic2">
                    <input name='email' value={formData.email} className="input" onChange={handleChange} type="text" id="email"/>
                    <div className="cut"></div>
                    <label for="email" className="placeholder">Email</label>
                    </div>
                    <div className="input-container ic2">
                    <input name='message' value={formData.message} className="input" onChange={handleChange} type="text" id="message"/>
                    <div className="cut"></div>
                    <label for="message" className="placeholder">Message</label>
                    </div>
                    <button onClick={handleSubmit} className="submit btn" type="submit">Submit</button>
                </div>
            </div>
        </div> 
    );
}
