import React from "react"
import type { AnyElement } from "@tscircuit/builder"
import ReactDataGrid, { Column } from "react-data-grid"
import "react-data-grid/lib/styles.css"

import { useState } from "react"

export const SoupTableViewer = ({ elements }: { elements: AnyElement[] }) => {
  const element_types = [...new Set(elements.map((e) => e.type))]

  // Process elements to separate primary and non-primary ids
  const elements2 = elements.map((e) => {
    const new_elm: any = {}

    const primary_id = e[`${e.type}_id`]

    const other_ids = Object.fromEntries(
      Object.entries(e).filter(([k, v]) => {
        if (k === `${e.type}_id`) return false
        if (!k.endsWith("_id")) return false
        return true
      })
    )

    const other_props = Object.fromEntries(
      Object.entries(e).filter(([k, v]) => !k.endsWith("_id"))
    )

    return {
      primary_id,
      other_ids,
      ...other_props,
    }
  })

  const columns: Column<any, any>[] = [
    { key: "primary_id", name: "primary_id" },
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
    {
      key: "name",
      name: "name",
    },
    {
      key: "other_ids",
      name: "other_ids",
      renderCell: (p) => (
        <div style={{ width: 80 }}>
          {Object.entries(p.row.other_ids).map(([other_id, v]: any) => (
            <a style={{ marginRight: 4 }} href="#">
              {v}
            </a>
          ))}
        </div>
      ),
    },

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

  return <ReactDataGrid columns={columns} rows={elements2} />
}
