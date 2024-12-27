/**{START_EVENTS}*/
export enum EditorEvents {
  /**
   * @event `update` Event triggered on any change of the project (eg. component added/removed, style changes, etc.)
   * @example
   * editor.on('update', () => { ... });
   */
  update = 'update',

  /**
   * @event `undo` Undo executed.
   * @example
   * editor.on('undo', () => { ... });
   */
  undo = 'undo',

  /**
   * @event `redo` Redo executed.
   * @example
   * editor.on('redo', () => { ... });
   */
  redo = 'redo',

  /**
   * @event `project:load` Project JSON loaded in the editor. The event is triggered on the initial load and on the `editor.loadProjectData` method.
   * @example
   * editor.on('project:load', ({ project, initial }) => { ... });
   */
  projectLoad = 'project:load',

  /**
   * @event `log` Log message triggered.
   * @example
   * editor.on('log', (msg, opts) => { ... });
   */
  log = 'log',

  /**
   * @event `destroy` Editor started destroy (on `editor.destroy()`).
   * @example
   * editor.on('destroy', () => { ... });
   */
  destroy = 'destroy',

  /**
   * @event `destroyed` Editor destroyed.
   * @example
   * editor.on('destroyed', () => { ... });
   */
  destroyed = 'destroyed',
}
/**{END_EVENTS}*/
