import React from 'react'
import SuggestionBox from '../Home/SuggestionBox'
import ProfilePhoto from "../../Images/image-one.jpg";

const Messages = () => {
  return (
    <section className='pt-16 pb-[2em]'>
        <div className="container">
            <div className="message-dashboard-holder | mx-auto flex justify-center gap-4 items-start">
              <div className="all-messages | p-4 bg-clr_base_400 max-w-[555px]">
                <h2 className='text-clr_primary_400 font-semibold text-3xl'>Messages</h2>
                <hr className="text-clr_base_100 mt-3" />
                <ul className='mt-[1em]'>
                  <li className='message-list-item | grid gap-x-2 mb-[0.8em]'>
                    <img className='message-profile-image | w-[5em] rounded-full min-w-[60px] min-[500px]:min-w-[80px]' src={ProfilePhoto} alt="Profile" />
                    <h3 className='message-profile-name | text-clr_secondary_400 font-semibold pt-[0.5em] min-[500px]:pt-[1em]'>Keylor Navas</h3>
                    <p className='message-half-message | text-clr_base_100 min-[500px]:mt-[-1.2em]'>Hello buddy, How are you</p>
                    <p className='message-last-seen | text-clr_primary_400 pt-[0.5em] min-[500px]:pt-[1em]'>7:30 pm</p>
                  </li>
                  <li className='message-list-item | grid gap-x-2 mb-[0.8em]'>
                    <img className='message-profile-image | w-[5em] rounded-full min-w-[60px] min-[500px]:min-w-[80px]' src={ProfilePhoto} alt="Profile" />
                    <h3 className='message-profile-name | text-clr_secondary_400 font-semibold pt-[0.5em] min-[500px]:pt-[1em]'>Keylor Navas</h3>
                    <p className='message-half-message | text-clr_base_100 min-[500px]:mt-[-1.2em]'>Hello buddy, How are you</p>
                    <p className='message-last-seen | text-clr_primary_400 pt-[0.5em] min-[500px]:pt-[1em]'>7:30 pm</p>
                  </li>
                  <li className='message-list-item | grid gap-x-2 mb-[0.8em]'>
                    <img className='message-profile-image | w-[5em] rounded-full min-w-[60px] min-[500px]:min-w-[80px]' src={ProfilePhoto} alt="Profile" />
                    <h3 className='message-profile-name | text-clr_secondary_400 font-semibold pt-[0.5em] min-[500px]:pt-[1em]'>Keylor Navas</h3>
                    <p className='message-half-message | text-clr_base_100 min-[500px]:mt-[-1.2em]'>Hello buddy, How are you</p>
                    <p className='message-last-seen | text-clr_primary_400 pt-[0.5em] min-[500px]:pt-[1em]'>7:30 pm</p>
                  </li>
                  <li className='message-list-item | grid gap-x-2 mb-[0.8em]'>
                    <img className='message-profile-image | w-[5em] rounded-full min-w-[60px] min-[500px]:min-w-[80px]' src={ProfilePhoto} alt="Profile" />
                    <h3 className='message-profile-name | text-clr_secondary_400 font-semibold pt-[0.5em] min-[500px]:pt-[1em]'>Keylor Navas</h3>
                    <p className='message-half-message | text-clr_base_100 min-[500px]:mt-[-1.2em]'>Hello buddy, How are you</p>
                    <p className='message-last-seen | text-clr_primary_400 pt-[0.5em] min-[500px]:pt-[1em]'>7:30 pm</p>
                  </li>
                  <li className='message-list-item | grid gap-x-2 mb-[0.8em]'>
                    <img className='message-profile-image | w-[5em] rounded-full min-w-[60px] min-[500px]:min-w-[80px]' src={ProfilePhoto} alt="Profile" />
                    <h3 className='message-profile-name | text-clr_secondary_400 font-semibold pt-[0.5em] min-[500px]:pt-[1em]'>Keylor Navas</h3>
                    <p className='message-half-message | text-clr_base_100 min-[500px]:mt-[-1.2em]'>Hello buddy, How are you</p>
                    <p className='message-last-seen | text-clr_primary_400 pt-[0.5em] min-[500px]:pt-[1em]'>7:30 pm</p>
                  </li>
                </ul>
              </div>
              <SuggestionBox />
            </div>
        </div>
    </section>
  )
}

export default Messages