import {Show, createSignal, onCleanup, onMount} from "solid-js";
import createRouter from "simple-router";

import Stage from "@naikus/stage";
import "@node_modules/@naikus/stage/src/stage.less";

import {Notifications, notify} from "@components/notifications/Notifications";
import Progress from "@components/progress/Progress";
import {addListener} from "@lib/event-utils";
import Config from "@config";
import Navigator from "./modules/slide-navigator";

import "./style.less";

/**
 * @typedef {import("simple-router/src/types").Router} Router
 * @typedef {import("simple-router/src/types").RouteInfo} RouteInfo
 * @typedef {import("simple-router/src/types").create} createRouter
 * @typedef {import("solid-js").JSXElement} JSXElement
 */


function NavButton(props) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g class={`nav-button ${props.class}`}>
        <path d="M10.5 9L13.5 12L10.5 15" 
            stroke-width="2.5" 
            stroke-linecap="round" 
            stroke-linejoin="round"/>
        <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" 
            fill="transparent"
            onClick={props.onClick}
            stroke-width="2.5" 
            stroke-linecap="round"/>
      </g>
    </svg>
  );
}

/**
 *
 * @param {{
 *  routes: RouteDefn[]
 *  transition: string
 * }} props
 */
function App(props) {
  const noop = () => {},
      [isRouteLoading, setRouteLoading] = createSignal(false);

  let viewport,
      stageInstance,
      eventUnsubscribes,
      router,
      slideNavigator,
      routerUnsubscribers;

  function stageContextFactory(stage, stageOpts) {
    return {
      getRouter() {
        return router;
      },
      pushView(viewId, options) {
        // @todo Check if view is allowed for the current user
        // console.log("[App]: Pushing view", viewId, options);
        // return stage.pushView(viewId, options);
        throw new Error("Use router.route()");
      },
      popView(options) {
        // @todo Check if view is allowed for the current user
        // return stage.popView(options);
        throw new Error("Use router.back()");
      },
      getViewConfig(viewId) {
        return stage.getViewConfig(viewId);
      },
      getConfig() {
        return Config;
      }
    };
  }

  function setupStage() {
    const instance = Stage({
        viewport,
        // available transitions: slide, fade, fancy, lollipop, slide-up, slide-down, pop-out
        transition: props.transition || "slide-fade",
        transitionDelay: 100,
        contextFactory: stageContextFactory
      }),

      eventUnsubscribes = [
        addListener(viewport, "viewloadstart", noop),
        addListener(viewport, "viewloadend", noop),
        addListener(viewport, "beforeviewtransitionin", noop),
        addListener(viewport, "beforeviewtransitionout", noop)
      ];

    return [instance, eventUnsubscribes];
  }

  function setupRouter() {
    const router = createRouter(props.routes, {
      defaultRoute: "/",
      errorRoute: "/~error"
    });

    const routerSubs = [
      router.on("before-route", event => {
        setRouteLoading(true);
      }),
      router.on("route", event => {
        setRouteLoading(false);
        const context = event.detail,
            {route, view, handler} = context,
            {state, action, params} = route,
            // viewContext = stageInstance.getViewContext(),
            currentView = stageInstance.currentView(),
            viewOptions = Object.assign({}, params);

        if(view) {
          const {id, viewDef, config} = view;
          if(!stageInstance.getViewDefinition(id)) {
            // Stage.view(id, null, config);
            Stage.defineView(viewDef, config);
          }
          // showView(id, viewOptions, action);
          if((currentView === id) || action !== "POP") {
            stageInstance.pushView(id, viewOptions);
          }else {
            stageInstance.popView(viewOptions);
          }
        }else if(typeof handler === "function") {
          handler();
        }else {
          console.warn("No view or handler found for route", route);
        }
      }),
      router.on("route-error", (error) => {
        setRouteLoading(false);
        // console.warn("Error loading route", error);
        notify({
          type: "error",
          content: () => (
            <span>
              Error loading route: {error.message} <a href="#/">Home</a>
            </span>
          ),
          autoDismiss: false
        });
        throw error;
      })
    ];
    return [router, routerSubs];
  }

  onMount(() => {
    [router, routerUnsubscribers] = setupRouter();
    [stageInstance, eventUnsubscribes] = setupStage();
    router.start();
    // window.router = router;
    router.route(router.getBrowserRoute() || "/");

    slideNavigator = Navigator(router, [
      "/start",
      "/economy",
      "/tourism_culture",
      "/about"
    ]);
    /*
    eventUnsubscribes.push(
      addListener(document, "keyup", e => {
        const {keyCode} = e;
        if(keyCode === 39 || keyCode === 32) { // right arrow or space
          slideNavigator.next();
        }else if(keyCode === 37) {
          slideNavigator.previous();
        }
      })
    );
    */

    /*
    // Set theme based on system preference
    if(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.firstElementChild.dataset.theme = "dark";
    }else {
      document.firstElementChild.dataset.theme = "light";
    }
    */

  });

  onCleanup(() => {
    eventUnsubscribes && eventUnsubscribes.forEach(unsub => unsub());
    routerUnsubscribers && routerUnsubscribers.forEach(unsub => unsub());
  });

  return (
    <div class="app">
      <div ref={viewport} class="stage-viewport" />
      <div class="navigation">
        <NavButton class="previous" onClick={() => slideNavigator.previous()} />
        <NavButton class="next" onClick={() => slideNavigator.next()} />
      </div>
      <div class="caption">
        <div class="item main">青森県</div>
        <div class="item">東北 地方</div>
        <div class="item ">日本</div>
      </div>
      <Show when={isRouteLoading()}>
        <Progress class="route-progress" />
      </Show>
      <Notifications />
    </div>
  );
}

export default App;
