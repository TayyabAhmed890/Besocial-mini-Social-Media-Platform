import { useState,useRef } from 'react';
import copyIcon from '../assets/copy.png'

const CopyText = ({text}) => {
    const textRef = useRef(null);
    const [copy,setCopy] = useState(false)
    
      const handleCopy = ()=>{
        const text = textRef.current.innerText;
        navigator.clipboard.writeText(text);
    
        setCopy(true);
        setTimeout(() => {
          setCopy(false)
        }, 2000);
      }
  return (
    <>
    <div className='border px-3 py-4 rounded-md flex justify-center items-center gap-4'>
          <h1 ref={textRef} className='text-xl font-mono'>{text}</h1>
          <img onClick={handleCopy} className='h-6 invert cursor-pointer active:scale-75' src={copyIcon} alt="copy" />
          {copy && <h1 className="text-sm rounded-md text-black font-medium absolute bottom-1 p-3 bg-indigo-300">Copied!</h1>}
    </div>
    </>
  )
}

export default CopyText