const HomePage = ({user}) => {
  return (
    <>
    <div className="text-center my-5 flex gap-2 flex-col">
      <h1 className="text-xl font-sans">Welcome <span className="text-indigo-600 font-medium">{user?.name}</span></h1>
         <h1 className="text-5xl font-serif ">Sharing Life<br /> Moments with <br /><span className="text-indigo-600"> Besocial!</span></h1>
    </div>
    </>
  )
}

export default HomePage