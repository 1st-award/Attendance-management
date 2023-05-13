const video = document.getElementById('video')
const labels = [];
// 등록된 학생 라벨 추가
$.get("https://mooro.iptime.org/student").done(function (student_list) {
    for (let i = 0; i < student_list.length; i++) {
        labels.push(student_list[i]["student_no"]);
    }
});

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/Attendance-management/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/Attendance-management/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/Attendance-management/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/Attendance-management/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/Attendance-management/models')
]).then(startVideo())


// face expression recognition model
function startVideo() {
    navigator.mediaDevices.getUserMedia({video: true}).then(function (stream) {
        video.srcObject = stream;
    }).catch(function (err0r) {
        console.log("Something went wrong!");
    });
}


// face expression recognition model
video.addEventListener('play', () => {
    const canvas = document.getElementById('overlay')
    const displaySize = {width: video.width, height: video.height}
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        const labeledFaceDescriptors = await loadLabeledImages()
        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)

        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors().withFaceExpressions()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

        const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))

        if (results.length != 0 && results[0]._distance >= 0.1) {
            if (results[0]._label == "unknown") {
                alert("등록되지 않은 얼굴입니다. 등록을 먼저해주세요");
            }
            attendanceUpdate(results[0]._label);
        }
        results.forEach((result, i) => {
            const box = resizedDetections[i].detection.box
            const drawBox = new faceapi.draw.DrawBox(box, {label: result.toString()})
            drawBox.draw(canvas)
        })

    }, 100)
})


// face recognition model with Avengers images
function loadLabeledImages() {
    return Promise.all(
        labels.map(async label => {
            const descriptions = []
            const img = await faceapi.fetchImage(`https://mooro.iptime.org/student/img/${label}`)
            const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
            descriptions.push(detections.descriptor)
            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    )

    // return Promise.all(
    //     labels.map(async label => {
    //         const descriptions = []
    //         for (let i = 1; i <= 2; i++) {
    //             const img = await faceapi.fetchImage(`/Attendance-management/labeled_images/${label}/${i}.jpg`)
    //             const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
    //             descriptions.push(detections.descriptor)
    //         }
    //         return new faceapi.LabeledFaceDescriptors(label, descriptions)
    //     })
    // )
}
