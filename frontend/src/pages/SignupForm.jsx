import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const SignupForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

  const initialFormState = {
    name: "",
    email: "",
    nid: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    division: "",
    district: "",
    address: "",
    password: "",
    confirmPassword: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  // Division and District Data
  const divisionDistricts = {
    Dhaka: [
      "Dhaka",
      "Gazipur",
      "Narayanganj",
      "Tangail",
      "Narsingdi",
      "Munshiganj",
      "Manikganj",
      "Faridpur",
      "Madaripur",
      "Shariatpur",
      "Rajbari",
      "Gopalganj",
      "Kishoreganj",
    ],
    Chittagong: [
      "Chittagong",
      "Cox's Bazar",
      "Bandarban",
      "Khagrachari",
      "Rangamati",
      "Comilla",
      "Chandpur",
      "Lakshmipur",
      "Noakhali",
      "Feni",
      "Brahmanbaria",
    ],
    Rajshahi: [
      "Rajshahi",
      "Chapainawabganj",
      "Naogaon",
      "Natore",
      "Pabna",
      "Sirajganj",
      "Bogra",
      "Joypurhat",
    ],
    Khulna: [
      "Khulna",
      "Bagerhat",
      "Satkhira",
      "Jessore",
      "Narail",
      "Magura",
      "Jhenaidah",
      "Chuadanga",
      "Kushtia",
      "Meherpur",
    ],
    Barisal: [
      "Barisal",
      "Pirojpur",
      "Jhalokati",
      "Bhola",
      "Patuakhali",
      "Barguna",
    ],
    Sylhet: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
    Rangpur: [
      "Rangpur",
      "Dinajpur",
      "Thakurgaon",
      "Panchagarh",
      "Nilphamari",
      "Lalmonirhat",
      "Kurigram",
      "Gaibandha",
    ],
    Mymensingh: ["Mymensingh", "Jamalpur", "Sherpur", "Netrokona"],
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Handle division change to update district options
  const handleDivisionChange = (e) => {
    const division = e.target.value;
    setFormData({
      ...formData,
      division,
      district: "", // Reset district when division changes
    });

    if (errors.division) {
      setErrors({ ...errors, division: "" });
    }
  };

  // Validate form data
  const validateForm = (step) => {
    const newErrors = {};

    // Step 1 validation (Personal Information)
    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      } else if (formData.name.trim().length < 3) {
        newErrors.name = "Name must be at least 3 characters";
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = "Please provide a valid email";
      }

      if (!formData.nid.trim()) {
        newErrors.nid = "National ID is required";
      } else if (!/^(\d{10}|\d{17})$/.test(formData.nid)) {
        newErrors.nid = "NID must be either 10 or 17 digits";
      }

      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = "Date of birth is required";
      } else {
        const dob = new Date(formData.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        if (age < 18) {
          newErrors.dateOfBirth =
            "You must be at least 18 years old to register";
        }
      }

      if (!formData.gender) {
        newErrors.gender = "Please select your gender";
      }
    }

    // Step 2 validation (Contact Information)
    if (step === 2) {
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^(\+8801|01)[0-9]{9}$/.test(formData.phone)) {
        newErrors.phone = "Please provide a valid Bangladesh phone number";
      }

      if (!formData.division) {
        newErrors.division = "Please select your division";
      }

      if (!formData.district) {
        newErrors.district = "Please select your district";
      }

      if (!formData.address.trim()) {
        newErrors.address = "Address is required";
      } else if (formData.address.trim().length < 5) {
        newErrors.address = "Address is too short";
      }
    }

    // Step 3 validation (Security Information)
    if (step === 3) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (
        !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(
          formData.password
        )
      ) {
        newErrors.password =
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    return newErrors;
  };

  // Handle next step button
  const handleNextStep = () => {
    const stepErrors = validateForm(currentStep);

    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep(currentStep + 1);
    } else {
      setErrors(stepErrors);
    }
  };

  // Handle previous step button
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate all form data before submission
    const stepErrors = validateForm(currentStep);
  
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
  
    setIsSubmitting(true);
    setSubmitMessage({ type: "", text: "" });
  
    try {
      // Make API call to register
      const response = await axios.post(
        "http://localhost:5000/api/users/signup",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          nid: formData.nid,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          division: formData.division,
          district: formData.district,
          address: formData.address,
        }
      );
  
      // Show success message
      setSubmitMessage({
        type: "success",
        text: "Registration successful! Please check your email for verification.",
      });
  
      // Reset form
      setFormData(initialFormState);
      setCurrentStep(1);
  
      // Important: Don't set the user here since we're redirecting to login
      // Instead, clear any existing user data
      localStorage.removeItem('user');
      setUser(null);
  
      // Redirect to login after short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      // Error handling code remains the same
      if (
        err.response?.data?.errors &&
        Array.isArray(err.response.data.errors)
      ) {
        // Handle validation errors from server
        const serverErrors = {};
        err.response.data.errors.forEach((error) => {
          serverErrors[error.field] = error.message;
        });
        setErrors(serverErrors);
      } else {
        // General error message
        setSubmitMessage({
          type: "error",
          text:
            err.response?.data?.message ||
            "Registration failed. Please try again.",
        });
      }
      console.error("Signup error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render different form steps
  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="animate-fadeIn">
            <h2 className="text-green-700 border-b-2 border-gray-300 pb-2 mb-6 text-xl font-bold">
              Personal Information
            </h2>

            <div className="mb-6">
              <label className="block mb-2 font-medium" htmlFor="name">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full p-3 border rounded-md transition focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.name}
                </span>
              )}
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className={`w-full p-3 border rounded-md transition focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium" htmlFor="nid">
                National ID Number
              </label>
              <input
                type="text"
                id="nid"
                name="nid"
                value={formData.nid}
                onChange={handleChange}
                placeholder="Enter your 10 or 17 digit NID number"
                className={`w-full p-3 border rounded-md transition focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 ${
                  errors.nid ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.nid && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.nid}
                </span>
              )}
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium" htmlFor="dateOfBirth">
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={`w-full p-3 border rounded-md transition focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 ${
                  errors.dateOfBirth ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.dateOfBirth && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.dateOfBirth}
                </span>
              )}
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium">Gender</label>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Male
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Female
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    checked={formData.gender === "other"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Other
                </label>
              </div>
              {errors.gender && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.gender}
                </span>
              )}
            </div>

            <div className="flex justify-end mt-8">
              <button
                type="button"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md transition transform hover:-translate-y-1 active:translate-y-0"
                onClick={handleNextStep}
              >
                Next
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="animate-fadeIn">
            <h2 className="text-green-700 border-b-2 border-gray-300 pb-2 mb-6 text-xl font-bold">
              Contact Information
            </h2>

            <div className="mb-6">
              <label className="block mb-2 font-medium" htmlFor="phone">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number (e.g., 01XXXXXXXXX)"
                className={`w-full p-3 border rounded-md transition focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.phone}
                </span>
              )}
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium" htmlFor="division">
                Division
              </label>
              <select
                id="division"
                name="division"
                value={formData.division}
                onChange={handleDivisionChange}
                className={`w-full p-3 border rounded-md transition focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 ${
                  errors.division ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Division</option>
                {Object.keys(divisionDistricts).map((division) => (
                  <option key={division} value={division}>
                    {division}
                  </option>
                ))}
              </select>
              {errors.division && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.division}
                </span>
              )}
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium" htmlFor="district">
                District
              </label>
              <select
                id="district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                disabled={!formData.division}
                className={`w-full p-3 border rounded-md transition focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 ${
                  errors.district ? "border-red-500" : "border-gray-300"
                } ${
                  !formData.division ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              >
                <option value="">Select District</option>
                {formData.division &&
                  divisionDistricts[formData.division].map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
              </select>
              {errors.district && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.district}
                </span>
              )}
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium" htmlFor="address">
                Full Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your full address"
                rows="3"
                className={`w-full p-3 border rounded-md transition focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 ${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
              ></textarea>
              {errors.address && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.address}
                </span>
              )}
            </div>

            <div className="flex justify-between mt-8">
              <button
                type="button"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-md transition transform hover:-translate-y-1 active:translate-y-0"
                onClick={handlePrevStep}
              >
                Previous
              </button>
              <button
                type="button"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md transition transform hover:-translate-y-1 active:translate-y-0"
                onClick={handleNextStep}
              >
                Next
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="animate-fadeIn">
            <h2 className="text-green-700 border-b-2 border-gray-300 pb-2 mb-6 text-xl font-bold">
              Security Information
            </h2>

            <div className="mb-6">
              <label className="block mb-2 font-medium" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className={`w-full p-3 border rounded-md transition focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.password}
                </span>
              )}
            </div>

            <div className="mb-6">
              <label
                className="block mb-2 font-medium"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={`w-full p-3 border rounded-md transition focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.confirmPassword && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <div className="bg-gray-100 p-4 rounded-md mb-6">
              <h3 className="text-base font-medium mb-2">
                Password Requirements:
              </h3>
              <ul className="list-disc pl-5 text-sm text-gray-600">
                <li>Minimum 8 characters</li>
                <li>At least one uppercase letter (A-Z)</li>
                <li>At least one lowercase letter (a-z)</li>
                <li>At least one number (0-9)</li>
                <li>At least one special character (!@#$%^&*)</li>
              </ul>
            </div>

            <div className="flex justify-between mt-8">
              <button
                type="button"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-md transition transform hover:-translate-y-1 active:translate-y-0"
                onClick={handlePrevStep}
              >
                Previous
              </button>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md transition transform hover:-translate-y-1 active:translate-y-0"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Register"}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <header className="bg-green-600 text-white text-center py-6 px-4">
        <h1 className="text-3xl font-bold mb-2">Bangladesh Citizen Portal</h1>
        <p className="text-lg opacity-90">National Registration System</p>
      </header>

      <div className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-green-600 mb-6">
            Citizen Registration
          </h1>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full mb-2 ${
                  currentStep >= 1
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                1
              </div>
              <div
                className={`text-sm ${
                  currentStep >= 1
                    ? "text-green-600 font-bold"
                    : "text-gray-600"
                }`}
              >
                Personal
              </div>
            </div>

            <div className="h-0.5 w-24 bg-gray-300 mx-2"></div>

            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full mb-2 ${
                  currentStep >= 2
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                2
              </div>
              <div
                className={`text-sm ${
                  currentStep >= 2
                    ? "text-green-600 font-bold"
                    : "text-gray-600"
                }`}
              >
                Contact
              </div>
            </div>

            <div className="h-0.5 w-24 bg-gray-300 mx-2"></div>

            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full mb-2 ${
                  currentStep >= 3
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                3
              </div>
              <div
                className={`text-sm ${
                  currentStep >= 3
                    ? "text-green-600 font-bold"
                    : "text-gray-600"
                }`}
              >
                Security
              </div>
            </div>
          </div>
        </div>

        {/* Display any success or error messages */}
        {submitMessage.text && (
          <div
            className={`mb-6 p-4 rounded-md text-center ${
              submitMessage.type === "success"
                ? "bg-green-50 text-green-700 border border-green-500"
                : "bg-red-50 text-red-700 border border-red-500"
            }`}
          >
            {submitMessage.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>{renderFormStep()}</form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-600 hover:text-green-800 font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
