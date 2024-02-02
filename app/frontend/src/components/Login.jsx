import React, { useState } from "react";
import { loginUser } from '../util/helpers';
import { useNavigate } from 'react-router-dom';


export default function Login() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData({...userData, [name]: value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    if (userData.username === '' || userData.password === '') {
      setError(true);
      return;
    }
    setError(false);
    const response = await loginUser(userData);
    if(response.error){
      setError(response.message)
      return;
    }
    navigate("/");
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
  };

  return (
    <div className="container">
      <div className="messages">
        {errorMessage()}
      </div>
      <div className="form-container">
        <div className="form">
          <h1 className="title">Welcome!</h1>
          <h2 className="subtitle">Login to your account</h2>
          <div className="input-container ic1">
            <input name='username' value={userData.username} className="input" onChange={handleChange} type="text" id="username"/>
            <div className="cut"></div>
            <label for="username" className="placeholder">Username</label>
          </div>
          <div className="input-container ic2">
            <input name='password' value={userData.password} className="input" onChange={handleChange} type="PASSWORD" id="password"/>
            <div className="cut"></div>
            <label for="password" className="placeholder">Password</label>
          </div>
          <button onClick={handleSubmit} className="submit btn" type="submit">Submit</button>
        </div>
      </div>
    </div>
  );
}

  