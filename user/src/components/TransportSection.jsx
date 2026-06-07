import React from "react";
import transportMainImage from "../assets/Transport.jpeg";

const TransportSection = () => {
  return (
		<section className='pt-5 pb-15 px-5 bg-[#F4EFEB]'>
			<div className='max-w-6xl mx-auto flex gap-12 items-center lg:flex-row flex-col lg:gap-12 md:gap-8 gap-8'>
				{/* Left Section - Text and Button */}
				<div className='flex-1 lg:pl-8 pl-0'>
					<h2 className='font-sans text-6xl font-bold text-[#4F7F96] mb-5 leading-tight lg:text-6xl md:text-4xl sm:text-3xl text-3xl'>
						Reliable Transport
						<br />
						Services.
					</h2>
					<p className='font-serif text-xl leading-relaxed text-[#383737] mb-8 lg:text-xl md:text-lg text-base'>
						Get around with ease using our trusted transport partners. From
						airport transfers to city tours, find the perfect vehicle for your
						journey with professional drivers and competitive rates.
					</p>
					<a href='/services/transport'>
						<button className='font-sans text-base font-semibold bg-[#2F4157] text-white border-none rounded-md py-3.5 px-7 cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] md:w-auto w-full justify-center'>
							Find Your Transport
						</button>
					</a>
				</div>

				{/* Right Section - Single Image */}
				<div className='flex-1 flex justify-center items-center'>
					<img
						src={transportMainImage}
						alt='Reliable Transport Services'
						className='max-w-full h-auto rounded-xl block'
					/>
				</div>
			</div>
		</section>
	);
};

export default TransportSection;
