

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return factory(root);
        });
    } else if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = factory(root);
    } else {
        root.amplifier = factory(root);
    }
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function (window) {
    var amplifier = function (selector) {
        var body = document.body,
            mask = null, //the topest layout except the element local centre
            center_el = null, // element to center (horizatal, vertical)
            scale_el = null; // element to scale

        var wrapper = document.querySelector(selector);

        var getTranslation = function (elem) {
            if (elem == undefined || typeof elem.nodeType == 'undefined' || elem.nodeType != 1) {
                throw new TypeError("The 1st parameter must be a HTMLElement");
            }

            var domRect = elem.getBoundingClientRect(),
                centerDistance = {
                    x: 0,
                    y: 0
                };


            centerDistance.x = body.clientWidth / 2 - domRect.left - domRect.width / 2;
            centerDistance.y = body.clientHeight / 2 - domRect.top - domRect.height / 2;

            return centerDistance;

        }

        //使放大的图片在同层的元素中z-index最高
        var zIndex = 0;


        var backToOrigin = function (domBody, centerElement, scaleElement) {
            //async end animation
            domBody.removeChild(mask)
            setTimeout(function () {
                centerElement.classList.remove('amplifier_maxIndex')
                centerElement.style.zIndex = ++zIndex //当active的item恢复默认状态的过程中，优先级最高不会被其他item遮挡
                centerElement.style.transform = 'translate(0, 0)'
                scaleElement.classList.remove('amplifier_scale')
            }, 10)
        }

        var createMask = function () {
            var mask_el = null
            mask_el = document.createElement('div')
            mask_el.classList.add('amplifier_mask')
            return mask_el
        }

        var goDestination = function (maskElement, centerElement, scaleElement, distance) {
            maskElement.classList.add('amplifier_fade')
            centerElement.classList.add('amplifier_maxIndex')
            centerElement.style.transform = 'translate(' + distance.x + 'px,' + distance.y + 'px)';
            scaleElement.classList.add('amplifier_scale')
        }

        var handlerClick = function (e) {
            var target = e.target;

            e.stopPropagation();

            //锁定点击的元素为amplifier_img
            if (target.className.indexOf('amplifier_img') > -1) {
                //prevent repeat toggle scale and return to default status
                if (target.className.indexOf('amplifier_scale') > -1) {
                    backToOrigin(body, center_el, scale_el)
                    return;
                }

                //ready for animation
                scale_el = target
                center_el = target.parentNode
                mask = createMask();
                body.appendChild(mask)

                //async start animation
                setTimeout(function () {
                    goDestination(mask, center_el, scale_el, getTranslation(center_el))
                }, 20)
            }
        }

        var publicApis = {}

        publicApis.init = function () {
            wrapper.addEventListener('click', handlerClick, false)
        }

        publicApis.destory = function () {
            mask = null
            center_el = null
            scale_el = null
            wrapper.removeEventListener('click', handlerClick);
        }

        //return apis
        return publicApis
    }
    return amplifier;
})