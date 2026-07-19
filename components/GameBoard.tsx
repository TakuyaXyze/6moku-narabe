import "../styles/GameBoard.css"
import { ReactNode } from "react";

export const ROW = 19;
export const COLUMN = 19;

export function GameBoard() {

    const printBoxesTable = (): ReactNode => {
        //マス目の集合・碁盤を作成
        const printTd = (rowNo: number, columnNo: number): ReactNode => {
            //1マス1マスを描画
            //[1,1]→countNo=1, [2,19]→countNo=38, [5,15]→countNo=90,
            const countNo: number = (rowNo - 1) * 19 + (columnNo - 1);

            //タグのkeyにboxesMapのkeyを。circleで碁石を呼び出し。座標を表示。
            return (
                <div key={countNo} className="box">
                    <div className="circle">
                        {rowNo}-{columnNo}
                    </div>
                </div>
            );
        }

        const printTr = (rowNo: number): ReactNode => {
            //1行ずつを描画
            //行番号が並ぶ配列。配列の長さ=列数
            const rowNos: number[] = [];
            for (let i: number = 0; i < COLUMN; i++) {
                rowNos.push(i);
            }
            //1行ごとに<td>のブロックの塊を描画。
            return <div key={rowNo} className="row">{
                rowNos.map((columnNo: number) => printTd(rowNo, columnNo + 1))
            }</div>
        }

        const printTbody = (): ReactNode => {
            //全体を描画
            //列番号が並ぶ配列。配列の長さ=行数
            const columnNos: number[] = [];
            for (let i: number = 0; i < ROW; i++) {
                columnNos.push(i);
            }
            //1行ごとに<td>のブロックの塊を描画。
            return <div className="tbody">{
                columnNos.map((rowNo: number) => printTr(rowNo + 1))
            }</div>
        }

        return (
            <div className="table">
                <div className="thead"></div>
                {printTbody()}
            </div>
        )
    };

    return (
        <div className="gameBoard">
            {printBoxesTable()}
        </div>
    );
}