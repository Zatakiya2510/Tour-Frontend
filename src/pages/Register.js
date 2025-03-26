import React, { useState, useContext } from "react";
import "../styles/register.css";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import registerImg from "../assets/images/register.png";
import userIcon from "../assets/images/user.png";
import { AuthContext } from "./../context/AuthContext.js";
import { BASE_URL } from "./../utils/config.js";
import Swal from "sweetalert2";

const Register = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    otp: "",
    username: "",
    password: "",
    role: "user",
  });
  
  const [step, setStep] = useState(1); // Step 1: Email -> Step 2: OTP -> Step 3: Username & Password
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // ✅ **Step 1: Send OTP**
   const sendOTP = async () => {
    console.log("Sending OTP to:", `${BASE_URL}/auth/send-otp`);
  
    try {
      const res = await fetch(`${BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: credentials.email }),
      });
  
      const result = await res.json();
      console.log("API Response:", result);  // 🔍 Debugging log
  
      if (res.ok) {
        Swal.fire("Success", "OTP sent to your email", "success");
        setStep(2); // Move to OTP verification step
      } else {
        Swal.fire("Error", result.message, "error");
      }
    } catch (err) {
      console.error("Error:", err);  // 🔍 Debugging log
      Swal.fire("Error", "Failed to send OTP. Try again.", "error");
    }
  };
  // ✅ **Step 2: Verify OTP**
  const verifyOTP = async () => {
    if (!credentials.otp) {
      Swal.fire("Error", "Please enter the OTP", "error");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: credentials.email, otp: credentials.otp }),
      });

      const result = await res.json();
      if (res.ok) {
        Swal.fire("Success", "OTP Verified. Proceed to registration.", "success");
        setStep(3); // Move to Username & Password step
      } else {
        Swal.fire("Error", result.message, "error");
      }
    } catch (err) {
      Swal.fire("Error", "OTP verification failed. Try again.", "error");
    }
  };

  // ✅ **Step 3: Register User**
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      Swal.fire("Error", "All fields are required", "error");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const result = await res.json();
      if (res.ok) {
        dispatch({ type: "REGISTER_SUCCESS" });
        Swal.fire("Success", "Your account has been created!", "success").then(() => {
          navigate("/login");
        });
      } else {
        Swal.fire("Error", result.message, "error");
      }
    } catch (err) {
      Swal.fire("Error", "Registration failed. Try again.", "error");
    }
  };

  return (
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

                {step === 1 && (
                  <>
                    <FormGroup>
                      <input
                        type="email"
                        placeholder="Enter Email"
                        id="email"
                        required
                        value={credentials.email}
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <Button className="btn secondary__btn auth__btn" onClick={sendOTP}>
                      Send OTP
                    </Button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <FormGroup>
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        id="otp"
                        required
                        value={credentials.otp}
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <Button className="btn secondary__btn auth__btn" onClick={verifyOTP}>
                      Verify OTP
                    </Button>
                  </>
                )}

                {step === 3 && (
                  <Form onSubmit={handleRegister}>
                    <FormGroup>
                      <input
                        type="text"
                        placeholder="Enter Username"
                        id="username"
                        required
                        value={credentials.username}
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <input
                        type="password"
                        placeholder="Enter Password"
                        id="password"
                        required
                        value={credentials.password}
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <Button className="btn secondary__btn auth__btn">
                      Create Account
                    </Button>
                  </Form>
                )}

                <p>
                  Already have an Account? <Link to="/login">Login</Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Register;
