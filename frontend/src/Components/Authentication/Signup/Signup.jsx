import React, { useRef, useState, useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
import baseURL from "../../../url";

const Signup = () => {
  const navigate = useNavigate();
  const name = useRef(null);
  const email = useRef(null);
  const password = useRef(null);
  const confirm_password = useRef(null);

  const [isChecked, setIsChecked] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [showErrorBox, setShowErrorBox] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setIsButtonDisabled(!isChecked);
  }, [isChecked]);

  function focusInputField(e) {
    e.target.style.backgroundColor = "#ffffff";
  }

  async function signupNewUser(e) {
    e.preventDefault();
    const checkInputFields = [name, email, password, confirm_password];
    let isInputFieldEmpty = false;

    checkInputFields.forEach((inputField) => {
      if (inputField.current.value === "") {
        isInputFieldEmpty = true;
        inputField.current.style.backgroundColor = "rgba(255, 0, 0, 0.1)";
      } else {
        inputField.current.style.backgroundColor = "#ffffff";
      }
    });

    if (isInputFieldEmpty) return;

    if (password.current.value !== confirm_password.current.value) {
      password.current.style.backgroundColor = "rgba(255, 0, 0, 0.1)";
      confirm_password.current.style.backgroundColor = "rgba(255, 0, 0, 0.1)";
    } else {
      setShowErrorBox(false);
      setErrorMessage("");
      try {
        const response = await axios.post(`${baseURL}/signup`, {
          name: name.current.value,
          email: email.current.value,
          password: password.current.value,
          isChecked,
        });
        if (response.data.status === "success") {
          navigate("/login");
        } else if(response.data.status === "success") {
          setShowErrorBox(true);
          setErrorMessage(response.data.message);
        }
      } catch (error) {
        setShowErrorBox(true);
        setErrorMessage("Something went wrong. Please try again");
      }
    }
  }

  function handleCheckboxChange(event) {
    setIsChecked(event.target.checked);
  }

  return (
    <section className="pt-14 mb-12">
      <div className="container">
        <div className="signup-container | bg-clr_base_400 grid max-w-[400px] p-4 py-8 min-[440px]:p-10 mx-auto">
          <h2 className="signup-title | relative text-4xl mb-8 text-clr_secondary_400 font-semibold">
            Sign up
          </h2>
          {showErrorBox && (
            <p className="error-box | bg-[#FFC107] text-clr_base_400">
              {errorMessage}
            </p>
          )}

          <form onSubmit={signupNewUser} className="signup-form | grid gap-y-4">
            <input
              ref={name}
              type="text"
              placeholder="Enter your name"
              onFocus={focusInputField}
            />
            <input
              type="email"
              ref={email}
              placeholder="Enter your email"
              onFocus={focusInputField}
            />
            <input
              type="password"
              ref={password}
              placeholder="Enter password"
              onFocus={focusInputField}
            />
            <input
              type="password"
              ref={confirm_password}
              placeholder="Confirm password"
              onFocus={focusInputField}
            />
            <div className="mb-4">
              <input
                className="checkbox | relative"
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                id="terms"
              />
            </div>
            <button
              className={`signup-button ${
                isButtonDisabled ? "disabled" : "enabled"
              } | bg-clr_primary_400 text-clr_base_400 p-2 cursor-pointer rounded-sm mb-4 font-semibold`}
              type="submit"
              disabled={isButtonDisabled}
            >
              Sign up
            </button>
          </form>
          <p className="text-clr_secondary_400">
            Have an account ?
            <Link
              className="login-text ml-1 text-clr_primary_400 font-semibold"
              to="/login"
            >
              Login now
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Signup;
