import React, { InputHTMLAttributes, forwardRef } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
}

export const InputNumber = forwardRef<HTMLInputElement, InputProps>(function InputNumberInner(
  {
    errorMessage,
    className,
    classNameInput = "p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm",
    classNameError = "mt-1 text-red-600 min-h-[1.25rem] text-sm",
    onChange,
    ...rest
  },
  ref
) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const regex = /^[0-9\b]+$/
    if ((value === "" || regex.test(value)) && onChange) {
      onChange(event)
    }
  }

  return (
    <div className={className}>
      <input className={classNameInput} onChange={handleChange} {...rest} ref={ref} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
})
