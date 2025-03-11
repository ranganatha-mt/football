import  { useState } from 'react';
import { Link } from "react-router-dom"
import { useAuthStore } from '../store/authUser';
const SignUpPage = () => {
    const [userType, setUserType] = useState('');
    const [formData, setFormData] = useState({
        full_name: '',
        contact_phone: '',
        contact_email: '',
        password: '',
        profile_picture: null,
        age: '',
        gender: '',
        position: '',
        expertise_level: '',
        organization_club: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: files[0]
        }));
    };

    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
    };

    const {signup} = useAuthStore();

    const handleSignUp = (e) => {
        e.preventDefault();
        const finalFormData = {
            ...formData,
            user_type:userType // Adding userType explicitly to the formData
        };
        const data = new FormData();

    // Append all form fields and the file to FormData
    for (let key in finalFormData) {
        data.append(key, finalFormData[key]);
      }

        signup(data)
        
    };
  return (
    <div className="min-h-screen h-full w-full football-bg">
        <header className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <Link to={"/"}>
        <img src="/proplay_logo.png" alt="ProPlay" className="h-20 w-auto" />
        </Link>
        </header>
        
        <div className="flex justify-center items-center mt-10 mx-3">
            <div className="w-full max-w-2xl p-8 space-y-6 bg-black/60 rounded-lg shadow-md">
                <h1 className="text-center text-white text-2xl font-bold mb-4">
                    Sign Up
                </h1>
                <form className="grid grid-cols-2 gap-4" onSubmit={handleSignUp}>
                    <div>
                        <label htmlFor="full_name" className="text-sm font-medium text-gray-300 block">
                           Full Name
                        </label>
                        <input required type="text" autoComplete="off" className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                        placeholder="Enter Your FullName" id="full_name" name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="contact_phone" className="text-sm font-medium text-gray-300 block">
                        Phone Number
                        </label>
                        <input type="text" required autoComplete="off"  className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                        placeholder="Enter Your Phone" id="contact_phone" name="contact_phone"
                        value={formData.contact_phone}
                        onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="contact_email" className="text-sm font-medium text-gray-300 block">
                        Email
                        </label>
                        <input type="email" required autoComplete="off"  className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                        placeholder="you@example.com" id="contact_email" name="contact_email"
                        value={formData.contact_email}
                        onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-gray-300 block">
                        Password
                        </label>
                        <input type="password" required autoComplete="off"  className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                        placeholder="*******" id="password" name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="profile_picture" className="text-sm font-medium text-gray-300 block">
                            Profile Picture
                        </label>
                        <input
                            type="file"
                            className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                            id="profile_picture"
                            name="profile_picture"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="age" className="text-sm font-medium text-gray-300 block">
                            Age
                        </label>
                        <input
                            type="number"
                            min="8"
                            required
                            autoComplete="off"
                            className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                            placeholder="Enter Your Age"
                            id="age"
                            name="age"
                            value={formData.age}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        {/* <label className="text-sm font-medium text-gray-300 block">Gender</label> */}
                        <div className="flex gap-4">
                            <label className="flex items-center text-white cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Male"
                                    className="mr-2"
                                    onChange={handleInputChange}
                                    checked={formData.gender === 'Male'}
                                />{' '}
                                Male
                            </label>
                            <label className="flex items-center text-white cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Female"
                                    className="mr-2"
                                    onChange={handleInputChange}
                                    checked={formData.gender === 'Female'}
                                />{' '}
                                Female
                            </label>                           
                        </div>
                    </div>

                    <div>
                        {/* <label className="text-sm font-medium text-gray-300 block">User Type</label> */}
                        <div className="flex gap-4">
                            <label className="flex items-center text-white cursor-pointer">
                                <input
                                    type="radio"
                                    name="user_type"
                                    value="Player"
                                    className="mr-2"
                                    onChange={handleUserTypeChange}
                                    checked={userType === 'Player'}
                                />{' '}
                                Player
                            </label>
                            <label className="flex items-center text-white  cursor-pointer">
                                <input
                                    type="radio"
                                    name="user_type"
                                    value="Reviewer"
                                    className="mr-2"
                                    onChange={handleUserTypeChange}
                                    checked={userType === 'Reviewer'}
                                />{' '}
                                Reviewer
                            </label>
                            {/* <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="userType"
                                    value="Admin"
                                    className="mr-2"
                                    onChange={handleUserTypeChange}
                                    checked={userType === 'Admin'}
                                />{' '}
                                Admin
                            </label> */}
                        </div>
                    </div>

                    {userType === 'Player' && (
                        <div>
                            <label htmlFor="position" className="text-sm font-medium text-gray-300 block">
                                Position
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                                placeholder="Enter Your Position"
                                id="position"
                                name="position"
                                value={formData.position}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}

                    {/* Expertise Level (Only visible if User Type is Reviewer) */}
                    {userType === 'Reviewer' && (
                        <div>
                            <label htmlFor="expertise_level" className="text-sm font-medium text-gray-300 block">
                                Expertise Level
                            </label>
                            <select
                                className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-black text-white focus:outline-none focus:ring"
                                id="expertise_level"
                                name="expertise_level"
                                value={formData.expertise_level}
                                onChange={handleInputChange}
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Expert">Expert</option>
                            </select>
                        </div>
                    )}

                    {/* Organization/Club (Only visible if User Type is Reviewer) */}
                    {userType === 'Reviewer' && (
                        <div>
                            <label htmlFor="organization_club" className="text-sm font-medium text-gray-300 block">
                                Organization/Club
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                                placeholder="Enter Organization/Club"
                                id="organization_club"
                                name="organization_club"
                                value={formData.organization_club}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}

                    <div className="col-span-2 text-center">
                    <button                    
                        type="submit"
                        className="w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700">                        
                        Sign Up
                        </button>
                    </div>
                    
                </form>
                <div className='text-center text-gray-400'>
                    Already a member?{" "}
                    <Link to={"/login"} className='text-red-500 hover:underline'>
                        Sign In
                    </Link>
                </div>

            </div>

        </div>

    </div>
  )
}

export default SignUpPage