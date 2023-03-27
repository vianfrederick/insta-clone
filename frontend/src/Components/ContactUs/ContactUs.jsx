import React, { useRef } from "react";
import { toast } from "react-toastify";

const ContactUs = () => {
  const name = useRef(null);
  const email = useRef(null);
  const contactContent =useRef(null);

  const notify = (errorMessage) =>
    toast.success(errorMessage, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
    });

  function submitContactForm(e) {
    e.preventDefault();
    const checkContactInputFields = [name,email,contactContent];
    let isInputFieldEmpty = false;

    checkContactInputFields.forEach((contactInputField) => {
      if (contactInputField.current.value === "") {
        isInputFieldEmpty = true;
        contactInputField.current.style.backgroundColor = "rgba(255, 0, 0, 0.1)";
      } else{
        contactInputField.current.style.backgroundColor = "#ffffff";
      }
    });

    if (isInputFieldEmpty) return;
    notify("Thanks for your feedback. We will get back to you soon");
  }

  function focusInputField(e) {
    e.target.style.backgroundColor = "#ffffff";
  }

  return (
    <section className="pt-14 mb-12">
      <div className="container">
        <div className="contactus-container | bg-clr_base_400 grid max-w-[500px] p-4 py-8 min-[440px]:p-10 mx-auto">
          <h2 className="contactus-title | relative text-4xl mb-8 text-clr_secondary_400 font-semibold">
            Contact Us
          </h2>
          <form onSubmit={submitContactForm} className="contactus-form | grid gap-y-4">
            <input
              type="text"
              ref={name}
              placeholder="Enter your name"
              onFocus={focusInputField}
            />
            <input
              type="email"
              ref={email}
              placeholder="Enter your email"
              onFocus={focusInputField}
            />
            <textarea onFocus={focusInputField} className="pt-[0.5em]" placeholder="Say something" ref={contactContent} name="contact-content" id="" cols="30" rows="10"></textarea>
            <button
              className={`contactus-button | bg-clr_primary_400 text-clr_base_400 p-2 cursor-pointer rounded-sm mb-4 mt-4 font-semibold`}
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactUs