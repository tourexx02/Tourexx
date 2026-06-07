import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For redirecting after submission
import { X, Eye, EyeOff } from "lucide-react";
import { businessAPI } from "../services/api";

const BusinessRegistration = () => {
	const [businessName, setBusinessName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [businessType, setBusinessType] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const navigate = useNavigate(); // Using useNavigate for redirection after submission

	// Disable body scroll when modal is open
	useEffect(() => {
		// Store original overflow style
		const originalStyle = window.getComputedStyle(document.body).overflow;
		// Disable scroll
		document.body.style.overflow = 'hidden';
		
		// Cleanup function to restore scroll when component unmounts
		return () => {
			document.body.style.overflow = originalStyle;
		};
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		// Validate passwords match
		if (password !== confirmPassword) {
			setError("Passwords do not match");
			setLoading(false);
			return;
		}

		// Validate password length
		if (password.length < 6) {
			setError("Password must be at least 6 characters long");
			setLoading(false);
			return;
		}

		try {
			// Prepare data for API
			const businessData = {
				businessName,
				email,
				phoneNumber: phone,
				address,
				businessType,
				password,
			};

			// Call API to create business registration
			const response = await businessAPI.create(businessData);

			if (response.success) {
				setSubmitted(true);
				// Redirect to home after 4 seconds
				setTimeout(() => {
					navigate("/");
				}, 4000);
			} else {
				setError(
					response.message || "Failed to register business. Please try again."
				);
			}
		} catch (err) {
			console.error("Error submitting business registration:", err);
			setError(
				err.response?.data?.message ||
					"Failed to register business. Please check your connection and try again."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50'>
			<div className='bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-3xl p-8 mx-4 max-h-[90vh] overflow-y-auto relative'>
				{/* Close Button */}
				<button
					onClick={() => navigate(-1)}
					className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors'
				>
					<X className='w-6 h-6' />
				</button>
				{submitted ? (
					<div className='text-center'>
						<h2 className='text-2xl font-semibold mb-4'>
							Thank you for registering!
						</h2>
						<p className='text-lg mb-4'>We will reach out to you soon.</p>
						<button
							onClick={() => navigate("/")}
							className='bg-[#577C8E] text-white px-6 py-3 rounded-lg hover:bg-[#4d6f7f] cursor-pointer'>
							Close
						</button>
					</div>
				) : (
					<div>
						{/* Top Section: Logo and Heading */}
						<div className='flex items-center space-x-4 mb-9'>
							<img
								src='/src/assets/logoBlack.png'
								alt='Tourex Logo'
								className='h-10 mb-3 '
							/>
							<h1 className='text-2xl font-bold text-gray-800'>
								Register at Tourex and boost your business!
							</h1>
						</div>

						{/* Form Section */}
						<form onSubmit={handleSubmit}>
							{/* Error Message */}
							{error && (
								<div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg'>
									{error}
								</div>
							)}

							<div className='mb-4'>
								<label
									htmlFor='businessName'
									className='block text-sm font-medium text-gray-700'>
									Business Name
								</label>
								<input
									type='text'
									id='businessName'
									value={businessName}
									onChange={(e) => setBusinessName(e.target.value)}
									className='mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
									required
								/>
							</div>

							<div className='mb-4'>
								<label
									htmlFor='email'
									className='block text-sm font-medium text-gray-700'>
									Email
								</label>
								<input
									type='email'
									id='email'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className='mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
									required
								/>
							</div>

							<div className='mb-4'>
								<label
									htmlFor='phone'
									className='block text-sm font-medium text-gray-700'>
									Phone Number
								</label>
								<input
									type='text'
									id='phone'
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									className='mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
									required
								/>
							</div>

							<div className='mb-4'>
								<label
									htmlFor='address'
									className='block text-sm font-medium text-gray-700'>
									Address
								</label>
								<input
									type='text'
									id='address'
									value={address}
									onChange={(e) => setAddress(e.target.value)}
									className='mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
									required
								/>
							</div>

							<div className='mb-4'>
								<label
									htmlFor='password'
									className='block text-sm font-medium text-gray-700'>
									Password
								</label>
								<div className='relative'>
									<input
										type={showPassword ? 'text' : 'password'}
										id='password'
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className='mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10'
										required
										minLength={6}
										placeholder='Minimum 6 characters'
									/>
									<button
										type='button'
										onClick={() => setShowPassword(!showPassword)}
										className='absolute right-3 top-1/2 transform -translate-y-1/2 mt-1 text-gray-500 hover:text-gray-700 focus:outline-none'
										tabIndex={-1}
									>
										{showPassword ? (
											<EyeOff className='w-5 h-5' />
										) : (
											<Eye className='w-5 h-5' />
										)}
									</button>
								</div>
							</div>

							<div className='mb-4'>
								<label
									htmlFor='confirmPassword'
									className='block text-sm font-medium text-gray-700'>
									Confirm Password
								</label>
								<div className='relative'>
									<input
										type={showConfirmPassword ? 'text' : 'password'}
										id='confirmPassword'
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										className='mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10'
										required
										minLength={6}
										placeholder='Re-enter your password'
									/>
									<button
										type='button'
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										className='absolute right-3 top-1/2 transform -translate-y-1/2 mt-1 text-gray-500 hover:text-gray-700 focus:outline-none'
										tabIndex={-1}
									>
										{showConfirmPassword ? (
											<EyeOff className='w-5 h-5' />
										) : (
											<Eye className='w-5 h-5' />
										)}
									</button>
								</div>
							</div>

							<div className='mb-4'>
								<label className='block text-sm font-medium text-gray-700'>
									Business Type
								</label>
								<div className='flex flex-col mt-2'>
									{["Hotel", "Restaurant", "Transport", "Trip Organizer"].map(
										(type) => (
											<label
												key={type}
												className='flex items-center mb-2'>
												<input
													type='radio'
													name='businessType'
													value={type}
													checked={businessType === type}
													onChange={() => setBusinessType(type)}
													className='mr-2'
												/>
												{type}
											</label>
										)
									)}
								</div>
							</div>

							<button
								type='submit'
								disabled={loading}
								className={`w-full px-6 py-3 rounded-lg text-white font-medium transition-colors ${
									loading
										? "bg-gray-400 cursor-not-allowed"
										: "bg-[#577C8E] hover:bg-[#4d6f7f] cursor-pointer"
								}`}>
								{loading ? "Submitting..." : "Submit"}
							</button>
						</form>
					</div>
				)}
			</div>
		</div>
	);
};

export default BusinessRegistration;
