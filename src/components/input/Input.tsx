import { InputProps } from "./InputModel"
export default function Input({type, className, value, onChange, onClick, accept, id, ...rest}:InputProps) {
  return (
    <div>
      <input type={type} value={value} className={className} onChange={onChange} accept={accept} id={id} onClick={onClick} {...rest}/>
    </div>
  )
}
