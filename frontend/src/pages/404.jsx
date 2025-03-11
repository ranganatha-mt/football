import { Link } from "react-router-dom";

const NotFoundPage = () => {
	return (
		<div
			className='min-h-screen bg-cover bg-center flex flex-col justify-center items-center text-white'
			style={{ backgroundImage: `url('/404.png')` }}
		>
			<header className='absolute top-0 left-0 p-4 bg-black w-full '>
				<Link to={"/"}>
                <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 shadow-xl">
                        Football
                    </div>
				</Link>
			</header>
			<main className='text-center error-page--content z-10'>
				<h1 className='text-7xl font-semibold mb-4'>Lost your way?</h1>
				<p className='mb-6 text-xl'>
					Sorry, we can't find that page. You'll find lots to explore on the home page.
				</p>
				<Link to={"/"} className='bg-white text-black py-2 px-4 rounded'>
					Football Home
				</Link>
			</main>
		</div>
	);
};
export default NotFoundPage;