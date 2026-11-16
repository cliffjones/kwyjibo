import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { useLocation } from 'react-router';
import { App } from './app';
import { DEFAULT_LANG, LANG, PLACEHOLDER_PATTERN, RTL_LANGS } from './constants';
import { loadItems } from './processing/load-items';
import { createAppStore, type AppStore } from './store';

type RouteLoad = { path: string; store: AppStore } | { path: string; error: Error };

export const RouterApp = () => {
  const { pathname: path } = useLocation();
  const [routeLoad, setRouteLoad] = useState<RouteLoad | null>(null);

  useEffect(() => {
    let canceled = false;

    /** @todo: Split `path` into segments split by `/`, and if any segment begins with `=`, then remove it from `path` and add the value (minus the initial `=`) to the store and local storage under an optional root-level (not dependent on the URL) array of strings named `tokens`. */

    void loadItems(path)
      .then((data) => {
        // A route change makes this request stale, so don't replace the active route with this result.
        if (!canceled) {
          const [configData, ...items] = data;
          const language = configData.language || DEFAULT_LANG;
          document.documentElement.lang = language;
          document.documentElement.dir = RTL_LANGS.includes(language) ? 'rtl' : 'ltr';
          setRouteLoad({ path: path, store: createAppStore(path, configData, items) });
        }
      })
      .catch((error: unknown) => {
        const message = LANG.unableToLoadMessage.replace(PLACEHOLDER_PATTERN, `"${path}"`);
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
  }, [path]);

  if (!routeLoad || routeLoad.path !== path) {
    return <div>{LANG.loadingMessage}</div>;
  }

  if ('error' in routeLoad) {
    return <div role="alert">{LANG.unableToLoadPathMessage}</div>;
  }

  return (
    <Provider store={routeLoad.store}>
      <App path={path} />
    </Provider>
  );
};
