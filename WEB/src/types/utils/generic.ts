import { FC } from 'react'

export type GenericFunction = GenericFunctionConstructor<any>

type GenericFunctionConstructor<T> = (...args: any[]) => T

export type GenericVoidFunction = GenericFunctionConstructor<void | Promise<void>>

interface ClassName {
  ClassName?: string
}

export interface Dict<T> {
  [key: string]: T
}

export interface Id {
  Id?: string | number
}

export interface Logs {
  CreatedBy?: number;
  DateCreated?: Date;
  UpdatedBy?: number | null;
  DateUpdated?: Date | null;
}

export type SFC<P = Record<string, unknown>> = FC<P & ClassName>

export enum Booleans {
  TRUE = 'true',
  FALSE = 'false'
}

export enum Status {
  default = 'default',
  lock = 'lock',
  unlock = 'unlock',
  bookmark = 'bookmark',
}