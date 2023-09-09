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

  const elements3 = elements2.map((e) => {
    let selector_path

    const getSelectorPath = (e2) => {
      const parent_key = Object.keys(e2.other_ids).find((k) =>
        k.startsWith("source_")
      )
      if (!parent_key) return `.${e2.name}`
      const parent_type = parent_key.slice(0, -3) // trim "_id"

      const parent = elements2.find(
        (p) =>
          "type" in p &&
          p.type === parent_type &&
          p[parent_key] === e2[parent_key]
      )

      if (!parent) return `.${e2.name}`
      // throw new Error(`Couldn't find specified parent: ${e2[parent_key]}`)

      if (!("name" in parent)) return `#${parent[parent_key]} > .${e2.name}`

      return `${getSelectorPath(parent)} > .${e2.name}`
    }

    if ("name" in e) {
      selector_path = getSelectorPath(e)
    }

    return {
      ...e,
      selector_path,
    }
  })

  const columns: Column<any, any>[] = [
    { key: "primary_id", name: "primary_id" },
    {
      key: "type",
      name: "type",
      renderHeaderCell: (p) => (
        <div style={{ lineHeight: 1.5, padding: 0 }}>
          <div style={{ fontWeight: "bold" }}>{p.column.name}</div>
          <hr />
          <select
          // onChange={(e) => p.onChange(e.target.value)}
          >
            {element_types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      ),
    },
    {
      key: "name",
      name: "name",
    },
    {
      key: "selector_path",
      name: "selector_path",
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

  return (
    <ReactDataGrid
      style={{ height: 1000 }}
      headerRowHeight={70}
      columns={columns}
      rows={elements3}
    />
  )
}
