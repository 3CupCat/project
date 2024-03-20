// 意見反饋成功送出推播
const toastTrigger = document.getElementById('liveToastBtn')
const toastLiveExample = document.getElementById('liveToast')
if (toastTrigger) {
    toastTrigger.addEventListener('click', () => {
        const toast = new bootstrap.Toast(toastLiveExample)
        toast.show()
    })
}
// -------------------以下為遊戲內---------------------
let canvas = document.getElementById('chessBoard');
let ctx = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 640;
// 宣告陣列儲存棋子資料
let chessMapArr = [];
// 初始化棋子資料
for (let i = 0; i < 15; i++) {
    chessMapArr[i] = [];
    for (let j = 0; j < 15; j++) {
        chessMapArr[i][j] = 0;
    }
}
// 棋子顏色
let chessColor = ["black", "white"];
// 步數計算
let step = 0;
// 檢查勝利模式
let checkMode = [[0, 1], [1, 0], [1, 1], [1, -1]];
// 計時器
let timerInterval1;
let timerInterval2;
let timerIntervalArr = [timerInterval1, timerInterval2];
// --------------------以下移到html中--------------------
// // 設置倒計時秒數
// let timeInSeconds1 = 3600;
// let timeInSeconds2 = 3600;
// let timeInSecondsArr = [timeInSeconds1, timeInSeconds2];
// let timerIdArr = ['timer1', 'timer2'];
// // 悔棋次數
// let redoLimit1 = 10;
// let redoLimit2 = 10;
// --------------------以上移到html中--------------------
// 紀錄上一步位置，初始值為null
let lastMove = null;
// 紀錄上一步時間
let lastMoveTime;
// 繪製棋盤
for (let i = 0; i < 15; i++) {
    ctx.beginPath();
    // row
    ctx.moveTo(40, (i * 40) + 40);
    ctx.lineTo(600, (i * 40) + 40);
    // col
    ctx.moveTo((i * 40) + 40, 40);
    ctx.lineTo((i * 40) + 40, 600);
    ctx.closePath();
    ctx.strokeStyle = "#000000";
    ctx.stroke();
}
let redoForBlack = document.getElementById('redoForBlack');
let redoForWhite = document.getElementById('redoForWhite');
// 載入時，按鈕上呈現悔棋計數
document.getElementById('redoForBlack').innerText = `悔棋(${redoLimit1})`;
document.getElementById('redoForWhite').innerText = `悔棋(${redoLimit2})`;
// 未下棋時，不得悔棋
disabledRedo();
// 進入頁面時呈現剩餘時間
updateTimer(timeInSeconds1, 0);
updateTimer(timeInSeconds2, 1);
// 進入頁面執行timer1，step增加時，暫停timer1，切換為執行timer2
startTimer(step % 2);
// 清空棋子資料
function clearChessMapArr() {
    for (let i = 0; i < 15; i++) {
        chessMapArr[i] = [];
        for (let j = 0; j < 15; j++) {
            chessMapArr[i][j] = 0;
        }
    }
}
// 遊戲結束彈跳圖片
// 帶勝者資料，產生對應圖片
function gameOver(chess) {
    if (chess == chessColor[0]) {
        document.getElementById('overlay').style.display = 'flex';
        document.getElementById('popupImg').src = './img/blackWin.png';
    }
    else {
        document.getElementById('overlay').style.display = 'flex';
        document.getElementById('popupImg').src = './img/whiteWin.png';
    }
}
function startTimer(timerIndex) {
    timerIntervalArr[timerIndex] = setInterval(function () {
        updateTimer(timeInSecondsArr[timerIndex], timerIndex);
    }, 1000);
}
function stopTimer(timerIndex) {
    clearInterval(timerIntervalArr[timerIndex]);
}
function checkWin(x, y, chess, checkModeArr) {
    // 紀錄連珠數
    let cnt = 1;
    for (let j = 1; j < 5; j++) {
        let newX = x + j * checkModeArr[0];
        let newY = y + j * checkModeArr[1];
        // 檢查x、y軸是否超出棋盤、檢查是否有連珠
        if (newX >= 0 && newX < 15 && newY >= 0 && newY < 15 && chessMapArr[newX][newY] == chess) {
            cnt++;
        }
        else {
            break;
        }
    }
    for (let k = 1; k < 5; k++) {
        let newX = x - k * checkModeArr[0];
        let newY = y - k * checkModeArr[1];
        // 檢查x、y軸是否超出棋盤、檢查是否有連珠
        if (newX >= 0 && newX < 15 && newY >= 0 && newY < 15 && chessMapArr[newX][newY] == chess) {
            cnt++;
        }
        else {
            break;
        }
    }
    // 判斷勝利
    if (cnt >= 5) {
        console.log(`cnt為${cnt}`);
        // 倒計時暫停
        // stopTimer(step % 2);
        gameOver(chessColor[step % 2]);
        return true;
    }
}
// --------------------以下移到html中--------------------
// // 重置倒計時
// function resetTimer(resetTimerArr) {
//     for (let i = 0; i < timeInSecondsArr.length; i++) {
//         resetTimerArr[i] = 3600;
//         updateTimer(resetTimerArr[i], i);
//     }
//     startTimer(step % 2);
// }
// --------------------以上移到html中--------------------
// 清空棋盤
function clearChessBoard() {
    ctx.fillStyle = "#d8af3e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
// 繪製棋盤
function drawChessBoard() {
    for (let i = 0; i < 15; i++) {
        ctx.beginPath();
        // row
        ctx.moveTo(40, `${(i * 40) + 40}`);
        ctx.lineTo(600, `${(i * 40) + 40}`);
        // col
        ctx.moveTo(`${(i * 40) + 40}`, 40);
        ctx.lineTo(`${(i * 40) + 40}`, 600);
        ctx.closePath();
        ctx.strokeStyle = "#000000";
        ctx.stroke();
    }
}
// 繪製棋子
function myChess(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}
// 悔棋功能
function redo() {
    // 尚未下棋時，阻擋執行悔棋
    if (lastMove === null) {
        return;
    }
    // 連續觸發悔棋阻擋
    if (lastMove[0] === -1 || lastMove[1] === -1) {
        return;
    }
    // 將index轉換為x、y軸座標
    let xAxis = (lastMove[0] + 1) * 40;
    let yAxis = (lastMove[1] + 1) * 40;
    // chessMapArr初始化
    chessMapArr[lastMove[0]][lastMove[1]] = 0;
    // 重新渲染棋盤
    ctx.beginPath();
    // 以0,0為例，會在40,40畫半徑18的圓，不過PI會有一點多出來，所以設定半徑19
    ctx.arc(xAxis, yAxis, 19, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = "#d8af3e";
    ctx.fill();
    // 檢查是否為邊界、並重新渲染畫布
    // 檢查row
    ctx.beginPath();
    if (lastMove[0] == 0) {
        ctx.moveTo(xAxis, yAxis);
        ctx.lineTo(xAxis + 19, yAxis);
    }
    else if (lastMove[0] == 14) {
        ctx.moveTo(xAxis, yAxis);
        ctx.lineTo(xAxis - 19, yAxis);
    }
    else {
        ctx.moveTo(xAxis - 19, yAxis);
        ctx.lineTo(xAxis + 19, yAxis);
    }
    // 檢查col
    if (lastMove[1] == 0) {
        ctx.moveTo(xAxis, yAxis);
        ctx.lineTo(xAxis, yAxis + 19);
    }
    else if (lastMove[1] == 14) {
        ctx.moveTo(xAxis, yAxis);
        ctx.lineTo(xAxis, yAxis - 19);
    }
    else {
        ctx.moveTo(xAxis, yAxis - 19);
        ctx.lineTo(xAxis, yAxis + 19);
    }
    ctx.closePath();
    ctx.strokeStyle = "#000000";
    ctx.stroke();
    // 換方倒計時、還原開始前時間
    stopTimer(step % 2);
    timeInSecondsArr[step % 2] = lastMoveTime;
    startTimer((step + 1) % 2);
    // 更新倒數計時
    for (let i = 0; i < timeInSecondsArr.length; i++) {
        updateTimer(timeInSecondsArr[i], i);
    }
    // 設定為-1，用以判斷連續觸發悔棋
    lastMove = [-1, -1];
    // step校正
    step--;
}
function updateTimer(timeInSeconds, timerIndex) {
    let hours = Math.floor(timeInSeconds / 3600);
    let minutes = Math.floor((timeInSeconds % 3600) / 60);
    let seconds = timeInSeconds % 60;

    // 時間格式調整為00:00:00
    hours = String(hours).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    seconds = String(seconds).padStart(2, '0');

    document.getElementById(timerIdArr[timerIndex]).textContent = hours + ":" + minutes + ":" + seconds;

    if (timeInSeconds <= 0) {
        clearInterval(timerIntervalArr[timerIndex]);
        gameOver(chessColor[(step + 1) % 2]);
    } else {
        timeInSeconds--;
        timeInSecondsArr[timerIndex] = timeInSeconds;
    }
}
// 檢查悔棋
function disabledRedo() {
    // 遊戲開始時，都不能悔棋
    if (step == 0) {
        document.getElementById('redoForBlack').disabled = true;
        document.getElementById('redoForWhite').disabled = true;
    }
    // 白方下棋，沒有悔棋次數
    else if (step % 2 == 0 && redoLimit2 == 0) {
        document.getElementById('redoForBlack').disabled = true;
        document.getElementById('redoForWhite').disabled = true;
    }
    // 白方下棋，有悔棋次數
    else if (step % 2 == 0 && redoLimit2 != 0) {
        document.getElementById('redoForBlack').disabled = true;
        document.getElementById('redoForWhite').disabled = false;
    }
    // 黑方下棋，沒有悔棋次數
    else if (step % 2 != 0 && redoLimit1 == 0) {
        document.getElementById('redoForBlack').disabled = true;
        document.getElementById('redoForWhite').disabled = true;
    }
    // 黑方下棋，有悔棋次數
    else {
        document.getElementById('redoForBlack').disabled = false;
        document.getElementById('redoForWhite').disabled = true;
    }
}
// 關閉勝利圖、開始下一局
function newGame() {
    document.getElementById('overlay').style.display = 'none';
    clearChessMapArr();
    clearChessBoard();
    drawChessBoard();
    step = 0;
    resetTimer(timeInSecondsArr);
    lastMove = null;
    lastMoveTime = undefined;
    redoLimit1 = 1;
    redoLimit2 = 1;
    document.getElementById('redoForBlack').innerText = `悔棋(${redoLimit1})`;
    document.getElementById('redoForWhite').innerText = `悔棋(${redoLimit2})`;
    disabledRedo();
}
// 點擊悔棋按鈕時，執行悔棋、悔棋次數減少、更新按鈕計數、不得連續悔棋
redoForBlack.addEventListener('click', function (e) {
    redo();
    redoLimit1--;
    document.getElementById('redoForBlack').innerText = `悔棋(${redoLimit1})`;
    document.getElementById('redoForBlack').disabled = true;
})
redoForWhite.addEventListener('click', function (e) {
    redo();
    redoLimit2--;
    document.getElementById('redoForWhite').innerText = `悔棋(${redoLimit2})`;
    document.getElementById('redoForWhite').disabled = true;
})
// 滑鼠點擊後，生出棋子
canvas.addEventListener('click', function (e) {
    // 小於邊界設定，點擊不生出棋子
    if (e.offsetX < 20 || e.offsetX > 620 || e.offsetY < 20 || e.offsetY > 620) {
        return;
    }
    // 變數紀錄棋子x、y軸
    let xAxis = Math.floor((e.offsetX + 20) / 40) * 40;
    let yAxis = Math.floor((e.offsetY + 20) / 40) * 40;
    // 變數紀錄是否有勝者
    let temp;
    // 檢查當前位置是否沒有棋子
    if (chessMapArr[(xAxis / 40) - 1][(yAxis / 40) - 1] == 0) {
        // 呼叫繪製棋子function
        myChess(xAxis, yAxis, chessColor[step % 2]);
        // 繪製棋子後，把資料儲存到陣列中
        chessMapArr[(xAxis / 40) - 1][(yAxis / 40) - 1] = chessColor[step % 2];
        // 檢查陣列用
        // console.log(chessMapArr);
        // 檢查是否五連珠
        for (let i = 0; i < 4; i++) {
            temp = checkWin(xAxis / 40 - 1, yAxis / 40 - 1, chessColor[step % 2], checkMode[i]);
            if (temp === true) {
                // 倒計時暫停
                stopTimer(step % 2);
                return;
            }
        }
        // 儲存上一步的index
        lastMove = [(xAxis / 40) - 1, (yAxis / 40) - 1];
        // 檢查用
        // console.log(lastMoveTime);
        // console.log(`timeInSeconds1為${timeInSeconds1}`);
        // console.log(`timeInSeconds2為${timeInSeconds2}`);
        // console.log(`timeInSecondsArr[0]為${timeInSecondsArr[0]}`);
        // console.log(`timeInSecondsArr[1]為${timeInSecondsArr[1]}`);

        // 儲存對手剩餘時間；updateTimer會執行Math.floor，因此將時間+1調整誤差
        lastMoveTime = step % 2 == 0 ? timeInSecondsArr[1] + 1 : timeInSecondsArr[0] + 1;
        // 倒計時暫停
        stopTimer(step % 2);
        // 計算步數
        step++;
        // 倒計時換方
        startTimer(step % 2);
        // 檢查悔棋
        disabledRedo();
    }
})