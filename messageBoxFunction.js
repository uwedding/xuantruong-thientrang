// Hàm xử lý dữ liệu và hiển thị MessageBox
function Handle_MessageBox(
  sheetId,
  range,
  nameCol,
  messageCol,
  filterCol,
  filterValue
) {
  // URL để lấy dữ liệu từ Google Sheets
  const sheetIDLoiChuc = "1DvzWRB_s8ft0x_mB9nmkcmtTvMoWWyu7uCUkvo2TSmg";
  const urlLoiChuc = `https://docs.google.com/spreadsheets/d/${sheetIDLoiChuc}/gviz/tq?tqx=out:json`;

  fetch(urlLoiChuc)
    .then((res) => res.text())
    .then((data) => {
      // Dữ liệu trả về của Google Sheets có phần thừa ở đầu/cuối => cắt đi
      const jsonText = data.substr(47).slice(0, -2);
      const parsed = JSON.parse(jsonText);

      const rows = parsed.table.rows.map((row) =>
        row.c.map((cell) => cell?.v || "")
      );
      const headers = rows[0];

      messages = rows.slice(1).map((row) => {
        let obj = {};
        headers.forEach((key, i) => {
          obj[key] = row[i];
        });
        return obj;
      });

      const getMessage = messages.filter(
        (msg) => msg["Ai thấy lời chúc"] === "Mọi người"
      );

      const container = document.getElementById("MessageBox");

      getMessage?.reverse().map((msg) => {
        // Tạo khung chứa message item
        const item = document.createElement("div");
        item.classList.add("MessageBox-item");

        // Tên (h2)
        const name = document.createElement("h2");
        name.classList.add("MessageBox-item-name");
        name.appendChild(document.createTextNode(msg["Tên"]));

        // Nội dung message (p)
        const message = document.createElement("p");
        message.classList.add("MessageBox-item-message");
        message.appendChild(document.createTextNode(msg["Lời chúc"]));

        // Gắn vào item
        item.append(name, message);

        // Thêm vào container
        container.appendChild(item);
      });
    });
}

// Hàm lắng nghe click và refresh messagebox
function Refesh_MessageBox(
  triggerSelector,
  sheetId,
  range,
  nameCol,
  messageCol,
  filterCol,
  filterValue
) {
  $(document).ready(function () {
    $(triggerSelector).click(function () {
      // Refresh 3 lần với khoảng cách thời gian khác nhau
      setTimeout(function () {
        $("#MessageBox").empty();
        Handle_MessageBox(
          sheetId,
          range,
          nameCol,
          messageCol,
          filterCol,
          filterValue
        );
      }, 2000);

      setTimeout(function () {
        $("#MessageBox").empty();
        Handle_MessageBox(
          sheetId,
          range,
          nameCol,
          messageCol,
          filterCol,
          filterValue
        );
      }, 5000);

      setTimeout(function () {
        $("#MessageBox").empty();
        Handle_MessageBox(
          sheetId,
          range,
          nameCol,
          messageCol,
          filterCol,
          filterValue
        );
      }, 10000);
    });
  });
}

// Hàm chạy MessageBox (kết hợp refresh và load ban đầu)
function run_MessageBox(
  triggerSelector,
  sheetId,
  range,
  nameCol,
  messageCol,
  filterCol,
  filterValue
) {
  Refesh_MessageBox(
    triggerSelector,
    sheetId,
    range,
    nameCol,
    messageCol,
    filterCol,
    filterValue
  );
  Handle_MessageBox(
    sheetId,
    range,
    nameCol,
    messageCol,
    filterCol,
    filterValue
  );
}
