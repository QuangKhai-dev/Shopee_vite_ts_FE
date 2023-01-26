import React, { InputHTMLAttributes } from "react"
import { RegisterOptions, UseFormRegister } from "react-hook-form"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>
  ruleForm?: RegisterOptions
}

export default function Input({
  type,
  placeholder,
  errorMessage,
  className,
  register,
  name,
  ruleForm,
  classNameInput = "p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm",
  classNameError = "mt-1 text-red-600 min-h-[1.25rem] text-sm",
  autoComplete
}: InputProps) {
  const registerResult = register && name ? register(name, ruleForm) : {}
  return (
    <div className={className}>
      <input
        type={type}
        className={classNameInput}
        placeholder={placeholder}
        autoComplete={autoComplete}
        {...registerResult}
      />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}
