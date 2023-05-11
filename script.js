const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('../App/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('../App/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('../App/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('../App/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('../App/models')
]).then(startVideo())


// face expression recognition model
function startVideo() {
  navigator.mediaDevices.getUserMedia({video: true}).then(function (stream) {
    video.srcObject = stream;
  }).catch(function (err0r) {
    console.log("Something went wrong!");
  });
  //onPlay()
}

////////////////////////////////////////////////////////
// Face-api 가이드 예제 코드
/*
async function onPlay() {
  let tinyOptions = new faceapi.TinyFaceDetectorOptions({ inputSize: 128, scoreThreshold: 0.5 })
  const result = await faceapi.detectAllFaces(video, tinyOptions).withFaceLandmarks().withFaceExpressions()
  console.log('1')
  if (result) {
    const canvas = $('#overlay').get(0)
    const dims = faceapi.matchDimensions(canvas, video, true)
    faceapi.draw.drawDetections(canvas, faceapi.resizeResults(result, dims))
  }

  setTimeout(() => onPlay())
}
*/

////////////////////////////////////////////////////////

/*
async function start() {
  const container = document.createElement('div')
  container.style.position = 'relative'
  document.body.append(container)
  const labeledFaceDescriptors = await loadLabeledImages()
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
  let image
  let canvas
  document.body.append('Loaded')
  imageUpload.addEventListener('change', async () => {
    if (image) image.remove()
    if (canvas) canvas.remove()
    image = await faceapi.bufferToImage(video.files[0])
    container.append(image)
    canvas = faceapi.createCanvasFromMedia(image)
    container.append(canvas)
    const displaySize = { width: image.width, height: image.height }
    faceapi.matchDimensions(canvas, displaySize)
    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box
      const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
      drawBox.draw(canvas)
    })
  })
}
*/


// face expression recognition model
video.addEventListener('play', () => {
  const canvas = document.getElementById('overlay')
  const displaySize = { width: video.width, height: video.height }
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
    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box
      const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
      drawBox.draw(canvas)
    })

  }, 100)
})


// face recognition model with Avengers images
function loadLabeledImages() {
  const labels = ['Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Jo', 'Thor', 'Tony Stark']
  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      for (let i = 1; i <= 2; i++) {
        const img = await faceapi.fetchImage(`../App/labeled_images/${label}/${i}.jpg`)
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
      }

      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}
