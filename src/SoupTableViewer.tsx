import React from "react"
import type { AnyElement } from "@tscircuit/builder"
import ReactDataGrid from "react-data-grid"
import "react-data-grid/lib/styles.css"

import { useState } from "react"

export const SoupTableViewer = ({ elements }: { elements: AnyElement[] }) => {
  const element_types = [...new Set(elements.map((e) => e.type))]

  const columns = [
    {
      key: "type",
      name: "type",
      // filterRenderer: (p) => (
      //   <select onChange={(e) => p.onChange(e.target.value)}>
      //     {element_types.map((type) => (
      //       <option key={type} value={type}>
      //         {type}
      //       </option>
      //     ))}
      //   </select>
      // ),
    },
    ...element_types.map((et) => ({
      key: et,
      name: et,
    })),
    // ...Object.keys(elements[0])
    //   .filter((key) => key !== "type")
    //   .map((key) => ({
    //     key,
    //     name: key.charAt(0).toUpperCase() + key.slice(1),
    //   })),
  ]

  const [filters, setFilters] = useState({})

  // const filteredRows = elements.filter((r) => {
  //   return Object.keys(filters).every((key) => {
  //     if (filters[key] === undefined || filters[key] === "") return true
  //     if (r[key] === undefined) return false
  //     return String(r[key]).includes(String(filters[key]))
  //   })
  // })

  return <ReactDataGrid columns={columns} rows={elements} />
}
