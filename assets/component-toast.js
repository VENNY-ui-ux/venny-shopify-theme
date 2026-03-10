  /**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.1): toast.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.themegoal = global.themegoal || {},  global.themegoal.components = global.themegoal.components || {},  global.themegoal.components.Toast = factory()));
  })(this, (function () { 'use strict';

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'Toast'
  const DATA_KEY = 'tg.Toast'
  const EVENT_KEY = `.${DATA_KEY}`

  const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`
  const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`
  const EVENT_FOCUSIN = `focusin${EVENT_KEY}`
  const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`
  const EVENT_HIDE = `hide${EVENT_KEY}`
  const EVENT_HIDDEN = `hidden${EVENT_KEY}`
  const EVENT_SHOW = `show${EVENT_KEY}`
  const EVENT_SHOWN = `shown${EVENT_KEY}`

  const CLASS_NAME_FADE = 'Fade'
  const CLASS_NAME_HIDE = 'Hide' // @deprecated - kept here only for backwards compatibility
  const CLASS_NAME_SHOW = 'Show'
  const CLASS_NAME_SHOWING = 'Showing'

  const DefaultType = {
    animation: 'boolean',
    autohide: 'boolean',
    delay: 'number'
  }

  const Default = {
    animation: true,
    autohide: true,
    delay: 5000
  }

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Toast extends themegoal.components.BaseComponent {
    constructor(element, config) {
      super(element)

      this._config = this._getConfig(config)
      this._timeout = null
      this._hasMouseInteraction = false
      this._hasKeyboardInteraction = false
      this._setListeners()
    }

    // Getters

    static get DefaultType() {
      return DefaultType
    }

    static get Default() {
      return Default
    }

    static get NAME() {
      return NAME
    }

    // Public

    show() {
      const showEvent = themegoal.components.EventHandler.trigger(this._element, EVENT_SHOW)

      if (showEvent.defaultPrevented) {
        return
      }

      this._clearTimeout()

      if (this._config.animation) {
        this._element.classList.add(CLASS_NAME_FADE)
      }

      const complete = () => {
        this._element.classList.remove(CLASS_NAME_SHOWING)
        themegoal.components.EventHandler.trigger(this._element, EVENT_SHOWN)

        this._maybeScheduleHide()
      }

      this._element.classList.remove(CLASS_NAME_HIDE) // @deprecated
      themegoal.components.reflow(this._element)
      this._element.classList.add(CLASS_NAME_SHOW)
      this._element.classList.add(CLASS_NAME_SHOWING)

      this._queueCallback(complete, this._element, this._config.animation)
    }

    hide() {
      if (!this._element.classList.contains(CLASS_NAME_SHOW)) {
        return
      }

      const hideEvent = themegoal.components.EventHandler.trigger(this._element, EVENT_HIDE)

      if (hideEvent.defaultPrevented) {
        return
      }

      const complete = () => {
        this._element.classList.add(CLASS_NAME_HIDE) // @deprecated
        this._element.classList.remove(CLASS_NAME_SHOWING)
        this._element.classList.remove(CLASS_NAME_SHOW)
        themegoal.components.EventHandler.trigger(this._element, EVENT_HIDDEN)
      }

      this._element.classList.add(CLASS_NAME_SHOWING)
      this._queueCallback(complete, this._element, this._config.animation)
    }

    dispose() {
      this._clearTimeout()

      if (this._element.classList.contains(CLASS_NAME_SHOW)) {
        this._element.classList.remove(CLASS_NAME_SHOW)
      }

      super.dispose()
    }

    // Private

    _getConfig(config) {
      config = {
        ...Default,
        ...themegoal.components.Manipulator.getDataAttributes(this._element),
        ...(typeof config === 'object' && config ? config : {})
      }

      themegoal.components.typeCheckConfig(NAME, config, this.constructor.DefaultType)

      return config
    }

    _maybeScheduleHide() {
      if (!this._config.autohide) {
        return
      }

      if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
        return
      }

      this._timeout = setTimeout(() => {
        this.hide()
      }, this._config.delay)
    }

    _onInteraction(event, isInteracting) {
      switch (event.type) {
        case 'mouseover':
        case 'mouseout':
          this._hasMouseInteraction = isInteracting
          break
        case 'focusin':
        case 'focusout':
          this._hasKeyboardInteraction = isInteracting
          break
        default:
          break
      }

      if (isInteracting) {
        this._clearTimeout()
        return
      }

      const nextElement = event.relatedTarget
      if (this._element === nextElement || this._element.contains(nextElement)) {
        return
      }

      this._maybeScheduleHide()
    }

    _setListeners() {
      themegoal.components.EventHandler.on(this._element, EVENT_MOUSEOVER, event => this._onInteraction(event, true))
      themegoal.components.EventHandler.on(this._element, EVENT_MOUSEOUT, event => this._onInteraction(event, false))
      themegoal.components.EventHandler.on(this._element, EVENT_FOCUSIN, event => this._onInteraction(event, true))
      themegoal.components.EventHandler.on(this._element, EVENT_FOCUSOUT, event => this._onInteraction(event, false))
    }

    _clearTimeout() {
      clearTimeout(this._timeout)
      this._timeout = null
    }

    
  }

  themegoal.components.enableDismissTrigger(Toast)

  return Toast


}));