import { CollectionsStateMap } from '../../data_sources/model/collection_component/types';
import { ObjectAny } from '../../common';
import DynamicVariableListenerManager from '../../data_sources/model/DataVariableListenerManager';
import { evaluateDynamicValueDefinition, isDynamicValueDefinition } from '../../data_sources/model/utils';
import { DynamicValue } from '../../data_sources/types';
import EditorModel from '../../editor/model/Editor';
import Component from './Component';

export class DynamicValueWatcher {
  private dynamicVariableListeners: { [key: string]: DynamicVariableListenerManager } = {};
  constructor(
    private component: Component | undefined,
    private updateFn: (component: Component | undefined, key: string, value: any) => void,
    private options: {
      em: EditorModel;
      collectionsStateMap?: CollectionsStateMap;
    },
  ) {}

  getStaticValues(values: ObjectAny | undefined): ObjectAny {
    if (!values) return {};
    const evaluatedValues: ObjectAny = { ...values };
    const propsKeys = Object.keys(values);

    for (const key of propsKeys) {
      const valueDefinition = values[key];
      if (!isDynamicValueDefinition(valueDefinition)) continue;

      const { value } = evaluateDynamicValueDefinition(valueDefinition, this.options);
      evaluatedValues[key] = value;
    }

    return evaluatedValues;
  }

  areStaticValues(values: ObjectAny | undefined) {
    if (!values) return true;
    return Object.keys(values).every((key) => {
      return !isDynamicValueDefinition(values[key]);
    });
  }

  bindComponent(component: Component) {
    this.component = component;
  }

  setDynamicValues(values: ObjectAny | undefined) {
    this.removeListeners();
    return this.addDynamicValues(values);
  }

  addDynamicValues(values: ObjectAny | undefined) {
    const em = this.options.em;
    if (!values) return {};
    this.removeListeners(Object.keys(values));
    const dynamicProps = this.getDynamicValues(values);
    const propsKeys = Object.keys(dynamicProps);
    for (let index = 0; index < propsKeys.length; index++) {
      const key = propsKeys[index];
      this.dynamicVariableListeners[key] = new DynamicVariableListenerManager({
        em: em,
        dataVariable: dynamicProps[key],
        updateValueFromDataVariable: (value: any) => {
          this.updateFn.bind(this)(this.component, key, value);
        },
      });
    }

    return dynamicProps;
  }

  private getDynamicValues(values: ObjectAny) {
    const dynamicValues: {
      [key: string]: DynamicValue;
    } = {};
    const propsKeys = Object.keys(values);
    for (let index = 0; index < propsKeys.length; index++) {
      const key = propsKeys[index];
      if (!isDynamicValueDefinition(values[key])) {
        continue;
      }
      const { variable } = evaluateDynamicValueDefinition(values[key], this.options);
      dynamicValues[key] = variable;
    }

    return dynamicValues;
  }

  /**
   * removes listeners to stop watching for changes,
   * if keys argument is omitted, remove all listeners
   * @argument keys
   */
  removeListeners(keys?: string[]) {
    const propsKeys = keys ? keys : Object.keys(this.dynamicVariableListeners);
    propsKeys.forEach((key) => {
      if (this.dynamicVariableListeners[key]) {
        this.dynamicVariableListeners[key].destroy();
        delete this.dynamicVariableListeners[key];
      }
    });
  }

  getSerializableValues(values: ObjectAny | undefined) {
    if (!values) return {};
    const serializableValues = { ...values };
    const propsKeys = Object.keys(serializableValues);
    for (let index = 0; index < propsKeys.length; index++) {
      const key = propsKeys[index];
      if (this.dynamicVariableListeners[key]) {
        serializableValues[key] = this.dynamicVariableListeners[key].dynamicVariable.toJSON();
      }
    }

    return serializableValues;
  }

  getAllSerializableValues() {
    const serializableValues: ObjectAny = {};
    const propsKeys = Object.keys(this.dynamicVariableListeners);
    for (let index = 0; index < propsKeys.length; index++) {
      const key = propsKeys[index];
      serializableValues[key] = this.dynamicVariableListeners[key].dynamicVariable.toJSON();
    }

    return serializableValues;
  }
}
