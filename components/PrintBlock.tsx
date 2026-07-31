"use client";

import "../styles/GameBoard.css"
import { useState, ReactNode } from 'react'
import { printRow } from "./PrintRow"


export const printBlock = (rowNos: number[]): ReactNode => {
    //各行を並べて碁盤全体を描画

    //1行ごとに{COLUMN}列のブロックの塊を描画、を{ROW}行繰り返す。
    return <div className="block">{
        rowNos.map((rowNo: number) => printRow(rowNo))
    }</div>
}