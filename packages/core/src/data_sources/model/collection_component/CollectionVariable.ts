import { CollectionVariableDefinition } from '../../../../test/specs/dom_components/model/ComponentTypes';
import { Model } from '../../../common';
import EditorModel from '../../../editor/model/Editor';
import DataVariable, { DataVariableType } from '../DataVariable';
import { keyInnerCollectionState } from './constants';
import { CollectionState, CollectionsStateMap } from './types';

export default class CollectionVariable extends Model<CollectionVariableDefinition> {
  em: EditorModel;
  collectionsStateMap: CollectionsStateMap;
  dataVariable?: DataVariable;

  constructor(
    attrs: CollectionVariableDefinition,
    options: {
      em: EditorModel;
      collectionsStateMap: CollectionsStateMap;
    },
  ) {
    super(attrs, options);
    this.em = options.em;
    this.collectionsStateMap = options.collectionsStateMap;

    this.updateDataVariable();
  }

  hasDynamicValue() {
    return !!this.dataVariable;
  }

  getDataValue() {
    const { resolvedValue } = this.updateDataVariable();

    if (resolvedValue?.type === DataVariableType) {
      return this.dataVariable!.getDataValue();
    }
    return resolvedValue;
  }

  private updateDataVariable() {
    const resolvedValue = resolveCollectionVariable(
      this.attributes as CollectionVariableDefinition,
      this.collectionsStateMap,
      this.em,
    );

    let dataVariable;
    if (resolvedValue?.type === DataVariableType) {
      dataVariable = new DataVariable(resolvedValue, { em: this.em });
      this.dataVariable = dataVariable;
    }

    return { resolvedValue, dataVariable };
  }

  destroy() {
    return this.dataVariable?.destroy?.() || super.destroy();
  }
}

function resolveCollectionVariable(
  collectionVariableDefinition: CollectionVariableDefinition,
  collectionsStateMap: CollectionsStateMap,
  em: EditorModel,
) {
  const { collection_name = keyInnerCollectionState, variable_type, path } = collectionVariableDefinition;
  const collectionItem = collectionsStateMap[collection_name];

  if (!collectionItem) {
    em.logError(`Collection not found: ${collection_name}`);
    return '';
  }

  if (!variable_type) {
    em.logError(`Missing collection variable type for collection: ${collection_name}`);
    return '';
  }

  if (variable_type === 'current_item') {
    return resolveCurrentItem(collectionItem, path, collection_name, em);
  }

  return collectionItem[variable_type];
}

function resolveCurrentItem(
  collectionItem: CollectionState,
  path: string | undefined,
  collection_name: string,
  em: EditorModel,
) {
  const currentItem = collectionItem.current_item;

  if (!currentItem) {
    em.logError(`Current item is missing for collection: ${collection_name}`);
    return '';
  }

  if (currentItem.type === DataVariableType) {
    const resolvedPath = currentItem.path ? `${currentItem.path}.${path}` : path;
    return {
      ...currentItem,
      path: resolvedPath,
    };
  }

  if (path && !currentItem[path]) {
    em.logError(`Path not found in current item: ${path} for collection: ${collection_name}`);
    return '';
  }

  return path ? currentItem[path] : currentItem;
}
