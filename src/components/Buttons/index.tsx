import classNames from 'classnames';
import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  PropsWithChildren,
} from 'react';

interface ButtonProps
  extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  outline?: boolean;
}

export default function Button({outline, ...props}: ButtonProps) {
  let classes = classNames('btn', {
    outline: outline,
    disabled: props.disabled,
  });

  return (
    <button className={classes} {...props}>
      {props.children}
    </button>
  );
}

interface ButtonLinkProps
  extends PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>> {
  outline?: boolean;
}

export function ButtonLink({outline, ...props}: ButtonLinkProps) {
  let classes = classNames('btn', {
    outline: outline,
  });

  return (
    <a className={classes} {...props}>
      {props.children}
    </a>
  );
}
