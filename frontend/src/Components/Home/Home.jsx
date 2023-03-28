import React from "react";
import {useNavigate} from "react-router-dom";

import IntroImage from "../../Images/iphone6.png";
import Bizinsider from "../../Images/bizinsider.png";
import Mashable from "../../Images/mashable.png";
import TechCrunch from "../../Images/TechCrunch.png";
import TNW from "../../Images/tnw.png";

import {
  AiFillHeart,
  AiFillCheckCircle,
  AiFillFire,
  AiFillBulb,
} from "react-icons/ai";

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <section className="py-16 bg-clr_base_10 md:pt-[10em]">
        <div className="container">
          <div className="grid gap-y-14 md:grid-cols-2 min-[1146px]:gap-x-[10em]">
            <div className="content | text-center md:text-left">
              <h1 className="min-[1146px]:leading-[1.1] mx-auto max-w-[337px] text-5xl mb-6 text-clr_secondary_400 md:mx-0 min-[1146px]:text-6xl min-[1146px]:max-w-[530px]">
                Meet new and interesting people online
              </h1>
              <p className="mx-auto max-w-[337px] text-clr_base_100 md:mx-0">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <button onClick={()=>navigate("/signup")} className="logged-out-home-page-button | cursor-pointer px-4 py-[0.7em] mt-14 rounded-full bg-clr_secondary_400 text-clr_base_400 text-base">
                Get Started
              </button>
            </div>
            <div className="mx-auto md:mx-0">
              <img
                className="intro-img | min-w-[245px] w-[60%] mx-auto md:w-[75%] md:ml-auto md:mr-0 lg:ml-0"
                src={IntroImage}
                alt="Iphone6"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-clr_primary_400 py-16 px-10 sm:py-[10em]">
        <div className="container">
          <div className="grid gap-y-16 justify-center sm:grid-cols-2 gap-x-8 min-[1180px]:flex min-[1180px]:justify-around">
            <div className="bg-clr_base_400 p-6 max-w-[264px] mx-auto">
              <AiFillCheckCircle className="text-6xl mb-5 mx-auto text-clr_primary_400" />
              <p className="text-center text-clr_secondary_400">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
              </p>
            </div>
            <div className="bg-clr_base_400 p-6 max-w-[264px] mx-auto">
              <AiFillFire className="text-6xl mb-5 mx-auto text-clr_primary_400" />
              <p className="text-center text-clr_secondary_400">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
              </p>
            </div>
            <div className="bg-clr_base_400 p-6 max-w-[264px] mx-auto">
              <AiFillHeart className="text-6xl mb-5 mx-auto text-clr_primary_400" />
              <p className="text-center text-clr_secondary_400">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
              </p>
            </div>
            <div className="bg-clr_base_400 p-6 max-w-[264px] mx-auto">
              <AiFillBulb className="text-6xl mb-5 mx-auto text-clr_primary_400" />
              <p className="text-center text-clr_secondary_400">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-clr_base_10 py-16">
        <div className="container text-center">
          <h1 className="max-w-[663px] mx-auto leading-[1.1] text-clr_secondary_400 text-5xl">
            Connect with your favourite people Today.
          </h1>
          <button onClick={()=>navigate("/signup")} className="logged-out-home-page-button | cursor-pointer px-4 py-[0.7em] mt-14 rounded-full bg-clr_secondary_400 text-clr_base_400 text-base">
            Get Started
          </button>
          <div className="sponsors-container | grid sm:grid-cols-2 sm:gap-8 justify-center items-center mt-[4em] lg:flex">
            <div>
              <img className="sm:mx-auto" src={Bizinsider} alt="Bizinsider" />
            </div>
            <div>
              <img className="mt-8 sm:mx-auto" src={Mashable} alt="Mashable" />
            </div>
            <div>
              <img
                className="mt-8 sm:mx-auto"
                src={TechCrunch}
                alt="TechCrunch"
              />
            </div>
            <div>
              <img className="mt-8 sm:mx-auto" src={TNW} alt="TNW" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
