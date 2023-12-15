import { CustomLayout } from './layout-function';

const layout = new CustomLayout();
const layoutFunction = layout.createLayout.bind(layout);

export { layoutFunction };
