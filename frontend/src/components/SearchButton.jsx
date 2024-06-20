import React from 'react'
import { useNavigate } from 'react-router-dom';

function SearchButton({Phone , dataFetch , style = "" ,text = "Find Orders"}) {
    const navigate = useNavigate();
    const clickHandler = () => {
        navigate('/list');
        dataFetch();
        console.log(`Phone Number Submitted: ${Phone}`);
      };
  
    return (
    <button
        className={`bg-black text-white m-5 focus:outline-none ${style}`}
        onClick={clickHandler}
    >
        {text}
    </button>
  )
}

export default SearchButton
