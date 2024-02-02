import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser, loginUser } from "../util/helpers";

export default function Registration() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+\.[a-zA-Z_.+-]+$/, "gm");

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData({...userData, [name]: value});
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setEmailError(false);
    setPasswordError(false);
    if (userData.first === '' || userData.last === '' || userData.email === '' || userData.username === '' || userData.password === '') {
      setError(true);
      return;
    }
    if (!emailRegex.test(userData.email)){
      setEmailError(true);
      return;
    }
    if (userData.password.length < 6 || userData.password.length > 20){
      setPasswordError(true);
      return;
    }
    setError(false);
    setEmailError(false);
    setPasswordError(false);
    const response = await createUser(userData)
    if(response.error){
      setError(response.message)
      return;
    }
    await loginUser({username: userData.username, password: userData.password})
    setSubmitted(true);
    navigate("/");
  }

  const successMessage = () => {
    return (
      <div
        className="success"
        style={{
          display: submitted ? '' : 'none',
        }}>
        <h1>User {userData.username} successfully registered!!</h1>
      </div>
    );
  };

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
  };

  const emailErrorMessage = () => {
    return (
      <div
        className="error"
        style={{
          display: emailError ? '' : 'none',
        }}>
        <h1>Please enter valid email</h1>
      </div>
    );
  };

  const passwordErrorMessage = () => {
    return (
      <div
        className="error"
        style={{
          display: passwordError ? '' : 'none',
        }}>
        <h1>Password must be greater than 5 digits and less than 20</h1>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="messages">
        {passwordErrorMessage()}
        {emailErrorMessage()}
        {errorMessage()}
        {successMessage()}
      </div>
      <div className="form-container">
        <div className="form">
          <h1 className="title">User Registration</h1>
          <h2 className="subtitle">Create your account</h2>
          <div className="input-container ic1">
            <input name="first_name" value={userData.first_name} className="input" onChange={handleChange} type="text" id="first_name"/>
            <div className="cut"></div>
            <label for="first_name" className="placeholder">First name</label>
          </div>
          <div className="input-container ic2">
            <input name="last_name" value={userData.last_name} className="input" onChange={handleChange} type="text" id="last_name"/>
            <div className="cut"></div>
            <label for="last_name" className="placeholder">Last name</label>
          </div>
          <div className="input-container ic2">
            <input name='email' value={userData.email} className="input" onChange={handleChange} type="email" id="email"/>
            <div className="cut"></div>
            <label for="email" className="placeholder">Email</label>
          </div>
          <div className="input-container ic2">
            <input name='username' value={userData.username} className="input" onChange={handleChange} type="text" id="username"/>
            <div className="cut"></div>
            <label for="username" className="placeholder">Username</label>
          </div>
          <div className="input-container ic2">
            <input name='password' value={userData.password} className="input" onChange={handleChange} type="PASSWORD" id="password"/>
            <div className="cut"></div>
            <label for="password" className="placeholder">Password</label><br/>
            <label className='password check'> show password
              <input 
                type="checkbox" 
                name='show' 
                className="checkbox"
                onChange={() => {setShowPassword(!showPassword)
                }}/>
              <span class="checkmark"></span>
            </label>
            <div style={{display: showPassword ? '' : 'none',}}className="password">
              <p>{userData.password}</p>
            </div>
          </div>
          <button onClick={handleSubmit} className="submit btn" type="submit">Submit</button>
        </div>
      </div>
    </div>
  );
}