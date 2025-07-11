import warningIcon from "../../../assets/icons/form/warning.png";

interface InputTextProps {
  checkErrorField?: string[];
  defaultValue?: string | number;
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  readOnly?: boolean;
  value?:number
}
const InputText = ({
  placeholder,
  defaultValue,
  checkErrorField,
  label,
  name,
  type,
  readOnly = false,
  value
}: InputTextProps) => {
  return (
    <div>
      <div
        className={`border-b py-2 focus-within:border-b-[#1C98D8] ${
          checkErrorField ? "border-b-[#FF4C51]" : "border-b-gray-300"
        }`}
      >
        <label className="block text-[14px] mb-2 font-medium text-[#444050] dark:text-[#cacaca]">
          {label}
        </label>
        <input
          readOnly={readOnly}
          name={name}
          type={type}
          placeholder={placeholder}
          className="w-full border-0 focus:ring-0 focus:outline-none placeholder:text-[#444050] dark:placeholder:text-[#cacaca] placeholder:text-[13px] dark:text-[#cacaca] placeholder:bg-transparent dark:placeholder:bg-transparent autofill:bg-transparent dark:autofill:bg-transparent"
          defaultValue={defaultValue}
          value={value}
        />
      </div>
      {checkErrorField && (
        <p className="text-[#FF4C51] text-[12px] mt-1 flex gap-1 items-center">
          <img src={warningIcon} alt="warning-icon" /> {checkErrorField[0]}
        </p>
      )}
    </div>
  );
};

export default InputText;
