export const ClickableText = ({ text, onClick }) => {
  return (
    <span
      style={{
        cursor: "pointer",
        textDecoration: "underline",
        color: "#b3e5fc",
        marginLeft: 8,
        marginRight: 8,
      }}
      onClick={onClick}
    >
      {text}
    </span>
  )
}
