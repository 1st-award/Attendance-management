function checkTableCreate(weekN){
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

function managementTableCreate(){
  var html = '';
			
  for(key in tc){			
    html += '<tr>';
    html += '<td>'+tc[key].name+'</td>';
    for(week in tc[key].weeks){
      html += '<td>'+tc[key].weeks[week] +'</td>';
    }
    html += '<td>'+tc[key].absence+'</td>';
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
