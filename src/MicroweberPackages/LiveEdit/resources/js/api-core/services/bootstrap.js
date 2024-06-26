import './index.js'

import {MWUniversalContainer} from "./containers/container.js";


import {Commands} from "./services/commands.js";
import {Modules} from "./services/modules.js";
import {Layouts} from "./services/layouts.js";
import {License} from "./services/license.js";
import {KeyboardEvents} from  "./services/keyboard-events.js";
import {IconPicker} from "./services/icon-picker";
import {LinkPicker} from "./services/link-picker";
import {ColorPicker} from "./services/color-picker";
import '@nextapps-be/livewire-sortablejs';

// other libs
import Alpine from 'alpinejs';
import focus from '@alpinejs/focus';
import { DynamicTargetMenus } from './services/dynamic-target-menus.js';
import {LiveEditCanvas} from "./components/live-edit-canvas/live-edit-canvas";
import { SingleFilePickerComponent } from './services/single-file-picker-component.js';
import { MWBroadcast } from './services/broadcast.js';
import { MWDocumentFocus } from './services/document.focus.service.js';
import { da } from 'vuetify/locale';
import { MWPageAlreadyOpened } from './components/live-edit/page-already-opened.service.js';

mw.app = new MWUniversalContainer();


    const canvasSetUrlInterceptor = async (url) => {
        return new Promise((resolve) => {
            if(mw.top().app.documentFocus.isActive()) {

            } else {

            }
        });
    };


    const canvas = new LiveEditCanvas({
        onSetUrl: canvasSetUrlInterceptor
    });




    mw.app.register('documentFocus', MWDocumentFocus);
    mw.app.register('broadcast', MWBroadcast);
    mw.app.register('canvas', canvas);
    mw.app.register('commands', Commands);
    mw.app.register('modules', Modules);

    mw.app.register('layouts', Layouts);
    mw.app.register('license', License);
    mw.app.register('keyboard', KeyboardEvents);
    mw.app.register('iconPicker', IconPicker);
    mw.app.register('linkPicker', LinkPicker);
    mw.app.register('colorPicker', ColorPicker);
    mw.app.register('dynamicTargetMenus', DynamicTargetMenus);
    mw.app.register('pageAlreadyOpened', MWPageAlreadyOpened);


    mw.app.normalizeBase64Image = normalizeBase64Image;
    mw.app.normalizeBase64Images = normalizeBase64Images;

    mw.app.singleFilePickerComponent = options => {
        return new SingleFilePickerComponent(options)
    };


    let sameUrlDialog = false;


    const handleSameUrl = async () => {
        let url = mw.top().app.canvas.getUrl();

        const isLiveEdit = !!mw.top().app.canvas && mw.top().app.canvas.getWindow() && (self === top || self.frameElement.id === 'live-editor-frame');


        if(isLiveEdit && sameUrlDialog) {
            if(mw.top().app.canvas.getWindow() && mw.top().app.canvas.isUrlOpened(url) && mw.top().app.canvas.isUrlSame(url)  ) {


                const action = await mw.app.pageAlreadyOpened.handle(url);

                if(action) {

                } else {
                    mw.top().win.location.href = mw.top().settings.adminUrl;
                }

            }
        }
    }



    mw.top().app.canvas.on('liveEditCanvasLoaded', async function() {
        await handleSameUrl();
    });

    mw.top().storage.change('mw-broadcast-data', async function() {

        await handleSameUrl();


    });








    function normalizeBase64Image (node, callback) {
        var type, obj;
        if (typeof node.src !== 'undefined' && node.src.indexOf('data:image/') === 0) {
            type = node.src.split('/')[1].split(';')[0];
            obj = {
                file: node.src,
                name: mw.random().toString(36) + "." + type
            }
            $.post(mw.settings.api_url + "media/upload", obj, function (data) {
                data = $.parseJSON(data);
                node.src = data.src;

                mw.top().app.registerChange(node);

                mw.trigger('imageSrcChanged', [node, node.src]);
                if (typeof callback === 'function') {
                    callback.call(node);
                }
            });
        }
        else if (node.style.backgroundImage.indexOf('data:image/') !== -1) {
            var bg = node.style.backgroundImage.replace(/url\(/g, '').replace(/\)/g, '')
            type = bg.split('/')[1].split(';')[0];
            obj = {
                file: bg,
                name: mw.random().toString(36) + "." + type
            };
            $.post(mw.settings.api_url + "media/upload", obj, function (data) {
                data = $.parseJSON(data);
                node.style.backgroundImage = 'url(\'' + data.src + '\')';


                mw.top().app.registerChange(node);
                if (typeof callback === 'function') {
                    callback.call(node);
                }
            });
        }
    };

    function normalizeBase64Images  (root, callback) {
        root = root || document.body;
        var all = root.querySelectorAll(".edit img[src*='data:image/'], .edit [style*='data:image/'][style*='background-image'], .mw-editor-area img[src*='data:image/'], .mw-editor-area [style*='data:image/'][style*='background-image']"),
            l = all.length, i = 0, count = 0;
        if (l > 0) {
            var btn = document.getElementById('main-save-btn');
            var btnPrev;
            if(btn){
                btnPrev = btn.disabled;
                btn.disabled = true;
            }
            for (; i < l; i++) {
                mw.tools.addClass(all[i], 'element');
                mw.wysiwyg.normalizeBase64Image(all[i], function (){
                    count++;
                    if(count === l) {
                        if(typeof callback === 'function') {
                            setTimeout(function(){
                                callback.call();
                            }, 10)
                        }
                        if(btn){
                            btn.disabled = btnPrev;
                        }
                    }
                });
            }
        } else {
            if(typeof callback === 'function') {
                setTimeout(function(){
                    callback.call();
                }, 10)
            }
        }
    };


//mw.app.register('commands', Commands);

// mw.app.domTreeSelect = function(node) {
//     // deprecated
//     // if(!mw.top().app._liveEditDomTree) {
//     //     return;
//     // }
//     //
//     // mw.top().app._liveEditDomTree.select(node)
// }


//}, 300);

// init other libs
window.Alpine = Alpine;
Alpine.plugin(focus);

Alpine.start();
