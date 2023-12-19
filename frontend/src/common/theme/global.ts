import type { Styles } from '@chakra-ui/theme-tools';

const global: Styles = {
  global: () => ({
    body: {
      overscrollBehaviorX: 'auto',
    },
    // https://github.com/glideapps/glide-data-grid/blob/c9e1f3df5d545171ccca2226c0c55e253fb6cc83/packages/core/API.md#htmlcss-prerequisites
    '#portal': {
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 1000,
    },
    /* https://github.com/haltu/muuri#grid-option-dragautoscroll */
    '#dragContainer': {
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 1000,
    },
    '.draggableHeader': {
      cursor: 'grab',
    },
    '.muuri-item-dragging .draggableHeader': {
      cursor: 'grabbing',
    },
  }),
};

export { global };
