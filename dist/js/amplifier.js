(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(function(){
      return factory(root);
    });
  } else if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = factory(root);
  } else {
    root.amplifier = factory(root);
  }
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function (window) {
  var amplifier = function (selector, imgClassName) {
   
    var body = document.body, // dom body
      mask, // the HTMLelement to mask page
      center_el, // the HTMLelement to align center (horizatal, vertical) on mask
      scale_el // the HTMLelement to scale on center_el


    //default settings for init
    var options = {
      transitionDuration: '.35s',
      transitionTimingFunction: 'cubic-bezier(.4,0,0,1)',
      bgColor: 'rgba(255, 255, 255, .8)',
      scale: 2,
      onOpen: null,
      onClose: null,
      onBeforeClose: null,
      onBeforeOpen: null,
      display: 'block'
    }

    // IE compatibility
    var inBrowser = typeof window !== 'undefined'
    var UA = inBrowser && window.navigator.userAgent.toLowerCase();
    var isIE = UA && /msie|trident/.test(UA);

    /**
     * merge object
     * @param {Object} target the 1st argument is object by merged, extra arguments is the sources to merge
     * @return {Object} return merged object
     */
    var merge = function (target) {
      for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i] || {};
          for (var key in source) {
              if (source.hasOwnProperty(key) && source[key] !== undefined) {
                  target[key] = source[key]
              }
          }
      }
      return target;
    }


    /**
     * get the translation of HTMLElment to center
     * @param {HTMLElment} elem
     * @return {Object}
     */
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


    /**
     * add parentNode for target
     * @param {HTMLElment} target HTMLElment
     * @return {HTMLElment} a HTMLElment with wrapper
     */
    var appendImgWrapper = function (target) {
      var wrapper = document.createElement('div')
      var target_ = target.cloneNode(true)
      wrapper.appendChild(target_)
      target.parentNode.replaceChild(wrapper, target)
      return wrapper
    }


    /**
     * remove parentNode
     * @param {HTMLElment} wrapper HTMLElment
     * @return {HTMLElment} a HTMLElment without wrapper
     */
    var removeImgWrapper = function (wrapper) {
      var pureEL = wrapper.children[0]
      wrapper.parentNode.replaceChild(pureEL, wrapper)
      return pureEL
    }


    /**
     * set style for target
     * @param {HTMLElment} target HTMLElment
     * @param {Object} styles  an object with some styles
     * @return {HTMLElment} return HTMLElment with some styles
     */
    var setStyle = function (target, styles) {
      for (var style in styles) {
        target.style[style] = styles[style]
      }

      return target
    }

    /**
     * transfer time string to number
     * @param {HTMLElment} timeString a string with time, like 0.34s
     * @return {Number} return number
     */
    var timePatch = function (timeString) { 
      if (timeString.indexOf('.') == 0)  timeString = '0' + timeString.replace('s', '')
      return Number(timeString) * 1000
    }

    /**
     * close -> restore 
     * @param {HTMLElment} domBody document body
     * @param {HTMLElment} centerElement  the centerElement need to restore
     * @param {HTMLElment} scaleElement the scaleElement need to restore
     * @param {HTMLElment} maskElement the maskElement need to restore
     */
    var close = function (domBody, centerElement, scaleElement, maskElement) {
      if (typeof options.onBeforeClose === 'function') {
            options.onBeforeClose()
      }
      //async end animation
      setTimeout(function () {
        var els = [scaleElement, centerElement, maskElement]
        var styleList = [
          {
            cursor: isIE ? 'pointer' : 'zoom-in',
            transform: ''
          },
          {
            transform: ''
          },
          {
            opacity: '0',
            zIndex: ''
          }
        ]

        var len = els.length

        while (len--)
          setStyle(els[len], styleList[len])

        setTimeout(function () {
          domBody.removeChild(maskElement)
          removeImgWrapper(centerElement)
          if (typeof options.onClose === 'function') {
            options.onClose(scaleElement)
          }
        }, timePatch(options.transitionDuration))

      }, 10)
    }


    /**
     * create a mask HTMLElment
     * @return {HTMLElement}
     */
    var createMask = function () {
      var mask_el = document.createElement('div')
      return setStyle(mask_el, {
        backgroundColor: options.bgColor,
        position: 'fixed',
        opacity: '0',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
        transition: 'opacity' + ' ' + options.transitionDuration + ' ' + options.transitionTimingFunction

      })
    }


    /**
     * open -> start the animation
     * @param {Object} distance  an object width x-distance, y-distance
     * @param {HTMLElment} centerElement  the centerElement need to center
     * @param {HTMLElment} scaleElement the scaleElement need to scale
     * @param {HTMLElment} maskElement the maskElement need to mask
     */
    var open = function (maskElement, centerElement, scaleElement, distance) {
       if (typeof options.onBeforeOpen === 'function') {
          options.onBeforeOpen()
       }
       //async start animation
       setTimeout(function () {
          var els = [scaleElement, centerElement, maskElement]
          var styleList = [
            {
              cursor: isIE ? 'pointer' : 'zoom-out',
              transform: 'scale('+ options.scale + ')'
            },
            {
              zIndex: '9999',
              transform: 'translate(' + distance.x + 'px,' + distance.y + 'px)'
            },
            {
              opacity: '',
              zIndex: '1000'
            }
          ]

          var len = els.length

          while (len--)
            setStyle(els[len], styleList[len])

          if (typeof options.onOpen === 'function') {
              options.onOpen(scaleElement)
          }

      }, 6)

    }

   
    // a click handler for image by binded
    var handlerClick = function (e) {
      var target = e.target;

      e.stopPropagation();

      //bind the target by imgClassName
      if (target.className.indexOf(imgClassName) > -1) {
        //confirm scale status and then close
        if (target.style.cssText.indexOf('transform: scale(' + options.scale + ')') > -1) {
          close(body, center_el, scale_el, mask)
          return;
        }

        //get the center HTMLElment by event target and set the styles
        center_el = 
        setStyle(appendImgWrapper(target), {display: options.display, position: 'relative', transition: 'all' + ' ' + options.transitionDuration + ' ' + options.transitionTimingFunction})
        //get the scale HTMLElment by event center_el and set the styles
        scale_el = 
        setStyle(center_el.children[0], { transition: 'all' +  ' ' + options.transitionDuration + ' ' + options.transitionTimingFunction })
        //create a mask HTMLElment
        mask = createMask()

        body.appendChild(mask)

        open(mask, center_el, scale_el, getTranslation(center_el))
    
      }
    }

    //public apis
    var publicApis = {}

    publicApis.init = function (options_) {
      var clickImgs = document.querySelectorAll('.' + imgClassName)
      var clickAgent = document.querySelector(selector)

      //mrege options
      options = merge(options, options_)

      // init img's cursor
      for (var i = 0; i < clickImgs.length; i++) {
          setStyle(clickImgs[i], {cursor: isIE ? 'pointer' : 'zoom-in'})
      }

      //add then event listenr
      clickAgent.addEventListener('click', handlerClick, false)
    }

    publicApis.destory = function () {
      //reset defult
      mask = null
      center_el = null
      scale_el = null
      //remove then event listenr
      clickAgent.removeEventListener('click', handlerClick);
    }

    //return apis
    return publicApis
  }
  return amplifier;
})
