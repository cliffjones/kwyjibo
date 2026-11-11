import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { useLocation } from 'react-router';
import { App } from './app';
import { LANG, PLACEHOLDER_PATTERN } from './constants';
import { loadItems } from './processing/load-items';
import { createAppStore, type AppStore } from './store';

type RouteLoad = { path: string; store: AppStore } | { path: string; error: Error };

export const RouterApp = () => {
  const { pathname } = useLocation();
  const [routeLoad, setRouteLoad] = useState<RouteLoad | null>(null);

  useEffect(() => {
    let canceled = false;

    void loadItems(pathname)
      .then((data) => {
        // A route change makes this request stale, so don't replace the active route with this result.
        if (!canceled) {
          const [configData, ...items] = data;
          document.documentElement.lang = configData.language || 'en';
          setRouteLoad({ path: pathname, store: createAppStore(pathname, configData, items) });
        }
      })
      .catch((error: unknown) => {
        const message = LANG.unableToLoadMessage.replace(PLACEHOLDER_PATTERN, `"${pathname}"`);
        console.error(message, error);
        if (!canceled) {
          setRouteLoad({
            path: pathname,
            error: error instanceof Error ? error : new Error(String(error)),
          });
        }
      });

    return () => {
      canceled = true;
    };
  }, [pathname]);

  if (!routeLoad || routeLoad.path !== pathname) {
    return <div>{LANG.loadingMessage}</div>;
  }

  if ('error' in routeLoad) {
    return <div role="alert">{LANG.unableToLoadPathMessage}</div>;
  }

  return (
    <Provider store={routeLoad.store}>
      <App path={pathname} />
    </Provider>
  );
};
