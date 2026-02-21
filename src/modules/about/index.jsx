// import Stage from "@naikus/stage";
import {render} from "solid-js/web";
import {createSignal} from "solid-js";
import Overlay from "@components/overlay/Overlay";
import aoMoriFlag from "../../assets/aomori-flag.svg";

import "./style.less";

export default {
  id: "about",
  template: `<div class="stage-view no-actionbar about"></div>`,
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
                <div class="body">
                  <img src={aoMoriFlag} />
                  <p>おわり！</p>
                  <span class="attribution">
                    Made with <span class="love">♥︎</span> by Aniket Naik
                  </span>
                  <span class="attribution">
                    <a target="_blank" href="https://naikus.github.io/stage">Stage.js</a>
                  </span>
                </div>
              </div>
            </div>
          );
        };

    let dispose;
    return {
      initialize(viewOpts) {
        viewUi.addEventListener("transitionout", () => (dispose && dispose()));
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
