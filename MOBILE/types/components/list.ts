import { ReactElement } from "react";
import { GenericFunction } from "../utils";
import { RoutesChannel } from "@/constants";

export interface ChapterListProps {
  searchQuery: string;
}

export interface TermListProps {
  chapterTitle: any,
  chapterStatus: any
}

export interface ListsContainerProps {
  Data: any[]
  Title: string
  RefreshStatus?: boolean
  FetchData: GenericFunction
  ListEmptyComponent?: ReactElement
  Route?:RoutesChannel
  OnPress?:GenericFunction
  ShowScrollIndicator?: boolean
}