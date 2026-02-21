import {notify} from "@components/notifications/Notifications";
import {extractQueryParams} from "@lib/route-utils";

/**
 * @typedef {import("simple-router/src/types").RouteDefn} RouteDefn
 */

/**
 * @type {RouteDefn[]}
 */
export default [
  {
    path: "/",
    controller() {
      return {
        // forwards are handled by the router itself
        forward: "/start"
      };
    }
  },
  {
    path: "/start{\\?*query}",
    controller: async (context) => {
      const {route} = context,
          queryParams = extractQueryParams(route);
      return import("./modules/start/index").then(viewDef => {
        return {
          view: {
            id: "start",
            viewDef: viewDef.default || viewDef,
            config: {}
          }
        };
      });
    }
  },
  {
    path: "/economy{\\?*query}",
    controller(context) {
      const {route} = context;
      route.params = extractQueryParams(route);

      return import("./modules/economy/index").then(viewDef => {
        return {
          view: {
            id: "economy",
            viewDef: viewDef.default || viewDef,
            config: {
              actionBar: false,
              transition: "slide-up"
            }
          }
        };
      });
    }
  },
  {
    path: "/tourism_culture{\\?*query}",
    controller(context) {
      const {route} = context;
      route.params = extractQueryParams(route);

      return import("./modules/tourism-culture/index").then(viewDef => {
        return {
          view: {
            id: "tourism_culture",
            viewDef: viewDef.default || viewDef,
            config: {
              actionBar: false
            }
          }
        };
      });
    }
  },
  {
    path: "/about{\\?*query}",
    controller(context) {
      const {route} = context;
      route.params = extractQueryParams(route);

      return import("./modules/about/index").then(viewDef => {
        return {
          view: {
            id: "about",
            viewDef: viewDef.default || viewDef,
            config: {
              actionBar: false
            }
          }
        };
      });
    }
  }
];
