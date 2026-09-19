const Button = ({
  name = "Button",
  bg = "bg-indigo-600",
  text = "text-white",
  func,
  className = "",
}) => {
  return (
    <button
      onClick={func}
      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-95 cursor-pointer ${bg} ${text} ${className}`}
    >
      {name}
    </button>
  );
};

export default Button;