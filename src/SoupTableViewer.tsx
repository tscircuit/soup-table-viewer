import React, { useReducer, useState } from "react"
import type { AnyElement } from "@tscircuit/builder"
import ReactDataGrid, { Column } from "react-data-grid"
import { JSONTree } from "react-json-tree"

import { HeaderCell } from "./HeaderCell"
import { ClickableText } from "./ClickableText"
import Modal from "./Modal"

type Filters = {
  component_type_filter?:
    | "any"
    | "source"
    | "source/pcb"
    | "source/schematic"
    | string
  id_search?: string
  name_search?: string
  selector_search?: string
  focused_id?: string
}

type CommonProps = { name?: string; type: string }
type ModalState =
  | { open: false; element?: any }
  | { open: true; element: any; title: string }

export const SoupTableViewer = ({ elements }: { elements: AnyElement[] }) => {
  const [modal, setModal] = useState<ModalState>({ open: false })
  const [filters, setFilter] = useReducer(
    (s: Filters, a: Filters) => ({
      ...s,
      ...a,
    }),
    {}
  )

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

    const other_props: CommonProps = Object.fromEntries(
      Object.entries(e).filter(([k, v]) => !k.endsWith("_id"))
    ) as any

    return {
      primary_id,
      other_ids,
      ...other_props,
      _og_elm: e,
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
          p.type === parent_type && p.primary_id === e2.other_ids[parent_key]
      )

      if (!parent) return `??? > .${e2.name}`
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
    {
      key: "primary_id",
      name: "primary_id",
      renderCell: (p) => (
        <div style={{ display: "flex" }}>
          <ClickableText
            text={p.row.primary_id}
            onClick={() =>
              setFilter({ focused_id: p.row.primary_id, id_search: undefined })
            }
          />
          <span style={{ flexGrow: 1 }} />
          <ClickableText
            text="(JSON)"
            onClick={() =>
              setModal({
                open: true,
                element: p.row._og_elm,
                title: p.row.primary_id,
              })
            }
          ></ClickableText>
        </div>
      ),
      renderHeaderCell: (p) => (
        <HeaderCell
          {...p}
          onTextChange={(v) => setFilter({ id_search: v })}
          field={
            !filters.focused_id
              ? null
              : () => (
                  <div>
                    focus:{" "}
                    <span style={{ textDecoration: "underline" }}>
                      {filters.focused_id}
                    </span>
                    <ClickableText
                      text="(unfocus)"
                      onClick={() => setFilter({ focused_id: undefined })}
                    />
                  </div>
                )
          }
        />
      ),
    },
    {
      key: "type",
      name: "type",
      renderHeaderCell: (p) => (
        <HeaderCell
          {...p}
          field={() => (
            <select
              onChange={(e) =>
                setFilter({ component_type_filter: e.target.value })
              }
            >
              <option key="any" value="any">
                any
              </option>
              <option key="source" value="source">
                source
              </option>
              <option key="source/pcb" value="source/pcb">
                source/pcb
              </option>
              <option key="source/schematic" value="source/schematic">
                source/schematic
              </option>
              {element_types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          )}
        />
      ),
    },
    {
      key: "name",
      name: "name",
      renderHeaderCell: (p) => (
        <HeaderCell
          {...p}
          onTextChange={(t) => setFilter({ name_search: t })}
        />
      ),
    },
    {
      key: "selector_path",
      name: "selector_path",
      renderHeaderCell: (p) => (
        <HeaderCell
          {...p}
          onTextChange={(t) => setFilter({ selector_search: t })}
        />
      ),
    },
    {
      key: "other_ids",
      name: "other_ids",
      renderCell: (p) => (
        <div style={{ width: 80 }}>
          {Object.entries(p.row.other_ids).map(([other_id, v]: any) => (
            <ClickableText
              text={v}
              onClick={() => setFilter({ focused_id: v })}
            />
          ))}
        </div>
      ),
    },
    // TODO enable properties based on selected type e.g. center
    // TODO introduce JSON viewer button
  ]

  const elements4 = elements3
    .filter((e) => {
      if (!filters.name_search) return true
      return e.name?.toLowerCase()?.includes(filters.name_search.toLowerCase())
    })
    .filter((e) => {
      if (!filters.component_type_filter) return true
      if (filters.component_type_filter === "any") return true
      if (filters.component_type_filter === "source") {
        return e.type.startsWith("source_")
      }
      if (filters.component_type_filter === "source/pcb") {
        return e.type.startsWith("source_") || e.type.startsWith("pcb_")
      }
      if (filters.component_type_filter === "source/schematic") {
        return e.type.startsWith("source_") || e.type.startsWith("schematic_")
      }
      return e.type?.includes(filters.component_type_filter)
    })
    .filter((e) => {
      if (!filters.selector_search) return true
      return e.selector_path?.includes(filters.selector_search)
    })
    .filter((e) => {
      if (!filters.id_search) return true
      return e.primary_id?.includes(filters.id_search)
    })
    .filter((e) => {
      if (!filters.focused_id) return true
      if (e.primary_id === filters.focused_id) return true
      if (Object.values(e.other_ids).includes(filters.focused_id)) return true
      // TODO show parents
      return false
    })

  // TODO sort when focused_id is set so that the focused_id appears first

  return (
    <div style={{ fontFamily: "monospace" }}>
      <ReactDataGrid
        className="rdg-dark"
        style={{ height: 1000 }}
        headerRowHeight={70}
        columns={columns}
        rows={elements4}
      />
      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false })}
        title={`${modal.open ? modal.title : ""}`}
      >
        <div style={{ backgroundColor: "#002B36", padding: 12 }}>
          <JSONTree
            shouldExpandNodeInitially={() => true}
            hideRoot={true}
            data={modal.element ?? {}}
          />
        </div>
      </Modal>
    </div>
  )
}
