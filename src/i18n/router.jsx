// Обгортки над react-router, які автоматично додають мовний префікс (/ru) до внутрішніх шляхів.
import { forwardRef, useCallback } from 'react';
import {
  Link as RRLink,
  NavLink as RRNavLink,
  Navigate as RRNavigate,
  useNavigate as useRRNavigate,
} from 'react-router-dom';
import { useLang, localizePath } from './LangContext';

function useLocalizeTo() {
  const { lang } = useLang();
  return useCallback((to) => {
    if (typeof to === 'string') return localizePath(to, lang);
    if (to && typeof to === 'object' && typeof to.pathname === 'string') {
      return { ...to, pathname: localizePath(to.pathname, lang) };
    }
    return to;
  }, [lang]);
}

export const Link = forwardRef(function Link({ to, ...rest }, ref) {
  const localize = useLocalizeTo();
  return <RRLink ref={ref} to={localize(to)} {...rest} />;
});

export const NavLink = forwardRef(function NavLink({ to, ...rest }, ref) {
  const localize = useLocalizeTo();
  return <RRNavLink ref={ref} to={localize(to)} {...rest} />;
});

export function Navigate({ to, ...rest }) {
  const localize = useLocalizeTo();
  return <RRNavigate to={localize(to)} {...rest} />;
}

export function useNavigate() {
  const navigate = useRRNavigate();
  const localize = useLocalizeTo();
  return useCallback(
    (to, opts) => (typeof to === 'number' ? navigate(to) : navigate(localize(to), opts)),
    [navigate, localize]
  );
}
