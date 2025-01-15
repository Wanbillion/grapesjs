import { CollectionComponentType, keyCollectionDefinition } from './constants';

import { ComponentDefinition } from '../../../dom_components/model/types';
import { CollectionVariableDefinition } from '../../../../test/specs/dom_components/model/ComponentTypes';
import { DataVariableDefinition } from '../DataVariable';

export type CollectionDataSource = any[] | DataVariableDefinition | CollectionVariableDefinition;

export interface CollectionConfig {
  startIndex?: number;
  endIndex?: number;
  dataSource: CollectionDataSource;
}

export enum CollectionStateVariableType {
  currentIndex = 'currentIndex',
  startIndex = 'startIndex',
  currentItem = 'currentItem',
  endIndex = 'endIndex',
  collectionName = 'collectionName',
  totalItems = 'totalItems',
  remainingItems = 'remainingItems',
}

export interface CollectionState {
  [CollectionStateVariableType.currentIndex]: number;
  [CollectionStateVariableType.startIndex]: number;
  [CollectionStateVariableType.currentItem]: any;
  [CollectionStateVariableType.endIndex]: number;
  [CollectionStateVariableType.collectionName]?: string;
  [CollectionStateVariableType.totalItems]: number;
  [CollectionStateVariableType.remainingItems]: number;
}

export interface CollectionsStateMap {
  [key: string]: CollectionState;
}

export interface CollectionComponentDefinition extends ComponentDefinition {
  [keyCollectionDefinition]: CollectionDefinition;
}

export interface CollectionDefinition {
  type: typeof CollectionComponentType;
  collectionName?: string;
  config: CollectionConfig;
  block: ComponentDefinition;
}
