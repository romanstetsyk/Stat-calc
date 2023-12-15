import type { Item, LayoutData, LayoutFunction } from 'muuri';
import type Grid from 'muuri';

class CustomLayout {
  private gridId?: number;
  private registeredItems: Set<Item>;

  public constructor() {
    this.registeredItems = new Set();
  }

  // eslint-disable-next-line max-params
  public createLayout: LayoutFunction = (
    grid,
    layoutId,
    items,
    width,
    height,
    callback,
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

      const defaultWidth = 100;
      const containerWidth =
        grid.getElement().parentElement?.offsetWidth ?? defaultWidth;

      const defaultHeight = 100;
      const containerHeight =
        grid.getElement().parentElement?.offsetHeight ?? defaultHeight;

      const gridPos = grid.getElement().getBoundingClientRect();

      let maxWidth = 0;
      let maxHeight = 0;

      for (const item of this.registeredItems) {
        const m = item.getMargin();
        const pos = item.getPosition();
        const height = item.getHeight() + m.top + m.bottom + pos.top;
        maxHeight = Math.max(height, maxHeight);
      }

      for (const item of items) {
        const element = item.getElement();
        if (!element) {
          continue;
        }
        const pos = element.getBoundingClientRect();

        const ux =
          Math.round(
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            (pos.left - gridPos.left >= 0 ? pos.left - gridPos.left : 0) / 4,
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
          ) * 4;
        const uy =
          Math.round(
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            (pos.top - gridPos.top >= 0 ? pos.top - gridPos.top : 0) / 4,
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
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
        layout.styles.width = Math.max(maxWidth, containerWidth, width) + 'px';
        layout.styles.height =
          Math.max(maxHeight, containerHeight, height) + 'px';
      }

      this.registeredItems = new Set(items);
      callback(layout);
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    }, 0);

    // cleanup
    return (): void => {
      clearTimeout(id);
    };
  };
}

export { CustomLayout };
