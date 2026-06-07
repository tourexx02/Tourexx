import React, { useState, useEffect } from "react";
import { Car, Plus, Edit, Trash2, Search, Star, Users, X } from "lucide-react";
import toast from "react-hot-toast";
import { transportAPI } from "../services/api";
import { useAuth } from '../context/AuthContext';

const TransportOnboarding = () => {
	const { vendor } = useAuth();
	const [transports, setTransports] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [editingTransport, setEditingTransport] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterLocation, setFilterLocation] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const vehicleTypeOptions = [
		"Car (Corolla Civic)",
		"Jeep (for northern areas)",
		"Hiace / Coaster",
		"Prado / SUV / 4x4",
		"Bus (AC / Non-AC)",
		"Luxury Vans",
		"Bike / Scooter",
	];

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		address: "",
		googleMapsLocation: "",
		location: "",
		budget: "",
		vehicleOptions: [],
		capacity: "",
		rentalDuration: "",
		driver: "",
		description: "",
		amenities: [],
		images: [],
	});
	const [imagePreview, setImagePreview] = useState([]);

	// Fetch transports from API
	const fetchTransports = async () => {
		try {
			setLoading(true);
			setError("");
			// Fetch transports filtered by vendorId
			const vendorId = vendor?._id || vendor?.id;
			const response = await transportAPI.getByVendorId(vendorId);
			const vendorTransports = response.transports || response || [];
			setTransports(vendorTransports);
		} catch (error) {
			console.error("Error fetching transports:", error);
			setError("Failed to fetch transports. Please try again.");
			setTransports([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchTransports();
	}, []);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		let processedValue = value;

		// Handle boolean conversion for driver field
		if (name === "driver") {
			processedValue = value === "true";
		}

		setFormData({
			...formData,
			[name]: processedValue,
		});
	};

	const handleVehicleOptionToggle = (name) => {
		setFormData((prev) => {
			const existingIndex = (prev.vehicleOptions || []).findIndex(
				(option) => !option.isCustom && option.name === name
			);

			if (existingIndex >= 0) {
				const updated = [...prev.vehicleOptions];
				updated.splice(existingIndex, 1);
				return { ...prev, vehicleOptions: updated };
			}

			return {
				...prev,
				vehicleOptions: [
					...(prev.vehicleOptions || []),
					{ name, price: "", isCustom: false },
				],
			};
		});
	};

	const handleVehicleOptionNameChange = (index, value) => {
		setFormData((prev) => {
			const updated = [...(prev.vehicleOptions || [])];
			if (updated[index]) {
				updated[index] = { ...updated[index], name: value };
			}
			return { ...prev, vehicleOptions: updated };
		});
	};

	const handleVehicleOptionPriceChange = (index, value) => {
		setFormData((prev) => {
			const updated = [...(prev.vehicleOptions || [])];
			if (updated[index]) {
				updated[index] = { ...updated[index], price: value };
			}
			return { ...prev, vehicleOptions: updated };
		});
	};

	const handleImageChange = (e) => {
		const files = Array.from(e.target.files);
		setFormData({ ...formData, images: e.target.files });

		// Create preview URLs
		const previewUrls = files.map((file) => URL.createObjectURL(file));
		setImagePreview(previewUrls);
	};

	const removeImage = (index) => {
		const newPreviews = imagePreview.filter((_, i) => i !== index);
		setImagePreview(newPreviews);

		// Update files
		const dt = new DataTransfer();
		Array.from(formData.images).forEach((file, i) => {
			if (i !== index) dt.items.add(file);
		});
		setFormData({ ...formData, images: dt.files });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			setLoading(true);
			setError("");

			const vehicleOptionsPayload = (formData.vehicleOptions || [])
				.map((option) => ({
					name: option.name?.trim(),
					price: option.price ? parseInt(option.price, 10) || 0 : 0,
					isCustom: !!option.isCustom,
				}))
				.filter((option) => option.name);

			const uniqueVehicleOptions = [];
			const seenVehicleNames = new Set();
			vehicleOptionsPayload.forEach((option) => {
				if (!seenVehicleNames.has(option.name)) {
					seenVehicleNames.add(option.name);
					uniqueVehicleOptions.push(option);
				}
			});

			if (!uniqueVehicleOptions.length) {
				toast.error("Please add at least one vehicle option");
				setLoading(false);
				return;
			}

			if (
				!formData.location ||
				!formData.budget ||
				!formData.capacity ||
				!formData.rentalDuration ||
				formData.driver === ""
			) {
				toast.error("Please fill in all required fields");
				setLoading(false);
				return;
			}

			const amenities = (formData.amenities || [])
				.map((amenity) => amenity?.trim())
				.filter(Boolean);

			const submitData = {
				...formData,
				phone: parseInt(formData.phone, 10),
				budget: parseInt(formData.budget, 10),
				vehicleOptions: uniqueVehicleOptions,
				vehicleTypes: uniqueVehicleOptions.map((option) => option.name),
				vehicleType: uniqueVehicleOptions[0]?.name || "",
				driver: formData.driver === "true" || formData.driver === true,
				amenities,
				vendorId: vendor?._id || vendor?.id, // Include vendor ID
			};

			if (editingTransport) {
				await transportAPI.update(
					editingTransport._id || editingTransport.id,
					submitData
				);
				toast.success("Transport updated successfully!");
			} else {
				await transportAPI.create(submitData);
				toast.success("Transport added successfully! Pending admin approval.");
			}

			await fetchTransports();
			resetForm();
		} catch (error) {
			console.error("Error saving transport:", error);
			setError("Failed to save transport. Please try again.");
			toast.error("Error saving transport. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = (transport) => {
		setEditingTransport(transport);

		const existingVehicleOptions =
			Array.isArray(transport.vehicleOptions) && transport.vehicleOptions.length
				? transport.vehicleOptions
				: Array.isArray(transport.vehicleTypes) && transport.vehicleTypes.length
				? transport.vehicleTypes.map((name) => ({
						name,
						price: transport.budget || 0,
				  }))
				: transport.vehicleType
				? [{ name: transport.vehicleType, price: transport.budget || 0 }]
				: [];

		const normalizedOptions = existingVehicleOptions.map((option) => {
			const name = option.name || option.type || option;
			const price =
				option.price !== undefined
					? option.price
					: option.priceValue !== undefined
					? option.priceValue
					: transport.budget || 0;

			return {
				name,
				price: price ? String(price) : "",
				isCustom: !vehicleTypeOptions.includes(name),
			};
		});

		setFormData({
			...transport,
			phone: transport.phone?.toString() || "",
			budget: transport.budget?.toString() || "",
			vehicleOptions: normalizedOptions,
			driver:
				transport.driver === true
					? "true"
					: transport.driver === false
					? "false"
					: "",
			amenities: Array.isArray(transport.amenities) ? transport.amenities : [],
		});

		// Set existing images for preview (if any)
		if (transport.images && transport.images.length > 0) {
			const existingImageUrls = transport.images.map(
				(img) => `${import.meta.env.VITE_SERVER_BASE_URL ? import.meta.env.VITE_SERVER_BASE_URL.replace('/api', '') : 'http://localhost:8080'}/uploads/${img}`
			);
			setImagePreview(existingImageUrls);
		} else {
			setImagePreview([]);
		}

		setShowModal(true);
	};

	const handleDelete = async (transport) => {
		if (
			window.confirm("Are you sure you want to delete this transport service?")
		) {
			try {
				setLoading(true);
				setError("");

				await transportAPI.delete(transport._id || transport.id);

				// Refresh the transports list
				await fetchTransports();

				toast.success("Transport deleted successfully!");
			} catch (error) {
				console.error("Error deleting transport:", error);
				setError("Failed to delete transport. Please try again.");
				toast.error("Error deleting transport. Please try again.");
			} finally {
				setLoading(false);
			}
		}
	};

	const resetForm = () => {
		setFormData({
			name: "",
			email: "",
			phone: "",
			address: "",
			googleMapsLocation: "",
			location: "",
			budget: "",
			vehicleOptions: [],
			capacity: "",
			rentalDuration: "",
			driver: "",
			description: "",
			amenities: [],
			images: null,
		});
		setImagePreview([]);
		setEditingTransport(null);
		setShowModal(false);
		setError("");
	};

	const filteredTransports = transports.filter((transport) => {
		const searchLower = searchTerm.toLowerCase();
		const vehicleOptionsText =
			Array.isArray(transport.vehicleOptions) && transport.vehicleOptions.length
				? transport.vehicleOptions
						.map((option) => option?.name || "")
						.join(" ")
						.toLowerCase()
				: Array.isArray(transport.vehicleTypes)
				? transport.vehicleTypes.join(" ").toLowerCase()
				: (transport.vehicleType || "").toLowerCase();

		const matchesSearch =
			transport.name.toLowerCase().includes(searchLower) ||
			transport.location.toLowerCase().includes(searchLower) ||
			vehicleOptionsText.includes(searchLower);

		const matchesLocation =
			filterLocation === "" || transport.location === filterLocation;

		return matchesSearch && matchesLocation;
	});

	return (
		<div className='p-10 bg-gray-50 min-h-screen'>
			<div className='max-w-full mx-auto'>
				{/* Header */}
				<div className='mb-8'>
					<h1 className='text-3xl font-bold text-[#2F4157] mb-2'>
						Transport Onboarding
					</h1>

					{/* Error Message */}
					{error && (
						<div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
							{error}
						</div>
					)}

					<p className='text-gray-600'>
						Manage transport service listings and registrations
					</p>
				</div>

				{/* Controls */}
				<div className='bg-white rounded-xl shadow-lg p-4 mb-6 border border-gray-200'>
					<div className='flex flex-col md:flex-row gap-4 items-center justify-between'>
						<div className='flex flex-1 gap-4'>
							<div className='flex-1 relative'>
								<Search
									className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
									size={20}
								/>
								<input
									type='text'
									placeholder='Search transport services by name, location, or vehicle type...'
									className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent'
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
							</div>
							<div className='relative'>
								<select
									value={filterLocation}
									onChange={(e) => setFilterLocation(e.target.value)}
									className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent bg-white min-w-[140px]'>
									<option value=''>All Locations</option>
									<option value='Lahore'>Lahore</option>
									<option value='Islamabad'>Islamabad</option>
									<option value='Murree'>Murree</option>
									<option value='Hunza'>Hunza</option>
									<option value='Skardu'>Skardu</option>
									<option value='Swat'>Swat</option>
									<option value='Fairy Meadows'>Fairy Meadows</option>
									<option value='Neelum Valley'>Neelum Valley</option>
									<option value='Balochistan'>Balochistan</option>
									<option value='Sindh Historical Sites'>
										Sindh Historical Sites
									</option>
								</select>
							</div>
						</div>
						<button
							onClick={() => setShowModal(true)}
							className='bg-[#2F4157] text-white px-6 py-2 rounded-lg hover:bg-[#1e2d3d] transition-colors flex items-center gap-2'>
							<Plus size={20} />
							Add New Transport
						</button>
					</div>
				</div>

				{/* Transports Grid */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{filteredTransports.map((transport) => (
						<div
							key={transport.id}
							className='bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden'>
							<div className='p-4'>
								<div className='flex items-start justify-between mb-4'>
									<div className='flex items-center gap-3'>
										<div className='w-12 h-12 bg-[#d8e5ee] rounded-lg flex items-center justify-center'>
											<Car
												size={24}
												className='text-[#2F4157]'
											/>
										</div>
										<div>
											<div className="flex items-center gap-2">
												<h3 className='font-semibold text-[#2F4157] text-lg'>
													{transport.name}
												</h3>
												{transport.approved ? (
													<span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
														Approved
													</span>
												) : (
													<span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
														Pending
													</span>
												)}
											</div>
											<p className='text-gray-600 text-sm'>
												{transport.location}
											</p>
										</div>
									</div>
									<div className='flex gap-2'>
										<button
											onClick={() => handleEdit(transport)}
											className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'>
											<Edit size={16} />
										</button>
										<button
											onClick={() => handleDelete(transport)}
											className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'>
											<Trash2 size={16} />
										</button>
									</div>
								</div>

								<div className='space-y-2 mb-4'>
									<div className='flex justify-between'>
										<span className='text-gray-600'>Budget:</span>
										<span className='font-medium text-sm text-right'>
											PKR {transport.budget}
										</span>
									</div>
									<div>
										<span className='text-gray-600 text-sm font-medium block mb-1'>
											Vehicle Options:
										</span>
										<div className='text-right text-sm text-gray-900 space-y-1'>
											{Array.isArray(transport.vehicleOptions) &&
											transport.vehicleOptions.length ? (
												transport.vehicleOptions.map((option, idx) => {
													const rawPrice =
														option.price ?? option.priceValue ?? 0;
													const parsedPrice = Number(rawPrice);
													const priceDisplay = Number.isFinite(parsedPrice)
														? `PKR ${parsedPrice.toLocaleString()}`
														: "PKR 0";

													return (
														<div key={idx}>
															{option.name || option.type || "—"}
															{" - "}
															{priceDisplay}
														</div>
													);
												})
											) : Array.isArray(transport.vehicleTypes) &&
											  transport.vehicleTypes.length ? (
												transport.vehicleTypes.map((name, idx) => (
													<div key={idx}>{name}</div>
												))
											) : (
												<div>—</div>
											)}
										</div>
									</div>
									<div className='flex justify-between items-center'>
										<span className='text-gray-600'>Capacity:</span>
										<div className='flex items-center gap-1'>
											<Users
												size={16}
												className='text-gray-400'
											/>
											<span className='font-medium text-sm'>
												{transport.capacity}
											</span>
										</div>
									</div>
									<div className='flex justify-between'>
										<span className='text-gray-600'>Rental Duration:</span>
										<span className='font-medium text-sm'>
											{transport.rentalDuration}
										</span>
									</div>
									<div className='flex justify-between'>
										<span className='text-gray-600'>Driver Available:</span>
										<span className='font-medium text-sm'>
											{transport.driver ? "Yes" : "No"}
										</span>
									</div>
								</div>

								<p className='text-gray-600 text-sm mb-3'>
									{transport.address}
								</p>
								<div className='space-y-1'>
									<p className='text-xs text-gray-500'>
										Phone: {transport.phone}
									</p>
									<p className='text-xs text-gray-500'>
										Email: {transport.email}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>

				{filteredTransports.length === 0 && (
					<div className='text-center py-12'>
						{loading ? (
							<div className='flex flex-col items-center'>
								<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F4157] mb-4'></div>
								<p className='text-gray-600'>Loading transport services...</p>
							</div>
						) : (
							<div>
								<Car
									size={48}
									className='text-gray-400 mx-auto mb-4'
								/>
								<p className='text-gray-600'>
									No transport services found matching your search.
								</p>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Modal */}
			{showModal && (
				<div className='fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50'>
					<div className='bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative border border-gray-300 shadow-xl'>
						<div className='flex justify-between items-center mb-6'>
							<h2 className='text-2xl font-bold text-[#2F4157]'>
								{editingTransport
									? "Edit Transport Service"
									: "Add New Transport Service"}
							</h2>
							<button
								onClick={resetForm}
								className='text-gray-500 hover:text-gray-700 p-2 transition-colors'>
								<X size={20} />
							</button>
						</div>

						<form
							onSubmit={handleSubmit}
							className='space-y-4'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Service Name
									</label>
									<input
										type='text'
										name='name'
										value={formData.name}
										onChange={handleInputChange}
										className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent'
										required
									/>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Email
									</label>
									<input
										type='email'
										name='email'
										value={formData.email}
										onChange={handleInputChange}
										className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent'
										required
									/>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Phone Number
									</label>
									<input
										type='number'
										name='phone'
										value={formData.phone}
										onChange={handleInputChange}
										className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent'
										required
									/>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Location
									</label>
									<select
										name='location'
										value={formData.location}
										onChange={handleInputChange}
										className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent'
										required>
										<option value=''>Select Location</option>
										<option value='Lahore'>Lahore</option>
										<option value='Islamabad'>Islamabad</option>
										<option value='Murree'>Murree</option>
										<option value='Hunza'>Hunza</option>
										<option value='Skardu'>Skardu</option>
										<option value='Swat'>Swat</option>
										<option value='Fairy Meadows'>Fairy Meadows</option>
										<option value='Neelum Valley'>Neelum Valley</option>
										<option value='Balochistan'>Balochistan</option>
										<option value='Sindh Historical Sites'>
											Sindh Historical Sites
										</option>
									</select>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Budget (PKR)
									</label>
									<select
										name='budget'
										value={formData.budget}
										onChange={handleInputChange}
										className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent'
										required>
										<option value=''>Select Budget</option>
										<option value='3000'>3000</option>
										<option value='5000'>5000</option>
										<option value='8000'>8000</option>
									</select>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Vehicle Options
									</label>
									<div className='grid grid-cols-1 gap-2'>
										{vehicleTypeOptions.map((option) => {
											const isSelected = (formData.vehicleOptions || []).some(
												(vehicle) =>
													!vehicle.isCustom && vehicle.name === option
											);
											return (
												<label
													key={option}
													className='flex items-center space-x-2 text-sm text-gray-700'>
													<input
														type='checkbox'
														className='h-4 w-4 text-[#2F4157]'
														checked={isSelected}
														onChange={() => handleVehicleOptionToggle(option)}
													/>
													<span>{option}</span>
												</label>
											);
										})}
									</div>
									<div className='mt-4 space-y-3'>
										{(formData.vehicleOptions || []).map((option, index) => (
											<div
												key={`${option.name}-${index}`}
												className='grid grid-cols-1 md:grid-cols-2 gap-3 border border-gray-200 rounded-lg p-3'>
												{/* Vehicle Name */}
												<div className='flex items-center'>
													{option.isCustom ? (
														<input
															type='text'
															value={option.name}
															onChange={(e) =>
																handleVehicleOptionNameChange(
																	index,
																	e.target.value
																)
															}
															placeholder='Vehicle name'
															className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent'
														/>
													) : (
														<span className='font-medium text-gray-700'>
															{option.name}
														</span>
													)}
												</div>

												{/* Price + Remove Button */}
												<div className='flex items-center justify-between gap-3'>
													<input
														type='number'
														min='0'
														value={option.price}
														onChange={(e) =>
															handleVehicleOptionPriceChange(
																index,
																e.target.value
															)
														}
														placeholder='Price (PKR)'
														className='w-32 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-[#2F4157] focus:border-transparent'
													/>
												</div>
											</div>
										))}
									</div>

									<p className='text-xs text-gray-500 mt-2'>
										Set the price for each vehicle option. Leave blank to keep
										the price at PKR 0.
									</p>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Capacity
									</label>
									<select
										name='capacity'
										value={formData.capacity}
										onChange={handleInputChange}
										className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent'
										required>
										<option value=''>Select Capacity</option>
										<option value='1-2 Persons'>1-2 Persons</option>
										<option value='3-5 Persons'>3-5 Persons</option>
										<option value='6-10 Persons'>6-10 Persons</option>
										<option value='11-20 Persons'>11-20 Persons</option>
									</select>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Rental Duration
									</label>
									<select
										name='rentalDuration'
										value={formData.rentalDuration}
										onChange={handleInputChange}
										className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent'
										required>
										<option value=''>Select Rental Duration</option>
										<option value='One Way'>One Way</option>
										<option value='Round Trip'>Round Trip</option>
										<option value='Multiday Rental'>Multiday Rental</option>
										<option value='Hourly Booking'>Hourly Booking</option>
									</select>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Driver Available
									</label>
									<select
										name='driver'
										value={formData.driver}
										onChange={handleInputChange}
										className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent'
										required>
										<option value=''>Select Option</option>
										<option value={true}>Yes</option>
										<option value={false}>No</option>
									</select>
								</div>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Address
								</label>
								<textarea
									name='address'
									value={formData.address}
									onChange={handleInputChange}
									rows='2'
									className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent'
									required></textarea>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Google Maps Location
								</label>
								<input
									type='text'
									name='googleMapsLocation'
									value={formData.googleMapsLocation || ''}
									onChange={handleInputChange}
									placeholder='Paste Google Maps link or coordinates (e.g. 33.6844, 73.0479)'
									className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent'
								/>
								<p className='text-xs text-gray-500 mt-1'>
									Open Google Maps, drop a pin on your venue, tap Share, and paste the link here.
								</p>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Description
								</label>
								<textarea
									name='description'
									value={formData.description}
									onChange={handleInputChange}
									rows='3'
									placeholder='Enter transport service description, vehicle features, and services offered...'
									className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent'></textarea>
								<p className='text-xs text-gray-500 mt-1'>
									Optional: Describe the vehicle features, services, and what
									makes your transport service special
								</p>
							</div>

							{/* Amenities Section */}
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Amenities
								</label>
								<div className='space-y-2'>
									{formData.amenities.map((amenity, index) => (
										<div
											key={index}
											className='flex gap-2'>
											<input
												type='text'
												value={amenity}
												onChange={(e) => {
													const newAmenities = [...formData.amenities];
													newAmenities[index] = e.target.value;
													setFormData((prev) => ({
														...prev,
														amenities: newAmenities,
													}));
												}}
												placeholder='Enter amenity (e.g., AC, GPS, Music System, Luggage Space)'
												className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent'
											/>
											<button
												type='button'
												onClick={() => {
													const newAmenities = formData.amenities.filter(
														(_, i) => i !== index
													);
													setFormData((prev) => ({
														...prev,
														amenities: newAmenities,
													}));
												}}
												className='px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'>
												<X size={16} />
											</button>
										</div>
									))}
									<button
										type='button'
										onClick={() => {
											setFormData((prev) => ({
												...prev,
												amenities: [...prev.amenities, ""],
											}));
										}}
										className='flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors'>
										<Plus size={16} />
										Add Amenity
									</button>
								</div>
								<p className='text-xs text-gray-500 mt-1'>
									Add vehicle amenities like AC, GPS, Music System, etc.
								</p>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Images
								</label>
								<input
									type='file'
									name='images'
									multiple
									accept='image/*'
									onChange={handleImageChange}
									className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent'
								/>
								<p className='text-xs text-gray-500 mt-1'>
									Select multiple images (max 10)
								</p>

								{/* Image Preview */}
								{imagePreview.length > 0 && (
									<div className='mt-4'>
										<label className='block text-sm font-medium text-gray-700 mb-2'>
											Image Preview
										</label>
										<div className='grid grid-cols-3 gap-4'>
											{imagePreview.map((url, index) => (
												<div
													key={index}
													className='relative'>
													<img
														src={url}
														alt={`Preview ${index + 1}`}
														className='w-full h-24 object-cover rounded-lg border border-gray-300'
													/>
													<button
														type='button'
														onClick={() => removeImage(index)}
														className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors'>
														×
													</button>
												</div>
											))}
										</div>
									</div>
								)}
							</div>

							<div className='flex gap-4 pt-4'>
								<button
									type='submit'
									className='flex-1 bg-[#2F4157] text-white py-3 px-4 rounded-lg hover:bg-[#1e2d3d] transition-colors'>
									{editingTransport ? "Update Transport" : "Add Transport"}
								</button>
								<button
									type='button'
									onClick={resetForm}
									className='flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors'>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default TransportOnboarding;
