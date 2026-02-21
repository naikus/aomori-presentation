// import Stage from "@naikus/stage";
import {For, Show, createSignal, onMount, onCleanup} from "solid-js";
import {render} from "solid-js/web";
import {notify} from "@components/notifications/Notifications";
import Map from "@components/map/JapanMap";
import "./style.less";

import img1 from "/assets/1.svg";
import img2 from "/assets/2.svg";
import img3 from "/assets/3.svg";
import img4 from "/assets/4.svg";

export default{
  id: "start",
  template: `<div class="stage-view start"></div>`,
  factory(appContext, viewUi, viewConfig) {
    const router = appContext.getRouter(),
        config = appContext.getConfig(),

        Content = function(props) {
          return (
            <div class="content">
              <div class="p-slide start">
                <div class="body">
                  <div class="map">
                    <Map />
                  </div>
                  <div class="info">
                    <div class="card">
                      { /* <img src="https://www.japan-guide.com/thumb/XYZeXYZe3755_375.jpg" /> */ }
                      <img src="https://thumbs.dreamstime.com/b/hirosaki-castle-aomori-japan-36162882.jpg" />
                      <div class="card-title">
                        青森県
                      </div>
                      <div class="card-content">
                        <ul class="section card-info-list">
                          <li>どこ： 日本の　とうほく ちほう（Region）</li>
                          <li>人口： 1,18,0000</li>
                          <li>首都：青森　まち</li>
                          <li class="no-hover">
                            <span>季節：</span>
                            <ul class="section seasons">
                              <li class="spring">
                                <img src={img3} />
                                <span class="s">春</span>
                                <span>(3月-5月)</span>
                              </li>
                              <li class="summer">
                                <img src={img1} />
                                <span class="s">夏</span>
                                <span>(6月-8月)</span>
                              </li>
                              <li class="autumn">
                                <img src={img4} />
                                <span class="s">秋</span>
                                <span>(9月-11月)</span>
                              </li>
                              <li class="winter">
                                <img src={img2} />
                                <span class="s">冬</span>
                                <span>(12月-2月)</span>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        },

        renderContent = (viewOpts, done) => {
          /*
          if(dispose) {
            dispose();
          }
          */
          dispose = render(() => <Content options={viewOpts} />, viewUi);
          done && done();
        },

        handleTransitionOut = () => {
          dispose && dispose();
        };

    let dispose;

    return {
      initialize(viewOpts, done) {
        viewUi.addEventListener("transitionout", () => (dispose && dispose()));
      },
      activate(viewOpts, done) {
        renderContent(viewOpts, done);  
      },
      destroy() {
        dispose();
      }
    };
  }
};
