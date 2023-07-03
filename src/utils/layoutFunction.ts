import Grid, { Item, LayoutData, LayoutFunction } from "muuri";

class CustomLayout {
  private gridId?: number;
  private registeredItems: Set<Item>;

  constructor() {
    console.log('constructor')
    this.registeredItems = new Set();
  }

  createLayout: LayoutFunction = (
    grid,
    layoutId,
    items,
    _width,
    _height,
    callback
  ) => {
    const layout: LayoutData = {
      id: layoutId,
      items: items,
      slots: [],
      styles: {},
    };

    const id = setTimeout(() => {
      // if grid has rerendered reinitiate registered items
      // in order to keep grid in sync
      const currentGrid = grid as Grid & { _id: number };
      if (currentGrid._id !== this.gridId) {
        this.gridId = currentGrid._id;
        this.registeredItems = new Set();
      }

      const containerWidth =
        grid.getElement().parentElement?.offsetWidth ?? 100;
      const containerHeight =
        grid.getElement().parentElement?.offsetHeight ?? 100;

      const gridPos = grid.getElement()?.getBoundingClientRect();

      let maxWidth = 0;
      let maxHeight = 0;
      this.registeredItems.forEach((item) => {
        const element = item.getElement();
        if (element && element.getBoundingClientRect) {
          maxHeight = Math.max(
            (element.getBoundingClientRect().bottom ?? 0) - gridPos.top,
            maxHeight
          );
        }
      });

      for (const item of items) {
        const element = item.getElement();
        if (!element) {
          continue;
        }
        const pos = element.getBoundingClientRect();

        const ux =
          Math.round(
            (pos?.left - gridPos?.left >= 0 ? pos?.left - gridPos?.left : 0) / 4
          ) * 4;
        const uy =
          Math.round(
            (pos?.top - gridPos?.top >= 0 ? pos?.top - gridPos?.top : 0) / 4
          ) * 4;

        const m = item.getMargin();
        // const width = item.getWidth() + m.left + m.right;
        const height = item.getHeight() + m.top + m.bottom;

        if (this.registeredItems.has(item)) {
          layout.slots.push(ux, uy);
        } else {
          layout.slots.push(ux, maxHeight);
          this.registeredItems.add(item);
          maxHeight += height;
        }

        maxWidth = Math.max(pos.right - gridPos.left, maxWidth);
      }

      if (layout.styles) {
        layout.styles.width = Math.max(maxWidth, containerWidth) + "px";
        layout.styles.height = Math.max(maxHeight, containerHeight) + "px";
      }

      this.registeredItems = new Set(items);
      callback(layout);
    }, 0);

    // cleanup
    return () => clearTimeout(id);
  };
}

const layout = new CustomLayout();
export const layoutFunction = layout.createLayout.bind(layout);
