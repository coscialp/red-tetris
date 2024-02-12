import { useEffect, useState } from 'react'
import React from 'react'
import Input from '../components/Input'
import './register.scss';
function Register() {
  React;
  const [pseudo, setPseudo] = useState("");
  useEffect (() => {
    console.log(pseudo);
  }, [pseudo])
  return (
    <>
      <div className='flex-display-register'>
        <h1 className='title'>
        </h1>
        <Input
        placeholder="Username"
        setter={ setPseudo }
      />
      </div>
    </>
  )
}

export default Register;
