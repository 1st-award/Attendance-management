const db = window.openDatabase("database", "1.0", "database", 1024 * 1024);

db.transaction((tx) => {
    tx.executeSql("CREATE TABLE attendance (no INTEGER PRIMARY KEY , subject TEXT NOT NULL , term INTEGER NOT NULL , week INTEGER NOT NULL , checked BOOLEAN NOT NULL CHECK ( checked IN(0, 1) ), checked_date TEXT NOT NULL)");
    tx.executeSql("CREATE TABLE student (s_no INTEGER PRIMARY KEY , name TEXT NOT NULL)");
});

function addAttendance(subject, term, weeks, checked, checked_date) {
    db.transaction((tx) => {
        tx.executeSql(`INSERT INTO attendance2 (subject, term, week, checked, checked_date)
                       VALUES ("${subject}", ${term}, ${weeks}, ${checked}, "${checked_date}")`, [], (tx, result) => {
            console.log("insert success");
        }, (tx, error) => {
            console.log(error.message);
        });
    });
}

function getAllAttendance() {
    return new Promise((resolve) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT *
                           FROM attendance2`, [], (tx, result) => {
                resolve(result);
            });
        });
    });
}
