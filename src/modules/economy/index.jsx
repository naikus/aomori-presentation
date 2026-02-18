// import Stage from "@naikus/stage";
import {render} from "solid-js/web";
import {createSignal} from "solid-js";
import Overlay from "@components/overlay/Overlay";
import aoMoriFlag from "../../assets/aomori-flag.svg";

import "./style.less";

export default {
  id: "economy",
  template: `<div class="stage-view no-actionbar economy"></div>`,
  factory(appContext, viewUi, viewConfig) {
    const goBack = _ => appContext.getRouter().back(),
        [viewOptions, setViewOptions] = createSignal({}),
        Content = function(props) {
          const {appName, appVersion, branding, logo} = appContext.getConfig(),
              [show, setShow] = createSignal(false),
              toggleOverlay = _ => setShow(!show());

          return (
            <div class="content text-center">
              <div class="p-slide">
                <div class="title">けいざい</div>
                <div class="body">
                </div>
              </div>
            </div>
          );
        },

        handleTransitionOut = _ => {
          // console.log(_);
          dispose && dispose();
        };

    let dispose;
    return {
      initialize(viewOpts) {
        viewUi.addEventListener("transitionout", handleTransitionOut);
      },
      activate(viewOpts, done) {
        setViewOptions(viewOpts);
        dispose = render(() => <Content />, viewUi);
        done();
      },

      deactivate() {
      }
    };
  }
};
