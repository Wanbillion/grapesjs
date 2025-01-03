import { ObjectAny } from '../../common';
import { CollectionsStateMap } from '../../data_sources/model/collection_component/types';
import EditorModel from '../../editor/model/Editor';
import Component from './Component';
import { DynamicValueWatcher } from './DynamicValueWatcher';

export class ComponentDynamicValueWatcher {
  private propertyWatcher: DynamicValueWatcher;
  private attributeWatcher: DynamicValueWatcher;

  constructor(
    component: Component | undefined,
    private options: {
      em: EditorModel;
      collectionsStateMap: CollectionsStateMap;
    },
  ) {
    this.propertyWatcher = new DynamicValueWatcher(component, this.createPropertyUpdater(), options);
    this.attributeWatcher = new DynamicValueWatcher(component, this.createAttributeUpdater(), options);
  }
  private createPropertyUpdater() {
    return (component: Component | undefined, key: string, value: any) => {
      if (!component) return;
      component.set(key, value, { fromDataSource: true, avoidStore: true });
    };
  }

  private createAttributeUpdater() {
    return (component: Component | undefined, key: string, value: any) => {
      if (!component) return;
      component.addAttributes({ [key]: value }, { fromDataSource: true, avoidStore: true });
    };
  }

  bindComponent(component: Component) {
    this.propertyWatcher.bindComponent(component);
    this.attributeWatcher.bindComponent(component);
  }

  getStaticValues(values: ObjectAny | undefined): ObjectAny {
    return this.attributeWatcher.getStaticValues(values);
  }

  areStaticValues(values: ObjectAny | undefined) {
    return this.attributeWatcher.areStaticValues(values);
  }

  addProps(props: ObjectAny) {
    this.propertyWatcher.addDynamicValues(props);
  }

  addAttributes(attributes: ObjectAny) {
    this.attributeWatcher.addDynamicValues(attributes);
  }

  setAttributes(attributes: ObjectAny) {
    this.attributeWatcher.setDynamicValues(attributes);
  }

  removeAttributes(attributes: string[]) {
    this.attributeWatcher.removeListeners(attributes);
  }

  getDynamicPropsDefs() {
    return this.propertyWatcher.getAllSerializableValues();
  }

  getDynamicAttributesDefs() {
    return this.attributeWatcher.getAllSerializableValues();
  }

  getAttributesDefsOrValues(attributes: ObjectAny) {
    return this.attributeWatcher.getSerializableValues(attributes);
  }

  getPropsDefsOrValues(props: ObjectAny) {
    return this.propertyWatcher.getSerializableValues(props);
  }

  destroy() {
    this.propertyWatcher.removeListeners();
    this.attributeWatcher.removeListeners();
  }
}
