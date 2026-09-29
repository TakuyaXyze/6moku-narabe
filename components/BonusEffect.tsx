import "../styles/BonusEffect.css";
import { ROWS, COLUMNS } from "../computers/GameRule";
import { MoveCoordinate } from "../computers/Evaluate";

type Props = {
    text: string;
    cells: MoveCoordinate[];
}

export function BonusEffect({ text, cells }: Props) {
    if (cells.length === 0) return null;
    //十字の中心(複数なら中心の平均)の、1マス上の交点の上に表示
    const centerRowNo: number = cells.reduce((sum, cell) => sum + cell.rowNo, 0) / cells.length;
    const centerColumnNo: number = cells.reduce((sum, cell) => sum + cell.columnNo, 0) / cells.length;
    const top: number = (centerRowNo - 1) / ROWS * 100;
    const left: number = (centerColumnNo + 0.5) / COLUMNS * 100;

    return (
        <div className="bonus-effect" style={{ top: top + "%", left: left + "%" }}>
            ボーナス
            <br />
            {text}
        </div>
    );
}
