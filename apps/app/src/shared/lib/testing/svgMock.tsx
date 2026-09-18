import { forwardRef, SVGProps } from 'react';

const SvgMock = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => <svg ref={ref} data-testid="svg-mock" {...props} />,
);

SvgMock.displayName = 'SvgMock';

export default SvgMock;
export const ReactComponent = SvgMock;
