let global_week;

function createTable() {
    const week = prompt("출석할 주차를 입력해주세요");
    const title = document.querySelector(".nav-item");
    title.innerHTML = `출석 체크 ${week}주차`;
    global_week = week;

    const tbody = document.querySelector("#checkbody");
    $.get("https://mooro.iptime.org/student").done(function (student_list) {
        for (let i = 0; i < student_list.length; i++) {
            let student = student_list[i];
            let tr = document.createElement("tr");
            let name_td = document.createElement("td");
            let s_no_td = document.createElement("td");
            let check_td = document.createElement("td");
            let select_box = document.createElement("select");
            let check_opt = document.createElement("option");
            let n_check_opt = document.createElement("option");

            name_td.innerHTML = student["student_name"];
            s_no_td.innerHTML = student["student_no"];
            check_opt.value = "Y";
            check_opt.innerHTML = "출석";
            n_check_opt.value = "N";
            n_check_opt.innerHTML = "결석";
            // select box 추가
            select_box.appendChild(n_check_opt);
            select_box.appendChild(check_opt);
            check_td.appendChild(select_box);

            tr.appendChild(name_td);
            tr.appendChild(s_no_td);
            tr.appendChild(check_td);
            tbody.appendChild(tr);
            // DB에 N주차 출석현황 추가
            $.ajax({
                url: `https://mooro.iptime.org/attendance/add/${student["student_no"]}/${week}/N`,
                type: 'GET',
                error: function (error) {
                    if (error.status == 500) {
                        alert("중복 주차입니다");
                        location.reload();
                    }
                }
            });
        }
    });
}

function attendanceUpdate(s_no) {
    const tbody_childNodes = document.querySelector("tbody").childNodes;
    for (let i = 1; i < tbody_childNodes.length; i++) {
        if (tbody_childNodes[i].childNodes[1].innerText == s_no) {
            let options = tbody_childNodes[i].childNodes[2].childNodes[0].childNodes;
            options[0].selected = false;    // 결석
            options[1].selected = true;     // 출석
        }
    }
}

function checkComplete() {
    const tbody_childNodes = document.querySelector("tbody").childNodes;
    for (let i = 1; i < tbody_childNodes.length; i++) {
        let s_no = tbody_childNodes[i].childNodes[1].innerText;
        let select_box = tbody_childNodes[i].childNodes[2].childNodes[0];
        let check = select_box[select_box.selectedIndex].value;
        $.ajax({
            url: `https://mooro.iptime.org/attendance/update/${s_no}/${global_week}/${check}`,
            type: 'GET',
            error: function(error) {
                console.log("check error");
                console.log(error);
            }
        });
        alert("처리되었습니다");
    }
}