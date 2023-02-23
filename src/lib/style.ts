export interface Style {
  className: string;
  props?: any;
}
export function createStyle(className: string, props = {}): Style {
  return { className, props };
}

export function emptyStyle() {
  return createStyle("");
}
export function mergeStyle(style1: Style, style2: Style) {
  return {
    className: style1.className + " " + style2.className,
    props: {
      ...style1.props,
      ...style2.props,
    },
  };
}
