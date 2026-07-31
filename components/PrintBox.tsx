import { useState, useRef } from "react"

type Props = {
    rowNo: number;
    columnNo: number;
}

let nextPutColor: string = "black";//ゆくゆくはPlayGroundで管理。碁盤外にも情報を表示できるようにする。

function changeTurnColor() {
    console.log("next color:" + nextPutColor);
    if (nextPutColor === "white") {
        nextPutColor = "black";
    } else {
        nextPutColor = "white";
    }
}

let putCount: number = 0; //ゆくゆくはPlayGroundで管理。碁盤外にも情報を表示できるようにする。

export const PrintBox: React.FC<Props> = (props) => {
    //1マス1マスを描画
    const countNum: number = (props.rowNo) * 100 + (props.columnNo);
    let coorinateNumRef = useRef(0);
    coorinateNumRef.current = (props.rowNo) * 100 + (props.columnNo);

    //碁石の色を扱うState。初期値"void"（空白）、白または黒に変更される。変更後上書き不可。
    const [stoneColor, setStoneColor] = useState("void");

    function setGoishi(color: string) {
        //碁石の色["white","black"]を受け取って碁石を置く（マス目の円のクラスを加えて色を変える）
        if (stoneColor === "void"/*空白のときのみ配置可能*/) {
            console.log("stoneColor:" + stoneColor);
            setStoneColor(() => (color));//そのときのターンの色に変える
            if (putCount == 0/*1回目の配置のとき*/) {
                putCount++;
                console.log("putCount" + putCount);
                return;
            } else/*2回目の配置のとき*/ {
                changeTurnColor();
                console.log("next color:" + nextPutColor);
                putCount = 0;
                console.log("putCount" + putCount);
                return;
            }
        }
    }

    return (
        <div key={countNum} className="box">
            <div onClick={() => setGoishi(nextPutColor)}
                className={`stone ${coorinateNumRef} ${stoneColor === "white" ? "white" : ""} ${stoneColor === "black" ? "black" : ""} `}>
                {props.rowNo}-{props.columnNo}
            </div>
        </div>
    );
}