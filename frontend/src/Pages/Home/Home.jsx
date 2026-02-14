import React from "react";
import './Home.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay, Parallax } from "swiper/modules";
import NavigationBar from "../../Components/NavigationBar/NavigationBar";


function Home() {
  return (
    <div className="header_wrapper">

      <NavigationBar />

      <Swiper
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 2500 }}
        parallax={true}
        speed={1500}
        modules={[Autoplay, Parallax]}
        className="swiper"
      >
        <SwiperSlide>
          <div className="Header_slidee slide1">
            <div className="content">
              <small data-swiper-parallax="-200">W.P.Rashmika Harshamal</small>
              <h2 data-swiper-parallax="-300">
                Map your <span>Future</span> Travels<br />
                <span>interesting</span> and <span>well organized</span>
              </h2>
              <p data-swiper-parallax="-400">Call Now me more details<span>9876543210</span></p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="Header_slidee slide2">
            <div className="content">
              <small data-swiper-parallax="-200">W.P.Rashmika Harshamal</small>
              <h2 data-swiper-parallax="-300">
                Map your <span>Future</span> Travels<br />
                <span>interesting</span> and <span>well organized</span>
              </h2>
              <p data-swiper-parallax="-400">Call Now me more details<span>9876543210</span></p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="Header_slidee slide3">
            <div className="content">
              <small data-swiper-parallax="-200">W.P.Rashmika Harshamal</small>
              <h2 data-swiper-parallax="-300">
                Map your <span>Future</span> Travels<br />
                <span>interesting</span> and <span>well organized</span>
              </h2>
              <p data-swiper-parallax="-400">Call Now me more details<span>9876543210</span></p>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default Home;
