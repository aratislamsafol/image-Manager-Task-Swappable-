export type InputProps = {
    type: 'file'| 'submit' | 'checkbox' | 'color' | 'date' | 'email'| 'hidden'| 'password'|'search' |'reset' |'url'; 
    className?: string;
    value?: string| number| [];
    accept?:'jpg'|'jpeg'|'png'|'webp'| string;
    id? : string;
    multiple?: boolean;
    name?: string;
    disabled?: boolean;
    checked?: boolean;
    onClick?:()=>void;
    onChange?:(event: React.ChangeEvent<HTMLInputElement>)=>void;
}