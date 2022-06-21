//自己github上的資料
const url = "https://fan-hua-hsuan.github.io/APPLE/APPLE_json.json";
// 宣告空間
let ipad_json;
let storage = [];
let networks = [];
let storage_gb = "64GB";
let div_selector = "";

//網頁載完之後 才載入json資料
window.onload = function () {
    let xhr = new XMLHttpRequest();
    //スッテプ4、 要請許可を戴いてからすること↓
    xhr.onload = function () {
        //4 -> xhr 下載完成 && 200 -> 網頁接收完成  ( xhr.status == 200 等於 xhr.statusText == "OK" )
        if (xhr.readyState == 4 && xhr.status == 200) {
            //將json網址 讀取之後轉成json格式
            // ipad_json = JSON.parse(this.responseText);

            // 因為使用 xhr.responseType = "json" 所以不用像上面那行轉換格式;
            ipad_json = this.response;
            // console.log(ipad_json);
            color_div();
            storage_div();
            network_div();

            // ipad_json[0]['buy'] = "jimmy";
        } else {
            alert('發⽣錯誤，HTTP response代碼：' + xhr.status);
        }
    }
    //スッテプ1、URLをオープン
    xhr.open("GET", url);
    //スッテプ2、応えるスタイルはjsonを設定する
    xhr.responseType = "json";
    //スッテプ3、要請を求める
    xhr.send();

}
// カーラーを切替
function change_img(_color) {
    // まず、置くとこゲットする
    let ipad_img = document.getElementById('ipad_img');
    // 
    ipad_img.setAttribute('src', _color + '.png');

}

//取得 符合儲存空間&網路的價格
function get_price(_storage, _network) {
    let price = ipad_json[0].other.filter(x => x.storage == _storage && x.network == _network)[0].price;
    // 回傳值
    return price;
}
// 抓金額
function change_price(_storage, _network) {
    let price = get_price(_storage, _network);
    // console.log(price);
    let show_price = document.getElementById("show_price");
    show_price.innerText = 'NT$ ' + price;
}

function change_div_bgc(_id, _type){
    let div =document.querySelector("#div_"+_id);
    //判斷是否選擇同一個
    //判斷目前選擇的是否重複，是的話移除
    if(div.classList.contains('div_selected') ){       
        div.classList.remove("div_selected");    
    }
    //否則，新增class名稱div_selected(改背景用的)
    else{        
        div.classList.add("div_selected");    
    }

    //移除選擇以外的背景顏色 分別判斷儲存空間的 網路的 顏色的
    if( _type == "GB"){
        if(_id == "256GB"){
            let div =document.querySelector("#div_64GB");
            div.classList.remove("div_selected");
        }
        else{
            let div =document.querySelector("#div_256GB");
            div.classList.remove("div_selected");
        }
    }
    else if(_type =="network" ){
        if(_id == "Wi-Fi"){
            let div =document.querySelector("#div_Cellular");
            div.classList.remove("div_selected");
        }
        else{
            let div =document.querySelector("#div_Wi-Fi");
            div.classList.remove("div_selected");
        }
    }
    else if(_type =="color"){
        if(div_selector != ""){
            let div_selected = document.querySelector(div_selector);
            div_selected.classList.remove("div_selected");
        }
        div_selector = "#div_"+_id;
    }
}   

function color_div() {
    // let color = ["gray", "pink", "Purple", "blue", "starlight"];
    let color = [];
    // jsonからカーラーをcolorに保存
    ipad_json[0].color.forEach((value, index) => {
        color.push(value);
    });

    //同じものを削除↓
    color = [...new Set(color)];
    // console.log(color);
    color.forEach((value, index) => {

        let d = document.createElement('div');
        let i = document.createElement('img');
        let p = document.createElement('p');

        i.setAttribute("src", color[index] + '.jpg');
        p.innerText = color[index];
        p.classList.add("m-0");
        d.setAttribute("id","div_"+color[index]);
        d.classList.add("col-5", "border", "text-center", "m-2","py-2", "my_rounded");
        i.classList.add("img_style");
        d.addEventListener("click", function () {
            // 點擊改變圖片
            change_img(color[index]);
            change_div_bgc(value,"color");
        });

        d.append(i);
        d.append(p);
        let color_stlye = document.getElementById("color_stlye");
        color_stlye.append(d);

    });

}

function storage_div() {
    // 一開始要抓出陣列的值並存進去
    ipad_json[0].other.forEach((value, index) => {
        // 用push新增進去陣列
        storage.push(value.storage);
    });
    //刪除重複的東西
    storage = [...new Set(storage)];
    //抓id
    let _storage_div = document.getElementById('storage');
    // 迭代出每一項
    storage.forEach(value => {
        let d = document.createElement('div');
        let p = document.createElement('p');

        //設div id
        d.setAttribute("id","div_"+value);
        //  我想知道金額，所以我把這邊的值丟過去算，再存回去
        let _price = get_price(value, "Wi-Fi");
        // console.log(value)
        // 增加d的class
        p.classList.add("m-0");
        d.classList.add("col-5", "border", "text-center", "m-2","py-2", "my_rounded");
        //顯示出GB && 金額
        p.innerHTML = `${value}<br/>NT$ ${_price}`;
        // d新增p
        d.append(p);
        _storage_div.append(d);
        //點到d產生的反應，通常放在最後面比較好:)
        d.addEventListener("click", function () {
            change_price(value, "Wi-Fi");
            // 把值存起來
            storage_gb = value;
            // 抓會變動價格的ID
            let WiFi_price = document.getElementById("Wi-Fi_price");
            // 把點擊後獲得的金額判斷完後存入_price
            let _price = get_price(value, "Wi-Fi");
            // 把抓到的ID，放入想要顯示的資料
            WiFi_price.innerHTML = `Wi-Fi</br>NT$ ${_price}`;
            // 把抓到的ID，放入想要顯示的資料
            let Cellular_price = document.getElementById("Cellular_price");
            //把欲想買的4G?wifi?點擊後，判斷值是否為"Cellular"?然後抓到金額
            _price = get_price(value, "Cellular");
            // console.log(value)
            // 放入金額
            Cellular_price.innerHTML = `Cellular</br>NT$ ${_price}`;
            change_div_bgc(value,"GB");
            //d.classList.add("div_selected");

        });
    });
}

function network_div() {
    // 抓陣列
    ipad_json[0].other.forEach(value => {
        0
        networks.push(value.network);
    });
    //刪除重複的東西
    networks = [...new Set(networks)];
    // console.log(networks);
    //抓network的id
    let network_div = document.getElementById('network');

    networks.forEach(network => {
        // 建div
        let d = document.createElement('div');
        // 建p
        let p = document.createElement('p');
        let _price = get_price(storage_gb, network);

        //設div id
        d.setAttribute("id","div_"+network);
        // 加ID上去
        p.setAttribute('id', network + '_price')
        // 顯示網路 && 金額
        p.innerHTML = `${network}<br/>NT$ ${_price}`;
        // 加class
        p.classList.add("m-0");
        d.classList.add("col-5", "border", "text-center", "m-2","py-2", "my_rounded");
        // d 裡放p
        d.append(p);
        // 父層加d
        network_div.append(d);
        // d的事件聆聽，點擊改價錢
        d.addEventListener("click", function () {
            change_price(storage_gb, network);
            change_div_bgc(network,"network");
        });
    });

    console.log(network_div.cloneNode());
    console.log(network_div.cloneNode(true));
}