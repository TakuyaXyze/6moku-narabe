"use client";

import "../styles/GameBoard.css"
import { useState } from 'react'
import { ReactNode } from "react";
import { turnColor } from "./PlayGround";

export const ROW = 19;
export const COLUMN = 19;

export function GameBoard() {

    const [filled, setFilled] = useState(false); //碁石を操作したかどうかの判定装置が必要

    const printBoxesTable = (): ReactNode => {
        //マス目の集合・碁盤を作成
        const printBox = (rowNo: number, columnNo: number): ReactNode => {
            //1マス1マスを描画
            //[1,1]→countNo=1, [2,19]→countNo=38, [5,15]→countNo=90,
            const countNo: number = (rowNo - 1) * 19 + (columnNo - 1);
            //タグのkeyにboxesMapのkeyを。stoneで碁石を呼び出し。座標を表示。

            const [stoneColor, setStoneColor] = useState("void");
            function setGoishi(color: string) {
                //碁石の色["white","black"]を受け取って碁石を置く（マス目の円のクラスを加えて色を変える）
                if (1 == 1) { //上書きできないようにするのが難しいかも...
                    //そのときのターンの色に変える
                    setStoneColor(color);

                    setFilled(true);
                }
            }
            return (
                <div key={countNo} className="box">
                    <div onClick={() => setGoishi(turnColor)}
                        className={`stone 
                                    ${stoneColor === "white" ? "white" : ""} 
                                    ${stoneColor === "black" ? "black" : ""}
                                    `}>
                        {rowNo}-{columnNo}
                    </div>
                </div>
            );
        }

        const printRow = (rowNo: number): ReactNode => {
            //1行ずつを描画
            //行番号が並ぶ配列。配列の長さ=列数
            const rowNos: number[] = [];
            for (let i: number = 0; i < COLUMN; i++) {
                rowNos.push(i);
            }
            //1行ごとに<td>のブロックの塊を描画。
            return <div key={rowNo} className="row">{
                rowNos.map((columnNo: number) => printBox(rowNo, columnNo + 1))
            }</div>
        }

        const printBlock = (): ReactNode => {
            //全体を描画
            //列番号が並ぶ配列。配列の長さ=行数
            const columnNos: number[] = [];
            for (let i: number = 0; i < ROW; i++) {
                columnNos.push(i);
            }
            //1行ごとに<td>のブロックの塊を描画。
            return <div className="tbody">{
                columnNos.map((rowNo: number) => printRow(rowNo + 1))
            }</div>
        }

        return (
            <div className="table">
                <div className="thead"></div>
                {printBlock()}
            </div>
        )
    };

    return (
        <div className="gameBoard">
            {printBoxesTable()}
        </div>
    );
}