import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { useLocation } from 'react-router';
import { App } from './app';
import { createAppStore, type AppStore } from './store';
import { loadItems } from './store/load-items';

type RouteLoad = { path: string; store: AppStore } | { path: string; error: Error };

export const RouterApp = () => {
  const { pathname } = useLocation();
  const [routeLoad, setRouteLoad] = useState<RouteLoad | null>(null);

  useEffect(() => {
    let canceled = false;

    void loadItems(pathname)
      .then(items => {
        // A route change makes this request stale, so don't replace the active route with this result.
        if (!canceled) {
          setRouteLoad({ path: pathname, store: createAppStore(pathname, items) });
        }
      })
      .catch((error: unknown) => {
        console.error(`Unable to load "${pathname}".`, error);
        if (!canceled) {
          setRouteLoad({
            path: pathname,
            error: error instanceof Error ? error : new Error(String(error))
          });
        }
      });

    return () => {
      canceled = true;
    };
  }, [pathname]);

  if (!routeLoad || routeLoad.path !== pathname) {
    return <div>Loading…</div>;
  }

  if ('error' in routeLoad) {
    return <div role="alert">Unable to load cards for this path.</div>;
  }

  return (
    <Provider store={routeLoad.store}>
      <App path={pathname} />
    </Provider>
  );
};
