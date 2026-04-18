import { Link } from "react-router-dom"

const HomePage = ({user}) => {

  return (
    <>
    <div className="text-center my-5 flex gap-2 flex-col items-center">
        <h1 className="text-xl font-sans">Welcome <span className="text-indigo-600 font-medium">{user?.name}</span></h1>
         <h1 className="text-5xl font-serif ">Sharing Life<br /> Moments with <br /><span className="text-indigo-600"> Besocial!</span></h1>
          <Link to={'/feed'}>
          <h1 className="text-white bg-indigo-600 p-3 rounded-lg">See Whats New!</h1>
          </Link>
    </div>
    </>
  )
}

export default HomePage