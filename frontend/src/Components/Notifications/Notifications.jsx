import React from "react";
import SuggestionBox from "../Home/SuggestionBox";
import ProfilePhoto from "../../Images/image-one.jpg";
import { Link } from "react-router-dom";

const Notifications = () => {
  return (
    <section className="pt-16 pb-[2em]">
      <div className="container">
        <div className="notifications-dashboard-holder | mx-auto flex justify-center gap-4 items-start">
          <div className="all-notifications bg-clr_base_400 p-4 max-w-[555px]">
            <h2 className="text-clr_primary_400 font-semibold text-3xl">
              Notifications
            </h2>
            <hr className="text-clr_base_100 mt-3" />
            <ul className="mt-[1em]">
              <li className="notifications-list-item">
                <Link className="flex items-center gap-3 p-[0.5em]" to="/posts/individualpost">
                  <img
                    className="w-[3em] min-[400px]:w-[5em] rounded-full min-[500px]:min-w-[80px]"
                    src={ProfilePhoto}
                    alt="Profile"
                  />
                  <p className="text-[0.9rem] min-[400px]:text-base">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt
                  </p>
                </Link>
              </li>
              <li className="notifications-list-item">
                <Link className="flex items-center gap-3 p-[0.5em]" to="/posts/individualpost">
                  <img
                    className="w-[3em] min-[400px]:w-[5em] rounded-full min-[500px]:min-w-[80px]"
                    src={ProfilePhoto}
                    alt="Profile"
                  />
                  <p className="text-[0.9rem] min-[400px]:text-base">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt
                  </p>
                </Link>
              </li>
              <li className="notifications-list-item">
                <Link className="flex items-center gap-3 p-[0.5em]" to="/posts/individualpost">
                  <img
                    className="w-[3em] min-[400px]:w-[5em] rounded-full min-[500px]:min-w-[80px]"
                    src={ProfilePhoto}
                    alt="Profile"
                  />
                  <p className="text-[0.9rem] min-[400px]:text-base">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt
                  </p>
                </Link>
              </li>
              <li className="notifications-list-item">
                <Link className="flex items-center gap-3 p-[0.5em]" to="/posts/individualpost">
                  <img
                    className="w-[3em] min-[400px]:w-[5em] rounded-full min-[500px]:min-w-[80px]"
                    src={ProfilePhoto}
                    alt="Profile"
                  />
                  <p className="text-[0.9rem] min-[400px]:text-base">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt
                  </p>
                </Link>
              </li>
              <li className="notifications-list-item">
                <Link className="flex items-center gap-3 p-[0.5em]" to="/posts/individualpost">
                  <img
                    className="w-[3em] min-[400px]:w-[5em] rounded-full min-[500px]:min-w-[80px]"
                    src={ProfilePhoto}
                    alt="Profile"
                  />
                  <p className="text-[0.9rem] min-[400px]:text-base">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt
                  </p>
                </Link>
              </li>
              <li className="notifications-list-item">
                <Link className="flex items-center gap-3 p-[0.5em]" to="/posts/individualpost">
                  <img
                    className="w-[3em] min-[400px]:w-[5em] rounded-full min-[500px]:min-w-[80px]"
                    src={ProfilePhoto}
                    alt="Profile"
                  />
                  <p className="text-[0.9rem] min-[400px]:text-base">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt
                  </p>
                </Link>
              </li>
              <li className="notifications-list-item">
                <Link className="flex items-center gap-3 p-[0.5em]" to="/posts/individualpost">
                  <img
                    className="w-[3em] min-[400px]:w-[5em] rounded-full min-[500px]:min-w-[80px]"
                    src={ProfilePhoto}
                    alt="Profile"
                  />
                  <p className="text-[0.9rem] min-[400px]:text-base">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt
                  </p>
                </Link>
              </li>
              <li className="notifications-list-item">
                <Link className="flex items-center gap-3 p-[0.5em]" to="/posts/individualpost">
                  <img
                    className="w-[3em] min-[400px]:w-[5em] rounded-full min-[500px]:min-w-[80px]"
                    src={ProfilePhoto}
                    alt="Profile"
                  />
                  <p className="text-[0.9rem] min-[400px]:text-base">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt
                  </p>
                </Link>
              </li>
              <li className="notifications-list-item">
                <Link className="flex items-center gap-3 p-[0.5em]" to="/posts/individualpost">
                  <img
                    className="w-[3em] min-[400px]:w-[5em] rounded-full min-[500px]:min-w-[80px]"
                    src={ProfilePhoto}
                    alt="Profile"
                  />
                  <p className="text-[0.9rem] min-[400px]:text-base">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt
                  </p>
                </Link>
              </li>
              <li className="notifications-list-item">
                <Link className="flex items-center gap-3 p-[0.5em]" to="/posts/individualpost">
                  <img
                    className="w-[3em] min-[400px]:w-[5em] rounded-full min-[500px]:min-w-[80px]"
                    src={ProfilePhoto}
                    alt="Profile"
                  />
                  <p className="text-[0.9rem] min-[400px]:text-base">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt
                  </p>
                </Link>
              </li>
            </ul>
          </div>
          <SuggestionBox />
        </div>
      </div>
    </section>
  );
};

export default Notifications;
