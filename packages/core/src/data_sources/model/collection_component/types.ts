import { CollectionComponentType, keyCollectionDefinition } from './constants';

import { ComponentDefinition } from '../../../dom_components/model/types';
import { CollectionVariableDefinition } from '../../../../test/specs/dom_components/model/ComponentTypes';
import { DataVariableDefinition } from '../DataVariable';

type CollectionDataSource = any[] | DataVariableDefinition | CollectionVariableDefinition;
type CollectionConfig = {
  startIndex?: number;
  endIndex?: number;
  dataSource: CollectionDataSource;
};

export enum CollectionStateVariableType {
  currentIndex = 'currentIndex',
  startIndex = 'startIndex',
  currentItem = 'currentItem',
  endIndex = 'endIndex',
  collectionName = 'collectionName',
  totalItems = 'totalItems',
  remainingItems = 'remainingItems',
}

export type CollectionState = {
  [CollectionStateVariableType.currentIndex]: number;
  [CollectionStateVariableType.startIndex]: number;
  [CollectionStateVariableType.currentItem]: any;
  [CollectionStateVariableType.endIndex]: number;
  [CollectionStateVariableType.collectionName]?: string;
  [CollectionStateVariableType.totalItems]: number;
  [CollectionStateVariableType.remainingItems]: number;
};

export type CollectionsStateMap = {
  [key: string]: CollectionState;
};

export type CollectionComponentDefinition = {
  [keyCollectionDefinition]: CollectionDefinition;
} & ComponentDefinition;

export type CollectionDefinition = {
  type: typeof CollectionComponentType;
  collectionName?: string;
  config: CollectionConfig;
  block: ComponentDefinition;
};
