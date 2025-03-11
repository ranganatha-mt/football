import { useState } from 'react';
import { Link } from "react-router-dom";
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authUser';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [useSignInCode, setUseSignInCode] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [otpRequested, setOtpRequested] = useState(false); // Track OTP request
    const [isOtpVerified, setIsOtpVerified] = useState(false); // Track OTP verification

    const { login, requestOtp, verifyOtp } = useAuthStore();

    const handleLogin = (e) => {
        e.preventDefault();
        const finalFormData = {
            password,
            username, 
        };

        if (useSignInCode) {
            if (isOtpVerified) {
                login(finalFormData);  // Proceed with login after OTP is verified
            } else {
                verifyOtp(username, otp).then((isSuccess) => {
                    if (isSuccess) {
                        setIsOtpVerified(true); // Show success message or proceed after OTP verification
                    } 
                    else
                    {
                        setIsOtpVerified(false);
                    }
                }).catch(() => {
                    setIsOtpVerified(false); // Reset OTP verification status if error occurs
                });
            }
        } else {
            login(finalFormData);  // Regular login with username and password
        }
    };

    const toggleSignInMethod = () => {
        setUseSignInCode(!useSignInCode);
        setPassword(''); // Clear password when switching modes
        setOtpRequested(false); // Reset OTP request status
        setIsOtpVerified(false); // Reset OTP verification status
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleOtpRequest = (e) => {
        e.preventDefault();
        requestOtp(username).then((isSuccess) => {
            if (isSuccess) {
                setOtpRequested(true); // Show OTP input and button if OTP request is successful
            } 
            else
            {
                setOtpRequested(false);
            }            
        }).catch(() => {
            setOtpRequested(false); // Keep OTP request hidden if error occurs
        });
    };

    return (
        <div className="min-h-screen h-full w-full football-bg">
            <header className="max-w-6xl mx-auto flex items-center justify-between p-4">
                <Link to={"/"}>
                <img src="/proplay_logo.png" alt="ProPlay" className="h-20 w-auto" />

                </Link>
            </header>

            <div className="flex justify-center items-center mt-20 mx-3">
                <div className="w-full max-w-md p-8 space-y-6 bg-black/60 rounded-lg shadow-md">
                    <h1 className="text-center text-white text-2xl font-bold mb-4">
                        Sign In
                    </h1>
                   
                    <form className="space-y-4" onSubmit={useSignInCode ? (otpRequested ? handleLogin : handleOtpRequest) : handleLogin}>
                        <div>
                            <label htmlFor="username" className="text-sm font-medium text-gray-300 block">
                                {useSignInCode ? 'Mobile' : 'Email/Mobile'}
                            </label>
                            <input 
                                type="text" 
                                required 
                                autoComplete="off"  
                                className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                                placeholder={useSignInCode ? 'Mobile Number' : 'Email or Mobile Number'} 
                                id="username" 
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        {!useSignInCode && (
                            <div className="relative w-full">
                                <label htmlFor="password" className="text-sm font-medium text-gray-300 block">
                                    Password
                                </label>
                                <input 
                                    type={passwordVisible ? 'text' : 'password'} 
                                    required 
                                    autoComplete="off"  
                                    className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                                    placeholder="*******" 
                                    id="password" 
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span
                                        onClick={togglePasswordVisibility}
                                        className="text-white absolute right-3 top-11 transform -translate-y-1/2 cursor-pointer "
                                    >
                                        {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                                </span>
                            </div>
                        )}

                        {useSignInCode && otpRequested && !isOtpVerified && (
                            <div>
                                <label htmlFor="otp" className="text-sm font-medium text-gray-300 block">
                                    OTP
                                </label>
                                <input 
                                    type="text" 
                                    required 
                                    className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                                    placeholder="Enter OTP" 
                                    id="otp" 
                                    name="otp"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="col-span-2 text-center">
                            {useSignInCode ? (
                                // Conditionally render the OTP or Request OTP button
                                otpRequested ? (
                                    <button 
                                        type="submit" 
                                       
                                        className="w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
                                    >
                                        Verify OTP
                                    </button>
                                ) : (
                                    <button 
                                        type="submit" 
                                        
                                        className="w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
                                    >
                                        Request OTP
                                    </button>
                                )
                            ) : (
                                <button
                                    type="submit"
                                    className="w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>
                    </form>

                    <p className="text-base text-white/70 text-center">OR</p>
                    <button 
                        className="bg-gray-500/40 p-4 rounded-md text-white w-full" 
                        type="button"
                        onClick={toggleSignInMethod}
                    >
                        {useSignInCode ? 'Use Password' : 'Use a Sign-in Code'}
                    </button>

                    <div className='text-center text-gray-400'>
                        Don't have an account?{" "}
                        <Link to={"/signup"} className='text-red-500 hover:underline'>
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
