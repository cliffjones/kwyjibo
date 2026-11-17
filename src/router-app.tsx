import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { App } from './app';
import { DEFAULT_LANG, LANG, PLACEHOLDER_PATTERN, RTL_LANGS } from './constants';
import { loadItems } from './processing/load-items';
import { createAppStore, type AppStore } from './store';
import { loadTokens } from './store/load-tokens';
import { saveTokens } from './store/save-tokens';

type RouteLoad = { path: string; sourcePath: string; store: AppStore } | { path: string; error: Error };

export const RouterApp = () => {
  const { pathname: path, search, hash } = useLocation();
  const navigate = useNavigate();
  const [routeLoad, setRouteLoad] = useState<RouteLoad | null>(null);

  useEffect(() => {
    let canceled = false;

    const routeTokens: string[] = [];
    const sourcePath =
      path
        .split('/')
        .filter((segment) => {
          if (!segment.startsWith('=')) {
            return true;
          }

          const token = segment.slice(1);
          if (token) {
            routeTokens.push(token);
          }
          return false;
        })
        .join('/') || '/';
    const tokens = [...new Set([...loadTokens(), ...routeTokens])];
    if (routeTokens.length) {
      saveTokens(tokens);
    }

    if (path !== sourcePath) {
      navigate({ pathname: sourcePath, search, hash }, { replace: true });
      return () => {
        canceled = true;
      };
    }

    void loadItems(sourcePath, tokens)
      .then((data) => {
        // A route change makes this request stale, so don't replace the active route with this result.
        if (!canceled) {
          const [configData, ...items] = data;
          const language = configData.language || DEFAULT_LANG;
          document.documentElement.lang = language;
          document.documentElement.dir = RTL_LANGS.includes(language) ? 'rtl' : 'ltr';
          setRouteLoad({ path, sourcePath, store: createAppStore(sourcePath, configData, items, tokens) });
        }
      })
      .catch((error: unknown) => {
        const message = LANG.unableToLoadMessage.replace(PLACEHOLDER_PATTERN, `"${sourcePath}"`);
        console.error(message, error);
        if (!canceled) {
          setRouteLoad({
            path,
            error: error instanceof Error ? error : new Error(String(error)),
          });
        }
      });

    return () => {
      canceled = true;
    };
  }, [hash, navigate, path, search]);

  if (!routeLoad || routeLoad.path !== path) {
    return <div>{LANG.loadingMessage}</div>;
  }

  if ('error' in routeLoad) {
    return <div role="alert">{LANG.unableToLoadPathMessage}</div>;
  }

  return (
    <Provider store={routeLoad.store}>
      <App path={routeLoad.sourcePath} />
    </Provider>
  );
};
