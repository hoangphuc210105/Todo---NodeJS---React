// import React from 'react'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
      <img
        src="404_NotFound.png"
        alt="Not Found"
        className="max-w-full mb-6 w-65"
      />

      <p className="text-xl font-bold">Page Not Found</p>

      <a
        href="/"
        className="inline-block px-6 py-3 mt-6 font-medium text-white transition shadow-md bg-primary rounded-2xl hover:bg-primary-dark"
      >
        Go to Home
      </a>
    </div>
  );
};

export default NotFound;
