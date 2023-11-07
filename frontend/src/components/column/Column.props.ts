import { Card } from "../../types";

export interface ColumnProps {
  title: string;
  cards: Card[];
  defaultWidth?: number | string;
  defaultHeight?: number | string;
}
