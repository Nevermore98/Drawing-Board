const tools = document.getElementsByClassName('tool')
const range = document.getElementById('range')

const clear = document.getElementById('clear')
const undo = document.getElementById('undo')
const save = document.getElementById('save')

window.onbeforeunload = () => 'Reload site?'

let historyData = []

selectTool()

range.onchange = function () {
  lineWidth = this.value
}

clear.onclick = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  setCanvasBg('white')
}

undo.onclick = () => {
  if (historyData.length < 1) return
  top = historyData[historyData.length - 1]
  ctx.putImageData(historyData[historyData.length - 1], 0, 0)
  historyData.pop()
}

save.onclick = function () {
  let imgUrl = canvas.toDataURL('image/png')
  let saveA = document.createElement('a')
  document.body.appendChild(saveA)
  saveA.href = imgUrl
  saveA.download = 'pic' + (new Date).getTime()
  saveA.target = '_blank'
  saveA.click()
}

function selectTool() {
  for (let i = 0; i < tools.length; i++) {
    tools[i].onmousedown = function () {
      for (let i = 0; i < tools.length; i++) {
        tools[i].classList.remove('active')
        this.classList.add('active')
      }
    }
  }
}

function saveData(data) {
  // 撤销次数上限 10
  (historyData.length === 10) && (historyData.shift())
  historyData.push(data)
}
