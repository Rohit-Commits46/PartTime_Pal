import React from 'react'
export default function Input_field({type,placetext,content}) {
  return (
    <div>
    {content}
    <input type={type} placeholder={placetext} className="w-[100%] h-[50px] border-[1px] border-gray-200 rounded-[5px] opacity-50"/>
    </div>
  )
}