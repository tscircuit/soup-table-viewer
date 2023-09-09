import React from "react"

interface ModalProps {
  open: boolean
  children: React.ReactNode
  title: string
  onClose: () => void
}

const Modal: React.FC<ModalProps> = ({ open, children, title, onClose }) => {
  if (!open) return null

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  }

  const modalStyle: React.CSSProperties = {
    width: "500px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    position: "relative",
  }

  const closeButtonStyle: React.CSSProperties = {
    position: "absolute",
    top: "16px",
    right: "16px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "28px",
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div
        style={modalStyle}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: 18 }}>{title}</h2>
        <span style={closeButtonStyle} onClick={onClose}>
          &#10006;
        </span>
        {children}
      </div>
    </div>
  )
}

export default Modal
