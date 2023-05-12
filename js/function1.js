function checkBoxCreate(id = '') {
  var html = '';
  html += '<form class="'+id+'">';
  html += '<select class="checkbox" onchange="checkTableCreate(this.value)">';
  html += '<option value="-1">선택</option>'
  for (var i = 0; i < tc[0].weeks.length; i++) {
    html += '<option value="' + i + '">' + (i + 1) + '주차</option>';
  }
  html += '</select>';
  html += '</form>';
}

function changeText(id, string){
  document.getElementById(id).innerHTML = string;
}

function checkTableCreate(weekN){
  if(weekN != "-1") {
    changeText("nav-item","출석 체크 "+(parseInt(weekN)+1)+"주차")
    var html = '';
    for(key in tc){			
      html += '<tr>';
      html += '<td>'+tc[key].name+'</td>';
      html += '<td>'+tc[key].id+'</td>';
      html += '<td>'+tc[key].weeks[weekN] +'</td>';
      html += '</tr>';
    }	
    $("#checkbody").empty();		
    $("#checkbody").append(html);
  }
}

function managementTableCreate(){
  var html = '';
  
  for(key in tc){			
    html += '<tr>';
    html += '<td>'+tc[key].name+'</td>';
    for(week in tc[key].weeks){
      html += '<td>'+tc[key].weeks[week] +'</td>';
    }
    html += '<td>'+getAbsence(tc[key].weeks)+'</td>';
    html += '</tr>';
  }	
  $("#checkbody").empty();		
  $("#checkbody").append(html);
}

function studentManagementTableCreate(){
  var html = '';
			
  for(key in tc){			
    html += '<tr>';
    html += '<td>'+'<button onclick="selectStudent('+key+')">'+tc[key].name+'</button>'+'</td>';
    html += '<td>'+tc[key].id+'</td>';
    html += '<td>'+getAttendance(tc[key].weeks)+'</td>';
    html += '<td>'+getAbsence(tc[key].weeks)+'</td>';
    html += '</tr>';
  }	
  $("#checkbody").empty();		
  $("#checkbody").append(html);
}

function changeAttendance(row) {
  var table = document.getElementById("checkTable");
  var attendanceCell = table.getElementsByTagName("tr")[row+1].getElementsByTagName("td")[2];
  var attendanceValue = parseInt(attendanceCell.innerHTML); 
  if (attendanceValue === 1) {
    attendanceCell.innerHTML = "0";
  } else {
    attendanceCell.innerHTML = "1";
  }
}

function addTable(get_name, get_id){
  tc.push({
    name: get_name,
    id: get_id,
    weeks: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    absence: 0
  });
}

function selectStudent(key){
  document.getElementById("img").src = tc[key].img;
  document.getElementById("student-name").innerText = "이름";
  document.getElementById("student-id").innerText = "학번";
}

function getAttendance(getWeeks, attendanceN = 0){
  for(week in getWeeks){
    if (getWeeks[week] === 0){
      attendanceN += 1;
    }
  }
  return attendanceN;
}

function getAbsence(getWeeks, absenceN = 0){
  for(week in getWeeks){
    if (getWeeks[week] === 1){
      absenceN += 1;
    }
  }
  return absenceN;
}

function addRow(table_id, key) {
  // table element 찾기
  const table = document.getElementById(table_id);
  
  // 새 행(Row) 추가
  const newRow = table.insertRow();
  
  // 새 행(Row)에 Cell 추가
  const newCell1 = newRow.insertCell(0);
  const newCell2 = newRow.insertCell(1);
  const newCell3 = newRow.insertCell(2);
  const newCell4 = newRow.insertCell(3);
  
  // Cell에 텍스트 추가
  newCell1.innerText = tc[key].name;
  newCell2.innerText = tc[key].id;
  newCell3.innerText = getAttendance(tc[key].weeks);
  newCell4.innerText = getAbsence(tc[key].weeks);
}
