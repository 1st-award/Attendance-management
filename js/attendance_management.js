function getCheck(data, student_id) {
    const check_list = []
    for (let i = 0; i < data.length; i++) {
        if (data[i]["attendance_s_no"] == student_id) {
            check_list.push(data[i]["attendance_check"] == "Y" ? "출석" : "결석");
        }
    }
    return check_list;
}

function managementTableCreate() {
    $.get("https://mooro.iptime.org/attendance").done(function (data) {
        const MAX_WEEK = data[data.length - 1]["attendance_week"];
        const TR_TAG = document.querySelector("tr");
        const TBODY = document.querySelector("tbody");
        // 헤더 추가
        for (let i = 1; i <= MAX_WEEK; i++) {
            let TH_TAG = document.createElement("th");
            TH_TAG.innerHTML = `${i}주차`;
            TR_TAG.appendChild(TH_TAG);
        }
        const TH_TAG = document.createElement("th");
        TH_TAG.innerHTML = "결석일수"
        TR_TAG.appendChild(TH_TAG)
        // 데이터 추가
        const insert_list = []
        for (let i = 0; i < data.length; i++) {
            let name = data[i]["student_name"];
            if (!insert_list.includes(name)) {
                let tr = document.createElement("tr");
                let student_no = data[i]["attendance_s_no"];
                let check_list = getCheck(data, student_no);
                // 이름 추가
                let name_td = document.createElement("td");
                name_td.innerHTML = name;
                tr.appendChild(name_td);
                // 출석 상태 추가
                for (let j = 0; j < check_list.length; j++) {
                    let td = document.createElement("td");
                    let select_box = document.createElement("select");
                    let check_opt = document.createElement("option");
                    let n_check_opt = document.createElement("option");
                    select_box.appendChild(n_check_opt);
                    select_box.appendChild(check_opt);

                    check_opt.value = "Y";
                    check_opt.innerHTML = "출석";
                    n_check_opt.value = "N";
                    n_check_opt.innerHTML = "결석";
                    check_list[j] == "출석" ? check_opt.selected = true : n_check_opt.selected = true;

                    td.appendChild(select_box);
                    tr.appendChild(td);
                }
                // 결석 일수 추가
                let n_td = document.createElement("td");
                n_td.innerHTML = `${check_list.filter(x => x === "결석").length}`;
                tr.appendChild(n_td);
                TBODY.appendChild(tr);
                insert_list.push(name);
            }
        }
    });
}

function executeCSV() {
    // 테이블 요소 선택
    const table = document.querySelector('#managementTable');
    // 헤더 데이터 추출
    const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());
    // 행 데이터 추출
    const rows = Array.from(table.querySelectorAll('tbody tr')).map(tr => {
        return Array.from(tr.querySelectorAll('td')).map(td => {
            if (td.textContent == "결석출석") {
                const select_box = td.children[0];
                return select_box[select_box.selectedIndex].innerHTML;
            } else
                return td.textContent.trim()
        });
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

function saveAttendance() {
    $.get("https://mooro.iptime.org/student").done(function (data) {
        const tbody_child = document.querySelector("#checkbody").childNodes;
        const student_dict = {};
        for (let i = 0; i < data.length; i++) {
            student_dict[data[i]["student_name"]] = data[i]["student_no"];
        }

        for (let i = 1; i < tbody_child.length; i++) {
            const tr = tbody_child[i].childNodes;
            const student_name = tr[0].innerText;
            const student_no = student_dict[student_name];
            for (let week = 1; week < tr.length - 1; week++) {
                const select_box = tr[week].childNodes[0];
                const check = select_box[select_box.selectedIndex].value;

                $.ajax({
                    url: `https://mooro.iptime.org/attendance/update/${student_no}/${week}/${check}`,
                    type: 'GET',
                    error: function (error) {
                        console.log("check error");
                        console.log(error);
                    }
                });
            }
        }
    });
    alert("저장되었습니다");
}