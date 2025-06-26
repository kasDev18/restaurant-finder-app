// import './App.css'
import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'


function App() {
  // Use an object for query state
  const [query, setQuery] = useState<{ message: string }>({ message: '' });
  
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async(event) => {
    event.preventDefault();
    try {
      console.log('Submitting query...');
      
      const response: Response = await fetch(`/api/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }), // send as { query: { message: string } }
      });
      const data = await response.json();

      if (data.error) {
        toast.error(data.message);
        return;
      }

      console.log(data);
    } catch (err) {
      toast.error('Network or server error.');
    }
  }
  
  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
    <div className='flex bg-[url("/images/bg-food.jpeg")] w-screen h-screen justify-center'>
      <div className="h-screen w-1/2 bg-white items-center flex flex-col py-4">
        <span className="text-black">Find restaurants here</span>
        <form className="flex items-center justify-center" onSubmit={handleSubmit}>  
          <input value={query.message} type="text" placeholder="Search Restaurant" className="input input-sm w-[35vw]" onChange={(event) => setQuery({ message: event.target.value })} required/>
          <button type='submit' className="btn btn-neutral btn-sm">Search</button>
        </form>
      </div>
    </div>
    </>
  );
}

export default App;
