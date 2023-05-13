function studentManagementTableCreate() {
    const tbody = document.querySelector("tbody");
    $.get("https://mooro.iptime.org/student").done(function (data) {
        for (let i = 0; i < data.length; i++) {
            const name = data[i]["student_name"];
            const s_no = data[i]["student_no"];
            const ch_y = data[i]["student_y"];
            const ch_n = data[i]["student_n"];

            const tr = document.createElement("tr");
            const name_btn = document.createElement("button");
            const name_td = document.createElement("td");
            const s_no_td = document.createElement("td");
            const ch_y_td = document.createElement("td");
            const ch_n_td = document.createElement("td");

            name_btn.innerText = name;
            name_btn.onclick = () => {
                document.getElementById("img").src = `https://mooro.iptime.org/student/img/${s_no}`;
                document.getElementById("student_name").value = name;
                document.getElementById("student_number").value = s_no;
            };
            s_no_td.innerText = s_no;
            ch_y_td.innerText = ch_y;
            ch_n_td.innerText = ch_n;

            name_td.appendChild(name_btn);
            tr.appendChild(name_td);
            tr.appendChild(s_no_td);
            tr.appendChild(ch_y_td);
            tr.appendChild(ch_n_td);
            tbody.appendChild(tr);
        }
    });
}

function loadFile(input) {
    const file = input.files[0];
    document.getElementById("img").src = URL.createObjectURL(file);
}

function addStudent() {
    const image = document.getElementById("chooseFile").files[0];
    const name = document.getElementById("student_name").value;
    const s_id = document.getElementById("student_number").value;
    const formData = new FormData();
    formData.append("file", image, image.name);
    $.ajax({
        url: `https://mooro.iptime.org/student/img/upload/${s_id}`,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            // 요청이 성공한 경우 처리할 코드
            console.log("success");
        },
        error: function(xhr, status, error) {
            // 요청이 실패한 경우 처리할 코드
            console.log(error);
        }
    });


    const requestData = {
        student_no: parseInt(s_id),
        student_name: name
    };
    $.ajax({
        url: `https://mooro.iptime.org/student/add`,
        type: 'POST',
        data: JSON.stringify(requestData),
        contentType: 'application/json',
        dataType: 'json',
        success: function(response) {
            // 요청이 성공한 경우 처리할 코드
            console.log("success");
            alert("등록되었습니다");
            location.reload();
        },
        error: function(xhr, status, error) {
            // 요청이 실패한 경우 처리할 코드
            console.log(error);
            alert("중복 데이터 입니다");
        }
    });
}

function editStudent() {
    const name = document.getElementById("student_name").value;
    const s_id = document.getElementById("student_number").value;
    const requestData = {
        student_no: parseInt(s_id),
        student_name: name
    };

    $.ajax({
        url: "https://mooro.iptime.org/student/update",
        type: 'POST',
        data: JSON.stringify(requestData),
        contentType: 'application/json',
        dataType: 'json',
        success: function(response) {
            // 요청이 성공한 경우 처리할 코드
            console.log("success");
            alert("수정되었습니다");
            location.reload();
        },
        error: function(xhr, status, error) {
            // 요청이 실패한 경우 처리할 코드
            console.log("등록되지않은 학번이거나, 학생입니다");
        }
    });
}

function deleteStudent() {
    const s_id = document.getElementById("student_number").value;
    $.ajax({
        url: `https://mooro.iptime.org/student/delete/${s_id}`,
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        success: function(response) {
            // 요청이 성공한 경우 처리할 코드
            alert("삭제되었습니다");
            location.reload();
        },
        error: function(xhr, status, error) {
            // 요청이 실패한 경우 처리할 코드
            alert("존재하지 않는 학번입니다");
        }
    });
}

function executeCSV() {
    // 테이블 요소 선택
    const table = document.querySelector('#checkTable');

    // 헤더 데이터 추출
    const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());

    // 행 데이터 추출
    const rows = Array.from(table.querySelectorAll('tbody tr')).map(tr => {
        return Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim());
    });

    // CSV 문자열 생성
    const csvData = [headers, ...rows].map(row => row.join(',')).join('\n');

    // CSV 파일 생성 및 다운로드
    const blob = new Blob(["\uFEFF", csvData], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);

    // 다운로드 링크 생성
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.csv';
    document.body.appendChild(link);

    // 다운로드 링크 클릭
    link.click();

    // URL 객체 삭제
    URL.revokeObjectURL(url);
}