/* eslint-disable @typescript-eslint/no-var-requires */
// Chinh container tailwind
const plugin = require("tailwindcss/plugin")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  corePlugins: {
    container: false
  },
  theme: {
    extend: {
      colors: {
        orange: "#ee4d2d"
      }
    }
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        ".container": {
          width: "100%",
          "@screen sm": {
            maxWidth: "640px",
            marginLeft: "auto",
            marginRight: "auto",
            paddingLeft: theme("spacing.4"),
            paddingRight: theme("spacing.4")
          },
          "@screen md": {
            maxWidth: "768px",
            marginLeft: "auto",
            marginRight: "auto",
            paddingLeft: theme("spacing.4"),
            paddingRight: theme("spacing.4")
          },
          "@screen lg": {
            maxWidth: "1024px",
            marginLeft: "auto",
            marginRight: "auto",
            paddingLeft: theme("spacing.4"),
            paddingRight: theme("spacing.4")
          },
          "@screen xl": {
            maxWidth: theme("columns.7xl"),
            marginLeft: "auto",
            marginRight: "auto",
            paddingLeft: theme("spacing.4"),
            paddingRight: theme("spacing.4")
          }
        }
      })
    })
  ]
}
