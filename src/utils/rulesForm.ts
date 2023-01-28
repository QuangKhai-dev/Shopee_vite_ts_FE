import { type UseFormGetValues, type RegisterOptions } from "react-hook-form"
// import { FormData } from "src/pages/Register/Register"
import * as yup from "yup"

// type ruleForm = {
//   [key in "email" | "password" | "confirm_password"]?: RegisterOptions
// }

// export const getRulesForm = (getValues?: UseFormGetValues<FormData>): ruleForm => ({
//   email: {
//     required: {
//       value: true,
//       message: "Không để trống Email"
//     },
//     pattern: {
//       value:
//         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
//       message: "Email không đúng định dạng"
//     },
//     maxLength: {
//       value: 160,
//       message: "Độ dài từ 5-160 ký tự"
//     },
//     minLength: {
//       value: 5,
//       message: "Độ dài từ 5-160 ký tự"
//     }
//   },
//   password: {
//     required: {
//       value: true,
//       message: "Không để trống Password"
//     },
//     maxLength: {
//       value: 160,
//       message: "Độ dài từ 5-160 ký tự"
//     },
//     minLength: {
//       value: 5,
//       message: "Độ dài từ 5-160 ký tự"
//     }
//   },
//   confirm_password: {
//     required: {
//       value: true,
//       message: "Không để trống Confirm  Password"
//     },
//     maxLength: {
//       value: 160,
//       message: "Độ dài từ 5-160 ký tự"
//     },
//     minLength: {
//       value: 5,
//       message: "Độ dài từ 5-160 ký tự"
//     },
//     validate:
//       typeof getValues === "function" ? (value) => value === getValues("password") || "Mật khẩu không khớp" : undefined
//   }
// })

export const schema = yup.object({
  email: yup
    .string()
    .email("Email không đúng định dạng")
    .required("Không để trống Email")
    .min(5, "Độ dài từ 5-160 ký tự")
    .max(160, "Độ dài từ 5-160 ký tự"),
  password: yup
    .string()
    .required("Không để trống Password")
    .max(160, "Độ dài từ 5-160 ký tự")
    .min(5, "Độ dài từ 5-160 ký tự"),
  confirm_password: yup
    .string()
    .required("Không để trống Confirm  Password")
    .max(160, "Độ dài từ 5-160 ký tự")
    .min(5, "Độ dài từ 5-160 ký tự")
    .oneOf([yup.ref("password"), null], "Mật khẩu không khớp"),
  price_min: yup.string().test({
    name: "price_not_allow",
    message: "Giá không phù hợp",
    test: function (value) {
      const price_min = value
      const { price_max } = this.parent as { price_max: string; price_min: string }
      if (price_min !== "" && price_max !== "") {
        return Number(price_max) >= Number(price_min)
      }
      return price_min !== "" || price_max !== ""
    }
  }),
  price_max: yup.string().test({
    name: "price_not_allow",
    message: "Giá không phù hợp",
    test: function (value) {
      const price_max = value
      const { price_min } = this.parent as { price_max: string; price_min: string }
      if (price_min !== "" && price_max !== "") {
        return Number(price_max) >= Number(price_min)
      }
      return price_min !== "" || price_max !== ""
    }
  })
})

export const loginScheMa = schema.omit(["confirm_password", "price_min", "price_max"])
export type LoginSchemaType = yup.InferType<typeof loginScheMa>

export type SchemaType = yup.InferType<typeof schema>
