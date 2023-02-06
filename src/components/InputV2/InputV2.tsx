import React, { InputHTMLAttributes, forwardRef, useState } from "react"
import { UseControllerProps, useController } from "react-hook-form"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
}

const InputV2 = (props: UseControllerProps<any> & InputProps) => {
  const {
    className,
    classNameInput = "p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm",
    classNameError = "mt-1 text-red-600 min-h-[1.25rem] text-sm",
    onChange,
    value = "",
    ...rest
  } = props
  const { field, fieldState } = useController(props)
  // thêm state
  const [localValue, setLocalValue] = useState<string>(field.value)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { type, onChange } = props
    const valueFormInput = event.target.value
    const regex = /^[0-9\b]+$/
    const numberCondition = type === "number" && (valueFormInput === "" || regex.test(valueFormInput))
    if (numberCondition || type !== "number") {
      setLocalValue(valueFormInput)
      field.onChange(event)
      onChange && onChange(event)
    }
  }

  return (
    <div className={className}>
      <input className={classNameInput} {...rest} {...field} value={value || localValue} onChange={handleChange} />
      <div className={classNameError}>{fieldState.error?.message}</div>
    </div>
  )
}

export default InputV2
