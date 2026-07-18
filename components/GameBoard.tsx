import "../styles/GameBoard.css"
import { ReactNode } from "react";

export function GameBoard() {

    const row = 19;
    const column = 19;

    type BoxesStatus = {
        rowNo: number,
        columnNo: number,
        status: string
    }

    const boxesMap = new Map<number, BoxesStatus>();
    let count: number = 0;
    while (count < row * column) {
        for (let i: number = 0; i < row; i++) {
            for (let j: number = 0; j < column; j++) {
                boxesMap.set(count, { rowNo: i + 1, columnNo: j + 1, status: "void" })
                count++;
            }
        }
    }

    const printBoxesTable = (): ReactNode => {
        //マス目の集合・碁盤を作成
        const printTd = (rowNo: number, columnNo: number): ReactNode => {
            //1マス1マスを描画
            //[1,1]→countNo=1, [2,19]→countNo=38, [5,15]→countNo=90,
            const countNo: number = (rowNo - 1) * 19 + (columnNo - 1);
            console.log("rowNo:" + rowNo + ",columnNo:" + columnNo);
            //タグのkeyにboxesMapのkeyを。座標を表示
            return <td key={countNo}>{rowNo}-{columnNo}</td>;
        }

        const printTr = (rowNo: number): ReactNode => {
            //1行ずつを描画
            //行番号が並ぶ配列。配列の長さ=列数
            const rowNos: number[] = [];
            for (let i: number = 0; i < column; i++) {
                rowNos.push(i);
            }
            console.log("rowNos:" + rowNos);
            //1行ごとに<td>のブロックの塊を描画。
            return <tr>{
                rowNos.map((columnNo: number) => printTd(rowNo, columnNo + 1))
            }</tr>
        }

        const printTbody = (): ReactNode => {
            //全体を描画
            //列番号が並ぶ配列。配列の長さ=行数
            const columnNos: number[] = [];
            for (let i: number = 0; i < row; i++) {
                columnNos.push(i);
            }
            console.log("columnNos:" + columnNos);
            //1行ごとに<td>のブロックの塊を描画。
            return <tr>{
                columnNos.map((rowNo: number) => printTr(rowNo + 1))
            }</tr>
        }

        return <table className="myTable">{printTbody()}</table>
    };

    return (
        <div className="gameBoard">
            {printBoxesTable()}
        </div>
    );
}