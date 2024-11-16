import * as React from "react";
import styles from './Input.module.css';

interface InputProps {
    label: string;
    defaultValue: any;
    onChange:any;
}

const Input = ({
    label,
    defaultValue,
    onChange
}:InputProps) =>{

    return(
        <div className={styles['input-container']}>
            <label>{label}</label>
            <input defaultValue={defaultValue} onChange={onChange}/>
        </div>
    )
}

export default Input;