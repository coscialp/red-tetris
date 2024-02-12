/* eslint-disable react/no-multi-comp */
import React, { InputHTMLAttributes, JSX } from "react";
import "./Input.scss";


/** syntax with interface **/
// interface InputPros extends InputHTMLAttributes<HTMLInputElement> {
//   setter: React.Dispatch<React.SetStateAction<string>>
// }

type InputProps = {
  setter: React.Dispatch<React.SetStateAction<string>>
} & InputHTMLAttributes<HTMLInputElement>

const Input = (props: InputProps): JSX.Element => {

  const { setter, placeholder, ...attributes } = props;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    e.preventDefault();
    setter(e.target.value);
  };

  return (
    <span>
      <input
        className="input-basic"
        placeholder=" "
        { ...attributes }
        onChange={ (e) => handleInputChange(e, setter) }
      />
      <p className="floating-label">{ placeholder }</p>
    </span>
  );
};

export default Input;
