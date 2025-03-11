import { Link } from "react-router-dom";
const AuthScreen = () => {
  return (
    <div className="football-home-bg h-screen">
         <header className="max-w-6xl mx-auto flex items-center justify-between p-4">
                <Link to={"/"}>
                <img src="/proplay_logo.png" alt="ProPlay" className="h-20 w-auto" />
                </Link>
                <Link to={"/login"} className="text-white bg-red-600 py-1 px-2 rounded">
                    
                        Sign In
                    
                </Link>
            </header>
    </div>
  )
}

export default AuthScreen