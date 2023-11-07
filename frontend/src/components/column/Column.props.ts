import { Card } from "../../types";

export interface ColumnProps {
  id: string;
  cards: Card[];
  defaultWidth?: number | string;
  defaultHeight?: number | string;
}
