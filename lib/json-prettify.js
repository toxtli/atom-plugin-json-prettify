'use babel';

import JsonPrettifyView from './json-prettify-view';
import { CompositeDisposable } from 'atom';

export default {

  jsonPrettifyView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.jsonPrettifyView = new JsonPrettifyView(state.jsonPrettifyViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.jsonPrettifyView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'json-prettify:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.jsonPrettifyView.destroy();
  },

  serialize() {
    return {
      jsonPrettifyViewState: this.jsonPrettifyView.serialize()
    };
  },

  toggle() {
    editor = atom.workspace.getActiveTextEditor();
    text = editor.getText();
    try {
      editor.setText(JSON.stringify(JSON.parse(text), null, 2));
    } catch(e) {
      this.jsonPrettifyView.setElement(e.message);
      if(this.modalPanel.isVisible()) {
        this.modalPanel.hide();
      } else {
        this.modalPanel.show();
      }
    }

    console.log('JsonPrettify was toggled!');
    return true;
    // return (
    //  this.modalPanel.isVisible() ?
    //  this.modalPanel.hide() :
    //  this.modalPanel.show()
    // );
  }

};
