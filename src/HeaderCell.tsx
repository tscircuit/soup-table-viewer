import React from "react"

export const HeaderCell = (p) => {
  return (
    <div style={{ lineHeight: 1.5 }}>
      <div style={{ paddingTop: 8, paddingBottom: 8, fontWeight: "bold" }}>
        {p.column.name}
      </div>
      <div>
        {p.field?.() ?? (
          <input
            type="text"
            onChange={(e) => {
              p.onTextChange?.(e.target.value)
            }}
          />
        )}
      </div>
    </div>
  )
}
