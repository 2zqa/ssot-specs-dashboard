import classNames, { type Argument } from 'classnames';

/**
 * Use the classnames library to build the CSS string.
 */
export function getClasses(...args: Array<Argument>) {
  return classNames(args);
}
