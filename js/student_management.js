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