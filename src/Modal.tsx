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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
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
    top: "10px",
    right: "10px",
    cursor: "pointer",
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <span style={closeButtonStyle} onClick={onClose}>
          X
        </span>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  )
}

export default Modal
