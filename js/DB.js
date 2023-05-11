const db = window.openDatabase("database", "1.0", "database", 1024 * 1024);

db.transaction((tx) => {
    tx.executeSql("DROP TABLE attendance");
    tx.executeSql("CREATE TABLE attendance (no INTEGER PRIMARY KEY , subject TEXT NOT NULL , term INTEGER NOT NULL , week INTEGER NOT NULL , checked BOOLEAN NOT NULL CHECK ( checked IN(0, 1) ), checked_date TEXT NOT NULL)");
});

function add(subject, term, weeks, checked, checked_date) {
    db.transaction((tx) => {
        tx.executeSql(`INSERT INTO attendance2 (subject, term, week, checked, checked_date)
                       VALUES ("${subject}", ${term}, ${weeks}, ${checked}, "${checked_date}")`, [], (tx, result) => {
            console.log("insert success");
        }, (tx, error) => {
            console.log(error.message);
        });
    });
}

function getAll() {
    return new Promise((resolve) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT *
                           FROM attendance2`, [], (tx, result) => {
                resolve(result);
            });
        });
    });
}

getAll().then((result) => {
    for (var i = 0; i < result.rows.length; i++) {
        var row = result.rows.item(i);
        console.log(row);
    }
});
