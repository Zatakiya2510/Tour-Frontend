import React, { useState, useContext } from "react";
import "../styles/register.css";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import registerImg from "../assets/images/register.png";
import userIcon from "../assets/images/user.png";
import { AuthContext } from "./../context/AuthContext.js";
import { BASE_URL } from "./../utils/config.js";
import Swal from 'sweetalert2';

const Register = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id == "username") {
      // Validate username (no spaces)
      if (/\s/.test(value)) return; // if username contains space, do not update state
    }

    if (id == "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) return; // if email is invalid, do not update state
    }

    if (id == "password") {
      // Validate password (8-12 characters, capital, special character)
      // You can implement your own validation logic here
      if (value.length < 8 || value.length > 12) return; // if password length is invalid, do not update state
    }

    setCredentials((prev) => ({ ...prev, [id]: value }));
  };



  const handleClick = async (e) => {
    e.preventDefault();

    // Validate credentials before making API call
    if (credentials.username.trim() == "" || credentials.email.trim() == "" || credentials.password.trim() == "") {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      const result = await res.json();

      if (res.ok) {
        dispatch({ type: "REGISTER_SUCCESS" });
        // Show success message using SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'Your account has been created successfully!',
        }).then(() => {
          navigate("/login");
        });
      } else {
        // Handle error response
        alert(result.message); // Display error message to the user
      }
    } catch (err) {
      // Handle network or other errors
      alert("Failed to create account. Please try again later.");
    }
  };


  return (
    <>
      <section>
        <Container>
          <Row>
            <Col lg="8" className="m-auto">
              <div className="register__contain d-flex justify-content-between">
                <div className="register__img">
                  <img src={registerImg} alt="register" />
                </div>

                <div className="register__form">
                  <div className="user">
                    <img src={userIcon} alt="user" />
                  </div>
                  <h2>Register</h2>

                  <Form onSubmit={handleClick}>
                    <FormGroup>
                      <input
                        type="text"
                        placeholder="Enter UserName"
                        required
                        id="username"
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <input
                        type="email"
                        placeholder="Enter E-mail"
                        required
                        id="email"
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <input
                        type="password"
                        placeholder="Enter Password"
                        required
                        id="password"
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <Button className="btn secondary__btn auth__btn">
                      Create Account
                    </Button>
                  </Form>
                  <p>
                    Already have an Account? <Link to="/login">Login</Link>
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Register;
