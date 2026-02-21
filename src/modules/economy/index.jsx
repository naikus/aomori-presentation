// import Stage from "@naikus/stage";
import {render} from "solid-js/web";
import {createSignal} from "solid-js";
import Overlay from "@components/overlay/Overlay";

import imgAppleFarm from "./images/apple-farm.jpg";
import imgFarmLand from "./images/farm-land.jpg";
import imgRedCurrant from "./images/red-currant.jpg";

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
                  <div class="left">
                    <img src={imgAppleFarm} class="aomori-flag" />
                    <img src={imgFarmLand} class="aomori-flag" />
                    <img src={imgRedCurrant} class="aomori-flag" />
                  </div>
                  <div class="right">
                    <h4>けいざい は　おもに　二つ　あります：</h4>
                    <ul class="data-list">
                      <li class="heading">農業(のうぎょう)</li>
                      <li>日本では　せいだい（largest)　の　リンゴ　を　そだてて　いる　場所。</li>
                      <li class="heading">観光業(かんこうぎょう)</li>
                      <li>日本では　せいだい（largest)　の　リンゴ　を　そだてて　いる　場所。</li>
                    </ul>
                  </div>
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
