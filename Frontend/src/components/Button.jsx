const Button = ({name = "Button",bg="bg-black",text= "text-white",func}) => {
  return (
    <>
    <button id="btn" className={` active:scale-90 px-3 py-2 rounded-lg text-sm ${bg} ${text}`} onClick={func}>{name}</button>
    </>
  )
}

export default Button