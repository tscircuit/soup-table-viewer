# @tscircuit/table-viewer

This table viewer allows inspection of "tscircuit soup elements", which is the
output of tscircuit builder or and intermediate step of tscircuit react.

You might use the table viewer to debug why a particular selector isn't working.

![](https://user-images.githubusercontent.com/1910070/266788681-1c2c3ea5-fdc6-4c93-a92b-22a88849f2bf.png)

## Usage

```bash
npm add @tscircuit/table-viewer
```

```ts
import { SoupTableViewer } from "@tscircuit/table-viewer"
import "react-data-grid/lib/styles.css"

export const MyApp = () => (
  <SoupTableViewer
    elements={[
      {
        type: "source_component",
        source_component_id: "simple_resistor_0",
        name: "R1",
        ftype: "simple_resistor",
      },
      {
        type: "schematic_component",
        source_component_id: "simple_resistor_0",
        schematic_component_id: "schematic_component_simple_resistor_0",
        rotation: 0,
        size: {
          width: 1,
          height: 0.3,
        },
        center: {
          x: 2,
          y: 1,
        },
        schematic_center: {
          x: 2,
          y: 1,
        },
      },
      {
        type: "source_port",
        name: "left",
        source_port_id: "source_port_0",
        source_component_id: "simple_resistor_0",
      },
      // ...
    ]}
  />
)
```

## Development

Add/remove stories or use the existing stories to test new UI features.

```bash
npm run storybook
```
